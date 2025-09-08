import React, { useState, useEffect, useRef } from 'react';

interface Command {
  input: string;
  output: string[];
}

interface Song {
  name: string;
  audioSrc: string;
  imageSrc: string;
}

interface FileSystemItem {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileSystemItem[];
  createdAt: string;
  modifiedAt: string;
}

export default function Terminal({ onBack }: { onBack?: () => void }) {
  const [history, setHistory] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [bootSequenceIndex, setBootSequenceIndex] = useState(0);
  const [showBootComplete, setShowBootComplete] = useState(false);
  const [showCliPrompt, setShowCliPrompt] = useState(false);
  const [username, setUsername] = useState('');
  const [awaitingUsername, setAwaitingUsername] = useState(false);
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState('/home');
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [bootSoundCompleted, setBootSoundCompleted] = useState(false);
  const [commandsShown, setCommandsShown] = useState(false);
  const [currentBootMessages, setCurrentBootMessages] = useState<string[]>([]);
  const [progressValues, setProgressValues] = useState<Record<string, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bootSoundRef = useRef<HTMLAudioElement>(null);
  const shutdownSoundRef = useRef<HTMLAudioElement>(null);

  // File system utilities (in-memory only)
  const normalizePath = (base: string, target: string): string => {
    const isAbs = target.startsWith('/');
    const raw = isAbs ? target : (base === '/' ? `/${target}` : `${base}/${target}`);
    const parts = raw.split('/');
    const stack: string[] = [];
    for (const p of parts) {
      if (p === '' || p === '.') continue;
      if (p === '..') {
        if (stack.length) stack.pop();
      } else {
        stack.push(p);
      }
    }
    return '/' + stack.join('/');
  };

  const splitParentAndName = (absPath: string): { parent: string; name: string } => {
    const norm = absPath === '' ? '/' : absPath;
    if (norm === '/') return { parent: '/', name: '' };
    const parts = norm.split('/').filter(Boolean);
    const name = parts.pop() || '';
    const parent = '/' + parts.join('/');
    return { parent: parent === '' ? '/' : parent, name };
  };

  const getDirChildren = (absPath: string, fs: FileSystemItem[]): FileSystemItem[] | null => {
    if (absPath === '/' || absPath === '') return fs;
    const parts = absPath.split('/').filter(Boolean);
    let current = fs;
    for (const part of parts) {
      const found = current.find(i => i.type === 'directory' && i.name === part);
      if (!found || !found.children) return null;
      current = found.children;
    }
    return current;
  };

  const findItemAtPath = (absPath: string, fs: FileSystemItem[]): FileSystemItem | null => {
    if (absPath === '/' || absPath === '') return { name: '/', type: 'directory', children: fs, createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString() };
    const { parent, name } = splitParentAndName(absPath);
    const dirChildren = getDirChildren(parent, fs);
    if (!dirChildren) return null;
    return dirChildren.find(i => i.name === name) || null;
  };

  const findItemInPath = (path: string, fs: FileSystemItem[]): FileSystemItem | null => findItemAtPath(path, fs);

  const getCurrentDirectoryContents = (): FileSystemItem[] => {
    const children = getDirChildren(currentDirectory, fileSystem);
    return children || [];
  };

  const createFile = (name: string, content: string = ''): FileSystemItem => {
    return {
      name,
      type: 'file',
      content,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };
  };

  const createDirectory = (name: string): FileSystemItem => {
    return {
      name,
      type: 'directory',
      children: [],
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };
  };

  const updateFileAtPath = (absPath: string, newContent: string, fs: FileSystemItem[]): FileSystemItem[] => {
    const cloned = deepCloneFileSystem(fs);
    const { parent, name } = splitParentAndName(absPath);
    
    let current = cloned;
    if (parent !== '/' && parent !== '') {
      const parts = parent.split('/').filter(Boolean);
      for (const part of parts) {
        const found = current.find(i => i.type === 'directory' && i.name === part);
        if (!found || !found.children) return fs;
        current = found.children;
      }
    }
    
    const file = current.find(i => i.name === name && i.type === 'file');
    if (file) {
      file.content = newContent;
      file.modifiedAt = new Date().toISOString();
    }
    
    return cloned;
  };

  const deepCloneFileSystem = (fs: FileSystemItem[]): FileSystemItem[] => {
    return fs.map(item => ({
      ...item,
      children: item.children ? deepCloneFileSystem(item.children) : undefined
    }));
  };

  const addItemAtPath = (absParentPath: string, item: FileSystemItem, fs: FileSystemItem[]): FileSystemItem[] => {
    const cloned = deepCloneFileSystem(fs);
    
    if (absParentPath === '/' || absParentPath === '') {
      const exists = cloned.find(i => i.name === item.name);
      if (!exists) cloned.push(item);
      return cloned;
    }
    
    const parts = absParentPath.split('/').filter(Boolean);
    let current = cloned;
    
    for (const part of parts) {
      const found = current.find(i => i.type === 'directory' && i.name === part);
      if (!found || !found.children) return fs;
      current = found.children;
    }
    
    const exists = current.find(i => i.name === item.name);
    if (!exists) current.push(item);
    return cloned;
  };

  const removeItemAtPath = (absParentPath: string, itemName: string, fs: FileSystemItem[]): FileSystemItem[] => {
    const cloned = deepCloneFileSystem(fs);
    
    if (absParentPath === '/' || absParentPath === '') {
      const idx = cloned.findIndex(i => i.name === itemName);
      if (idx >= 0) cloned.splice(idx, 1);
      return cloned;
    }
    
    const parts = absParentPath.split('/').filter(Boolean);
    let current = cloned;
    
    for (const part of parts) {
      const found = current.find(i => i.type === 'directory' && i.name === part);
      if (!found || !found.children) return fs;
      current = found.children;
    }
    
    const idx = current.findIndex(i => i.name === itemName);
    if (idx >= 0) current.splice(idx, 1);
    return cloned;
  };

  const headerMessage = [
    '',
    '╔══════════════════════════════════════════════════════════════════╗',
    '║                                                                  ║',
    '║                    ORANGECAT TECHNOLOGIES                        ║',
    '║                   ════════════════════════                       ║',
    '║                    SYNTX SYSTEM v2025.3                          ║',
    '║                   ════════════════════════                       ║',
    '║                                                                  ║',
    '║  ███╗░░██╗███████╗░█████╗░  ░██████╗██╗░░░██╗███╗░░██╗████████╗██╗░░██╗  ║',
    '║  ████╗░██║██╔════╝██╔══██╗  ██╔════╝╚██╗░██╔╝████╗░██║╚══██╔══╝╚██╗██╔╝  ║',
    '║  ██╔██╗██║█████╗░░██║░░██║  ╚█████╗░░╚████╔╝░██╔██╗██║░░░██║░░░░╚███╔╝░  ║',
    '║  ██║╚████║██╔══╝░░██║░░██║  ░╚═══██╗░░╚██╔╝░░██║╚████║░░░██║░░░░██╔██╗░  ║',
    '║  ██║░╚███║███████╗╚█████╔╝  ██████╔╝░░░██║░░░██║░╚███║░░░██║░░░██╔╝╚██╗  ║',
    '║  ╚═╝░░╚══╝╚══════╝░╚════╝░  ╚═════╝░░░░╚═╝░░░╚═╝░░╚══╝░░░╚═╝░░░╚═╝░░╚═╝  ║',
    '║                                                                  ║',
    '║               Prithvi Chohan\'s Private Terminal                  ║',
    '║                                                                  ║',
    '╚══════════════════════════════════════════════════════════════════╝',
  ];

  // Generate animated loading indicators
  const getSpinner = (frame: number) => ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'][frame % 10];
  const getProgressBar = (progress: number) => '█'.repeat(progress) + '░'.repeat(10 - progress);

  // Static boot sequence for progression (without animations)
  const staticBootSequence = [
    'Initializing neural interface... [progress]',
    'Establishing secure connection... [progress]',
    'Scanning system for vulnerabilities... [progress]',
    'Loading device drivers... [progress]',
    'Synchronizing system clock... [progress]',
    'Finalizing system configuration... [progress]',
    '',
    '╔══════════════════════════════════════╗',
    '║         BOOT COMPLETE                ║',
    '║     Neural link established          ║',
    '╚══════════════════════════════════════╝',
  ];

  // Dynamic boot sequence with animations for display
  const getAnimatedBootSequence = (messages: string[], _frame: number, progress: Record<string, number>) => {
    return messages.map((message) => {
      const progressKey = message.split('...')[0];
      const currentProgress = progress[progressKey] || 0;

      if (message.includes('[progress]')) {
        return `${progressKey}... [${getProgressBar(currentProgress)}]`;
      }
      return message;
    });
  };

  const commandReference = [
    '',
    '╔══════════════════ AVAILABLE COMMANDS ═══════════════════════════╗',
    '║                                                                 ║',
    '║   help       - Display all available commands                   ║',
    '║   about      - Learn about Prithvi and Orangecat Technologies   ║',
    '║   projects   - View current projects and ventures               ║',
    '║   skills     - Display technical skills and expertise           ║',
    '║   experience - View professional background                     ║',
    '║   syntx      - Information about SyntX AI assistant             ║',
    '║   music      - Access the integrated music player               ║',
    '║   contact    - Get contact information and links                ║',
    '║                                                                 ║',
    '║   whoami     - Display current user information                 ║',
    '║   date       - Show current date and time                       ║',
    '║   uptime     - Display system uptime statistics                 ║',
    '║   pwd        - Print working directory                          ║',
    '║   clear      - Clear the terminal screen                        ║',
    '║   exit       - Return to the Matrix                             ║',
    '║                                                                 ║',
    '║   ls         - List directory contents                          ║',
    '║   cd         - Change directory                                 ║',
    '║   mkdir      - Create directory                                 ║',
    '║   touch      - Create empty file                                ║',
    '║   cat        - Display file contents                            ║',
    '║   echo       - Write text to file                               ║',
    '║   rm         - Remove file or directory                         ║',
    '║   curl       - Make HTTP/HTTPS requests                         ║',
    '║   ping       - Measure latency to a host (HTTP/HTTPS)           ║',
    '║                                                                 ║',
    '╚═════════════════════════════════════════════════════════════════╝',
    '',
    'Type any command and press Enter to begin your journey...',
    '',
  ];

  const commands = {
    help: [
      'Available commands:',
      '',
      '  about       - Learn about Prithvi and Orangecat Technologies',
      '  syntx       - Information about SyntX AI assistant',
      '  projects    - View current projects and ventures',
      '  skills      - Display technical skills and tech stack',
      '  contact     - Get contact information and links',
      '  experience  - View professional experience',
      '  music       - Access the music player',
      '  clear       - Clear the terminal screen',
      '  whoami      - Display current user info',
      '  date        - Show current date and time',
      '  uptime      - Show system uptime',
      '  pwd         - Print working directory',
      '  exit        - Return to the Matrix',
      '',
      'File System Commands:',
      '  ls          - List directory contents',
      '  cd [dir]    - Change directory',
      '  mkdir [dir] - Create directory',
      '  touch [file]- Create empty file',
      '  cat [file]  - Display file contents',
      '  echo [text] > [file] - Write text to file',
      '  rm [file]   - Remove file or directory',
      '',
      'Network Commands:',
      '  curl [url]  - Make HTTP/HTTPS request',
      '  ping [host] - Measure latency to a host (HTTP/HTTPS)',
      '',
      'Type any command to get started.',
    ],
    about: [
      '=== ABOUT PRITHVI CHOHAN ===',
      '',
      'Name: Prithvi Chohan',
      'Role: Founder & Engineer at Orangecat Technologies',
      'Status: Building SyntX - AI coding assistant for developers',
      '',
      'I am the founder of Orangecat Technologies, dedicated to revolutionizing',
      'how developers code, debug, and ship software. My mission is to make',
      'AI-powered development tools accessible to every developer worldwide.',
      '',
      'Current Focus:',
      '• Deep Learning and fine-tuning Large Language Models',
      '• Building AI agents that actually understand code',
      '• Scaling cloud infrastructure for high volume traffic',
      '• Pushing AI to the edge with on-premise LLM inferencing',
      '',
      'Philosophy: "Building the future, one commit at a time."',
    ],
    projects: [
      '=== CURRENT PROJECTS & VENTURES ===',
      '',
      '[1] SYNTX_AI.dev',
      '    Status: ACTIVE',
      '    Description: AI coding assistant supporting 120+ languages',
      '    Tech Stack: Python, PyTorch, TypeScript, React, Qualcomm',
      '    Users: 5,600+ developers and counting',
      '    Special: Sovereign AI for India initiative',
      '',
      '[2] LAGRANGE_OFFLINE.ai',
      '    Status: ACTIVE',
      '    Description: On-device AI for Snapdragon X series',
      '    Tech: On-Device AI, Snapdragon X, 45 TOPS NPU',
      '    Showcase: Qualcomm Snapdragon X Launch event',
      '',
      '[3] INVOICE_AI_OPTIMIZER',
      '    Status: COMPLETED',
      '    Description: LLM-powered invoice processing system',
      '    Tech: LLMs, Gemini, GPT-4o, Python, NLP',
      '    Impact: 25x capacity increase, 40 language support',
      '',
      '[4] AD_BANNER_AUTOMATION',
      '    Status: COMPLETED',
      '    Description: Automated PSD generation and banner resizing',
      '    Tech: Python, Flask, Docker, Google Cloud, JSX',
      '    Impact: 50-70% time reduction in design workflow',
      '',
      'Type "contact" to collaborate on any project.',
    ],
    skills: [
      '=== TECHNICAL SKILLS MATRIX ===',
      '',
      'Core Systems:',
      '█████████████████████ Centering a Div (95%)',
      '███████████████████   PyTorch (90%)',
      '█████████████████     Pandas (80%)',
      '███████████████       Numpy (70%)',
      '█████████████         Matplotlib (60%)',
      '',
      'Programming Languages:',
      '█████████████████████ Python (90%)',
      '███████████████████   JavaScript/TypeScript (65%)',
      '█████████████████     C+++ (40%)',
      '',
      'Cloud & Infrastructure:',
      '█████████████████████ Google Cloud (95%)',
      '███████████████████   AWS (75%)',
      '███████████████       Cloudflare (70%)',
      '',
      'Databases:',
      '█████████████████     MySQL (80%)',
      '███████████████       MongoDB (70%)',
    ],
    contact: [
      '=== CONTACT INFORMATION ===',
      '',
      '📧 Email: prithvi@orangecat.ai',
      '🐙 GitHub: github.com/Kraken2003',
      '💼 LinkedIn: linkedin.com/in/prithvichohan',
      '🌐 SyntX: syntx.dev',
      '🏢 Orangecat: orangecat.ai',
      '',
      '📍 Location: New Delhi, India',
      '⏰ Timezone: IST (UTC+5:30)',
      '',
      'Available for:',
      '• AI/ML consulting and development',
      '• Speaking engagements on AI in development',
      '• Collaboration on AI-powered tools',
      '• Technical mentorship in deep learning',
      '',
      'Response time: Usually within 24 hours',
      '',
      'Qualcomm ISV Partner | Building the AI revolution',
    ],
    experience: [
      '=== PROFESSIONAL EXPERIENCE ===',
      '',
      '🚀 CURRENT: Co-Founder | SyntX by OrangeCat',
      '   Duration: July 2024 - Present',
      '   Location: Noida, Uttar Pradesh, India',
      '   Focus: Building SyntX AI coding assistant, Qualcomm ISV Partner',
      '   Impact: 5,600+ developers using SyntX',
      '',
      '💻 AI Engineer (Freelance) | Gauge Advertising',
      '   Duration: April 2024 - June 2024',
      '   Location: Delhi, India',
      '   Focus: Automated ad banner resizing, 50-70% time reduction',
      '   Tech: Python, Flask, Docker, Google Cloud',
      '',
      '⚡ AI Intern | Olive Gaea',
      '   Duration: June 2024 - August 2024',
      '   Location: Dubai, UAE (Remote)',
      '   Focus: LLM-powered invoice processing, 25x capacity increase',
      '   Tech: LLMs, Gemini, GPT-4o, Python, NLP',
      '',
      '🎓 Logistics Head | Society of Robotics, DTU',
      '   Duration: January 2021 - February 2024',
      '   Location: Delhi, India',
      '   Focus: Organized tech events, conducted techfest tournaments',
      '',
      'Education:',
      '• Delhi Technological University (Formerly DCE)',
      '• Bachelor of Technology, Engineering Physics',
      '• Minor in Computer Science and Engineering',
      '',
      'Awards & Recognition:',
      '• Qualcomm ISV Partner',
      '• 5,600+ developers on SyntX',
      '• Building sovereign AI for India',
    ],
    whoami: [
      'prithvi singh chohan',
      '',
      'User privileges: sudo, docker, kubectl, python, pytorch',
      'Shell: /bin/bash',
      'Groups: ai-engineers, founders, developers, orangecat-team',
    ],
    date: [
      new Date().toString(),
    ],
    uptime: [
      'System uptime: Building AI since 2020',
      'Lines of code: 500,000+',
      'SyntX users: 5,600+ developers',
      'AI agentic systems deployed: 5 in production',
    ],
    pwd: [
      currentDirectory,
    ],
    syntx: [
      '=== SYNTX AI CODING ASSISTANT ===',
      '',
      'SyntX is an AI-powered coding assistant that revolutionizes',
      'how developers write, debug, and ship software.',
      '',
      'Key Features:',
      '• Intelligent code completion and suggestions',
      '• Real-time debugging assistance',
      '• Automated code refactoring',
      '• Multi-language support (120+ languages)',
      '• Context-aware recommendations',
      '• On-device AI capabilities',
      '',
      'Sovereign AI for India:',
      '• Making coding accessible in native Indian languages',
      '• Breaking English-only barriers in tech education',
      '• From Kashmir to Kanyakumari - coding for everyone',
      '',
      'Current Stats:',
      '• 5,600+ active developers',
      '• 500+ LLMs fine-tuned',
      '• Qualcomm ISV Partner',
      '• Available at syntx.dev',
      '',
      'Built by SyntX by OrangeCat - architecting the future',
      'of AI-powered development tools for India.',
      '',
      'Visit syntx.dev to try it out!',
    ],
    clear: [],
    music: [
      '=== MUSIC PLAYER ===',
      '',
      'Music commands:',
      '  play        - Play current song',
      '  play [num]  - Play song by number (e.g., play 1)',
      '  play [name] - Play song by name (e.g., play time)',
      '  pause       - Pause current song',
      '  next        - Play next song',
      '  prev        - Play previous song',
      '  list        - Show playlist',
      '  status      - Show current song status',
      '',
      'Available songs:',
      ...(songs.length > 0 ? songs.map((song, index) => `  [${index + 1}] ${song.name}`) : ['  No songs loaded']),
      '',
      'Type "play" to start the music, or "play [number/name]" for specific songs!',
    ],
    play: [
      'Starting music playback...',
      'This output should not be seen - play command handled dynamically.',
    ],
    pause: [
      'Music paused.',
      'Type "play" to resume.',
    ],
    next: [
      'Skipping to next song...',
      ...(songs.length > 0 ? [
        `Now playing: ${songs[(currentSongIndex + 1) % songs.length]?.name || 'Unknown'}`,
      ] : ['No songs available.']),
    ],
    prev: [
      'Skipping to previous song...',
      ...(songs.length > 0 ? [
        `Now playing: ${songs[(currentSongIndex - 1 + songs.length) % songs.length]?.name || 'Unknown'}`,
      ] : ['No songs available.']),
    ],
    list: [
      '=== PLAYLIST ===',
      '',
      ...(songs.length > 0 ? songs.map((song, index) =>
        `${index === currentSongIndex ? '▶' : ' '} [${index + 1}] ${song.name}${index === currentSongIndex && isPlaying ? ' (NOW PLAYING)' : ''}`
      ) : ['No songs loaded']),
      '',
      'Usage:',
      '  play [number] - Play by track number (e.g., "play 1")',
      '  play [name]   - Play by song name (e.g., "play time")',
      '  play          - Play current/selected song',
    ],
    status: [
      '=== MUSIC STATUS ===',
      '',
      ...(songs.length > 0 ? [
        `Current song: ${songs[currentSongIndex]?.name || 'Unknown'}`,
        `Status: ${isPlaying ? 'Playing' : 'Paused'}`,
        `Progress: ${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')} / ${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`,
        `Song ${currentSongIndex + 1} of ${songs.length}`,
      ] : ['No songs loaded']),
    ],
    exit: [
      'Shutting down system...',
      'Goodbye, choom.',
    ],
    ls: [
      '=== DIRECTORY CONTENTS ===',
      '',
      ...getCurrentDirectoryContents().map(item => {
        const type = item.type === 'directory' ? 'd' : '-';
        const size = item.type === 'file' ? (item.content?.length || 0) : '-';
        const date = new Date(item.modifiedAt).toLocaleDateString();
        return `${type}rwxr-xr-x 1 ${username || 'user'} users ${size.toString().padStart(8)} ${date} ${item.name}`;
      }),
      '',
      `Total: ${getCurrentDirectoryContents().length} items`,
    ],
    cd: [
      'Usage: cd [directory]',
      'Change to the specified directory.',
      'Use "cd .." to go up one level.',
      'Use "cd /" to go to root directory.',
    ],
    mkdir: [
      'Usage: mkdir [directory_name]',
      'Create a new directory in the current location.',
    ],
    touch: [
      'Usage: touch [filename]',
      'Create a new empty file.',
    ],
    cat: [
      'Usage: cat [filename]',
      'Display the contents of a file.',
    ],
    echo: [
      'Usage: echo [text] > [filename]',
      'Write text to a file (overwrites existing content).',
      'Example: echo "Hello World" > hello.txt',
    ],
    rm: [
      'Usage: rm [filename] or rm -r [directory]',
      'Remove a file or directory.',
      'Use -r flag to remove directories recursively.',
    ],
    curl: [
      'Usage: curl [URL]',
      'Make an HTTP/HTTPS request to the specified URL.',
      'Example: curl https://api.github.com/users/octocat',
    ],
    ping: [
      'Usage: ping [host or URL]',
      'Measures latency via HTTP/HTTPS request timing.',
      'Examples:',
      '  ping google.com',
      '  ping https://example.com',
    ],
  };

  // Initialize file system (in-memory)
  useEffect(() => {
    const initialFs: FileSystemItem[] = [
      createDirectory('home'),
      createDirectory('tmp'),
      createDirectory('var'),
    ];
    setFileSystem(initialFs);
  }, []);

  // Load songs from manifest (works reliably in both dev and production)
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const { songs: manifestSongs } = await import('../songManifest');
        const processedSongs = manifestSongs.map(song => ({
            ...song,
            audioSrc: `${(import.meta as any).env.BASE_URL || ''}${song.audioSrc}`,
            imageSrc: song.imageSrc ? `${(import.meta as any).env.BASE_URL || ''}${song.imageSrc}` : ''
        }));
        setSongs(processedSongs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading songs:', error);
        setIsLoading(false);
      }
    };

    loadSongs();
  }, []);

  // Update boot sequence display with animations
  useEffect(() => {
    if (currentBootMessages.length > 0) {
      setHistory(prev => {
        const animatedMessages = getAnimatedBootSequence(currentBootMessages, 0, progressValues);
        return [{ input: '', output: [...headerMessage, ...animatedMessages] }];
      });
    }
  }, [currentBootMessages, progressValues]);

  // Boot sequence animation
  useEffect(() => {
    if (bootSequenceIndex === 0) {
      // Start with header message (which now includes the ASCII art)
      setHistory([{ input: '', output: headerMessage }]);
      setCurrentBootMessages([]); // Initialize empty boot messages
      // Play boot sound and set up completion handler
      if (bootSoundRef.current) {
        bootSoundRef.current.play().catch(console.error);
        bootSoundRef.current.onended = () => {
          setBootSoundCompleted(true);
        };
      } else {
        // If no boot sound, mark as completed immediately
        setBootSoundCompleted(true);
      }
      setBootSequenceIndex(1);
    } else if (bootSequenceIndex > 0 && bootSequenceIndex <= staticBootSequence.length) {
      // Variable timing based on message type for more realistic boot sequence
      const getDelay = (index: number) => {
        if (index === 1) return 0; // First line appears instantly
        const message = staticBootSequence[index - 1];
        if (message.includes('BOOT COMPLETE')) return 500;
        if (message.includes('╔') || message.includes('║') || message.includes('╚')) return 100;
        if (message === '') return 200; // Empty lines faster
        if (message.includes('Scanning')) return 4000; // Slower for effect
        if (message.includes('Finalizing')) return 3500; // Slower for effect
        return 2500; // Default speed for other progress bars
      };

      const timer = setTimeout(() => {
        const newMessage = staticBootSequence[bootSequenceIndex - 1];
        setCurrentBootMessages(prev => [...prev, newMessage]);

        if (newMessage.includes('[progress]')) {
          const progressKey = newMessage.split('...')[0];
          let progress = 0;
          const progressSpeed = newMessage.includes('Scanning') ? 400 : 
                               newMessage.includes('Finalizing') ? 350 : 250;
          
          const interval = setInterval(() => {
            progress += 1;
            setProgressValues(prev => ({ ...prev, [progressKey]: progress }));
            if (progress >= 10) {
              clearInterval(interval);
              // Only advance to next step after progress bar completes for final step
              if (newMessage.includes('Finalizing')) {
                setTimeout(() => {
                  setBootSequenceIndex(prev => prev + 1);
                }, 500);
                return;
              }
            }
          }, progressSpeed);
        }

        // Don't advance immediately for the final progress bar step
        if (!newMessage.includes('Finalizing') || !newMessage.includes('[progress]')) {
          setBootSequenceIndex(prev => prev + 1);
        }
      }, getDelay(bootSequenceIndex));

      return () => clearTimeout(timer);
    } else if (bootSequenceIndex === staticBootSequence.length + 1 && !showBootComplete) {
      // Boot sequence complete, now wait for username input
      const timer = setTimeout(() => {
        setAwaitingUsername(true);
        setShowBootComplete(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [bootSequenceIndex, showBootComplete]);

  // Focus input when CLI prompt becomes visible
  useEffect(() => {
    if ((awaitingUsername || showCliPrompt) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [awaitingUsername, showCliPrompt]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      // Auto-play next song
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [songs.length]);

  // Update audio source when song changes
  useEffect(() => {
    if (songs.length > 0 && audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].audioSrc;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSongIndex, songs, isPlaying]);

  // Handle CLI prompt timing - show only after both username and boot sound are complete
  useEffect(() => {
    if (username && bootSoundCompleted && !awaitingUsername && !commandsShown) {
      // If username was entered before boot sound completed, update history to show commands
      const welcomeMessage = [
        ...headerMessage,
        '',
        `Neural signature "${username}" registered successfully.`,
        `Welcome to SyntX Terminal, ${username}!`,
        '',
        ...commandReference
      ];
      setHistory([{ input: '', output: welcomeMessage }]);
      setCommandsShown(true);
      setShowCliPrompt(true);
    }
  }, [username, bootSoundCompleted, awaitingUsername, commandsShown]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();
    let output: string[] = [];

    if (cmd === 'clear') {
      // Keep the header message visible when clearing
      setHistory([{ input: '', output: headerMessage }]);
      return;
    }

    if (cmd === 'exit') {
      setIsShuttingDown(true);
      output = ['Shutting down system...', 'Goodbye, choom.'];
      
      // Add the command to history first
      const newCommand = { input: command, output };
      setHistory(prev => [...prev, newCommand]);
      
      // Play shutdown sound and transition after it completes
      if (shutdownSoundRef.current && onBack) {
        shutdownSoundRef.current.play().catch(console.error);
        shutdownSoundRef.current.onended = () => {
          onBack();
        };
      } else if (onBack) {
        // Fallback if no shutdown sound
        setTimeout(() => onBack(), 1000);
      }
      return;
    }

    // Handle file system commands
    if (cmd === 'ls') {
      const contents = getCurrentDirectoryContents();
      if (contents.length === 0) {
        output = ['Directory is empty.'];
      } else {
        output = contents.map(item => {
          const type = item.type === 'directory' ? 'd' : '-';
          const size = item.type === 'file' ? (item.content?.length || 0) : '-';
          const date = new Date(item.modifiedAt).toLocaleDateString();
          return `${type}rwxr-xr-x 1 ${username || 'user'} users ${size.toString().padStart(8)} ${date} ${item.name}`;
        });
      }
    } else if (cmd.startsWith('cd ')) {
      const targetPath = cmd.slice(3).trim();
      
      if (!targetPath || targetPath === '~') {
        // Go to home directory
        setCurrentDirectory('/home');
        output = [`Changed directory to /home`];
      } else {
        // Use normalizePath for proper path handling
        const newPath = normalizePath(currentDirectory, targetPath);
        
        // Check if directory exists
        const targetDir = findItemInPath(newPath, fileSystem);
        if (targetDir && targetDir.type === 'directory') {
          setCurrentDirectory(newPath);
          output = [`Changed directory to ${newPath}`];
        } else {
          output = [`cd: ${targetPath}: No such file or directory`];
        }
      }
    } else if (cmd.startsWith('mkdir ')) {
      const dirNameRaw = cmd.slice(6).trim();
      if (!dirNameRaw) {
        output = ['mkdir: missing operand'];
      } else {
        const absPath = normalizePath(currentDirectory, dirNameRaw);
        const { parent, name } = splitParentAndName(absPath);
        if (!name) {
          output = ['mkdir: invalid directory name'];
        } else {
          const newDir = createDirectory(name);
          const updatedFs = addItemAtPath(parent, newDir, fileSystem);
          setFileSystem(updatedFs);
          output = [`Created directory: ${name}`];
        }
      }
    } else if (cmd.startsWith('touch ')) {
      const fileRaw = cmd.slice(6).trim();
      if (!fileRaw) {
        output = ['touch: missing file operand'];
      } else {
        const absPath = normalizePath(currentDirectory, fileRaw);
        const { parent, name } = splitParentAndName(absPath);
        const newFile = createFile(name);
        const updatedFs = addItemAtPath(parent, newFile, fileSystem);
        setFileSystem(updatedFs);
        output = [`Created file: ${name}`];
      }
    } else if (cmd.startsWith('cat ')) {
      const fileRaw = cmd.slice(4).trim();
      if (!fileRaw) {
        output = ['cat: missing file operand'];
      } else {
        const absPath = normalizePath(currentDirectory, fileRaw);
        const { name } = splitParentAndName(absPath);
        const file = findItemInPath(absPath, fileSystem);
        if (file && file.type === 'file') {
          output = file.content ? file.content.split('\n') : ['(empty file)'];
        } else {
          output = [`cat: ${name}: No such file`];
        }
      }
    } else if (cmd.includes(' > ')) {
      // Handle echo command with redirection
      const parts = cmd.split(' > ');
      if (parts.length === 2) {
        let text = parts[0].trim();
        const fileRaw = parts[1].trim();
        
        // Handle echo command specifically
        if (text.startsWith('echo ')) {
          text = text.slice(5).trim();
          // Remove quotes if present
          if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
            text = text.slice(1, -1);
          }
        }
        
        if (fileRaw) {
          const absPath = normalizePath(currentDirectory, fileRaw);
          const { parent, name } = splitParentAndName(absPath);
          
          // Check if file already exists
          const existingFile = findItemInPath(absPath, fileSystem);
          let updatedFs: FileSystemItem[];
          
          if (existingFile && existingFile.type === 'file') {
            // Update existing file
            updatedFs = updateFileAtPath(absPath, text, fileSystem);
          } else {
            // Create new file
            const newFile = createFile(name, text);
            updatedFs = addItemAtPath(parent, newFile, fileSystem);
          }
          
          setFileSystem(updatedFs);
          output = [`Written to file: ${name}`];
        } else {
          output = ['echo: missing file operand'];
        }
      }
    } else if (cmd.startsWith('rm ')) {
      const args = cmd.slice(3).trim().split(/\s+/);
      const flags = args.filter(arg => arg.startsWith('-'));
      const files = args.filter(arg => !arg.startsWith('-'));
      
      const isRecursive = flags.some(flag => flag.includes('r'));
      
      if (files.length === 0) {
        output = ['rm: missing operand'];
      } else {
        const fileRaw = files[0]; // Handle first file for now
        const absPath = normalizePath(currentDirectory, fileRaw);
        const { parent, name } = splitParentAndName(absPath);
        const item = findItemInPath(absPath, fileSystem);
        
        if (!item) {
          output = [`rm: ${fileRaw}: No such file or directory`];
        } else if (item.type === 'directory' && !isRecursive) {
          output = [`rm: ${fileRaw}: is a directory (use -r flag)`];
        } else {
          const updatedFs = removeItemAtPath(parent, name, fileSystem);
          setFileSystem(updatedFs);
          output = [`Removed: ${name}`];
        }
      }
    } else if (cmd.startsWith('curl ')) {
      const url = cmd.slice(5).trim();
      if (!url) {
        output = ['curl: missing URL operand'];
      } else {
        // Create initial command in history with "Making HTTP request..."
        const initialCommand = { input: command, output: ['Making HTTP request...'] };
        setHistory(prev => [...prev, initialCommand]);
        
        try {
          const start = performance.now();
          const response = await fetch(url);
          const end = performance.now();
          const data = await response.text();
          
          // Update the command output with the response
          const finalOutput = [
            `HTTP ${response.status} ${response.statusText}`,
            `Content-Type: ${response.headers.get('content-type') || 'unknown'}`,
            `Request took: ${(end - start).toFixed(1)} ms`,
            '',
            data.length > 1000 ? data.substring(0, 1000) + '... (truncated)' : data
          ];
          
          // Update the history with final output
          setHistory(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { input: command, output: finalOutput };
            return updated;
          });
          
          return; // Early return to prevent adding another command to history
        } catch (error) {
          // Update with error message
          setHistory(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              input: command,
              output: [`curl: error: ${error instanceof Error ? error.message : 'Unknown error'}`]
            };
            return updated;
          });
          return; // Early return to prevent adding another command to history
        }
      }
    } else if (cmd.startsWith('ping ')) {
      const target = cmd.slice(5).trim();
      if (!target) {
        output = ['ping: missing host operand'];
      } else {
        const url = target.startsWith('http://') || target.startsWith('https://')
          ? target
          : `https://${target}`;
        
        // Create initial command in history with ping header
        const initialCommand = {
          input: command,
          output: [`PING ${target} via HTTP/HTTPS:`, 'Starting ping test...']
        };
        setHistory(prev => [...prev, initialCommand]);
        
        const attempts = 4;
        const times: number[] = [];
        const replies: string[] = [];
        
        for (let i = 0; i < attempts; i++) {
          const start = performance.now();
          try {
            // Use HEAD to minimize payload, fallback to GET if blocked
            let res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
            if (!res.ok && res.status === 405) {
              res = await fetch(url, { method: 'GET', cache: 'no-store' });
            }
            const end = performance.now();
            const time = end - start;
            times.push(time);
            replies.push(`  reply ${i + 1}: time=${time.toFixed(1)} ms`);
            
            // Update output with each reply in real-time
            setHistory(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                input: command,
                output: [
                  `PING ${target} via HTTP/HTTPS:`,
                  ...replies
                ]
              };
              return updated;
            });
            
            // Small delay to show streaming effect
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (e) {
            const end = performance.now();
            const time = end - start;
            times.push(time);
            replies.push(`  reply ${i + 1}: time=${time.toFixed(1)} ms (error)`);
            
            // Update output with each reply in real-time
            setHistory(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                input: command,
                output: [
                  `PING ${target} via HTTP/HTTPS:`,
                  ...replies
                ]
              };
              return updated;
            });
            
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        // Calculate final stats
        const min = Math.min(...times);
        const max = Math.max(...times);
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        
        // Final update with stats
        setHistory(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            input: command,
            output: [
              `PING ${target} via HTTP/HTTPS:`,
              ...replies,
              `--- stats ---`,
              `min/avg/max = ${min.toFixed(1)}/${avg.toFixed(1)}/${max.toFixed(1)} ms`,
            ]
          };
          return updated;
        });
        
        return; // Early return to prevent adding another command to history
      }
    } else if (cmd === 'play') {
      if (songs.length === 0) {
        output = ['No songs available. Type "music" to see available songs.'];
      } else if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
        output = [
          'Starting music playback...',
          `Now playing: ${songs[currentSongIndex]?.name || 'Unknown'}`,
          'Use "pause", "next", "prev" to control playback.',
        ];
      }
    } else if (cmd === 'pause') {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        output = ['Music paused.', 'Type "play" to resume.'];
      }
    } else if (cmd === 'next') {
      if (songs.length === 0) {
        output = ['No songs available. Type "music" to see available songs.'];
      } else {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        setCurrentSongIndex(nextIndex);
        output = [
          'Skipping to next song...',
          `Now playing: ${songs[nextIndex]?.name || 'Unknown'}`,
        ];
      }
    } else if (cmd === 'prev') {
      if (songs.length === 0) {
        output = ['No songs available. Type "music" to see available songs.'];
      } else {
        const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        setCurrentSongIndex(prevIndex);
        output = [
          'Skipping to previous song...',
          `Now playing: ${songs[prevIndex]?.name || 'Unknown'}`,
        ];
      }
    } else if (cmd.startsWith('play ')) {
      const argument = cmd.slice(5).trim(); // Remove 'play ' prefix

      if (songs.length === 0) {
        output = ['No songs available. Type "music" to see available songs.'];
      } else {
        // Try to parse as number first
        const songNum = parseInt(argument);
        let targetIndex = -1;

        if (!isNaN(songNum) && songNum >= 1 && songNum <= songs.length) {
          // Play by number (1-based indexing)
          targetIndex = songNum - 1;
        } else {
          // Try to find by name (case-insensitive partial match)
          const songName = argument.toLowerCase();
          targetIndex = songs.findIndex(song =>
            song.name.toLowerCase().includes(songName)
          );
        }

        if (targetIndex >= 0) {
          setCurrentSongIndex(targetIndex);
          if (audioRef.current) {
            audioRef.current.play().catch(console.error);
            setIsPlaying(true);
          }
          output = [
            `Playing song: ${songs[targetIndex].name}`,
            'Use "pause", "next", "prev" to control playback.',
          ];
        } else {
          output = [
            `Song "${argument}" not found.`,
            'Type "list" to see available songs.',
            'You can play by number (e.g., "play 1") or by name (e.g., "play time").',
          ];
        }
      }
    } else {
      // Check if it's a built-in command
      if (commands[cmd as keyof typeof commands]) {
        output = commands[cmd as keyof typeof commands];
      } else {
        output = ['Command not found. Type "help" for available commands.'];
      }
    }

    const newCommand = { input: command, output };
    setHistory(prev => [...prev, newCommand]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (awaitingUsername) {
      // Handle username input
      const inputUsername = currentInput.trim();
      let processedUsername = '~';

      if (inputUsername) {
        // Handle multiple words by joining with no spaces and converting to lowercase
        processedUsername = inputUsername.replace(/\s+/g, '').toLowerCase();
        // If it becomes empty after processing, use ~
        if (!processedUsername) {
          processedUsername = '~';
        }
      }

      setUsername(processedUsername);
      setAwaitingUsername(false);

      // Add welcome message with username, keeping header visible
      // Only show command reference if boot sound has completed
      const welcomeMessage = [
        ...headerMessage,
        '',
        `Neural signature "${processedUsername}" registered successfully.`,
        `Welcome to SyntX Terminal, ${processedUsername}!`,
        ...(bootSoundCompleted ? ['', ...commandReference] : [''])
      ];

      setHistory([{ input: '', output: welcomeMessage }]);
      setCurrentInput('');

      if (bootSoundCompleted) {
        setCommandsShown(true);
        setShowCliPrompt(true);
      }
    } else if (currentInput.trim()) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  const handleTerminalClick = () => {
    if ((awaitingUsername || showCliPrompt) && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className="h-screen bg-black text-green-400 font-mono overflow-hidden"
      onClick={handleTerminalClick}
    >
      <div
        ref={terminalRef}
        className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-track-black scrollbar-thumb-green-800"
      >
        {/* Terminal Output */}
        {history.map((command, index) => (
          <div key={index} className="mb-2">
            {command.input && (
              <div className="flex">
                <span style={{ color: '#ff6b35' }}>{username || '~'}</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">$&nbsp;</span>
                <span className="text-green-400">{command.input}</span>
              </div>
            )}
            {command.output.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className="whitespace-pre-wrap"
                style={{
                  color: line.includes('███╗░░██╗███████╗░█████╗░') ||
                        line.includes('████╗░██║██╔════╝██╔══██╗') ||
                        line.includes('██╔██╗██║█████╗░░██║░░██║') ||
                        line.includes('██║╚████║██╔══╝░░██║░░██║') ||
                        line.includes('██║░╚███║███████╗╚█████╔╝') ||
                        line.includes('╚═╝░░╚══╝╚══════╝░╚════╝░') ? '#FF00FF' :
                        line.includes('ORANGECAT TECHNOLOGIES') ? '#22c55e' :
                        line.includes('SYNTX SYSTEM') ? '#22c55e' :
                        line.includes('Welcome to the Matrix') ? '#22c55e' :
                        line.includes('╔') || line.includes('╗') || line.includes('║') || line.includes('╚') || line.includes('╝') || line.includes('═') ? '#22c55e' :
                        line.includes('===') ? '#00FFFF' :
                        line.includes('•') || line.includes('⚡') || line.includes('🚀') ? '#00FFFF' :
                        // Command lines in help output (any line with " - " that looks like a command description)
                        (line.includes(' - ') &&
                         (line.includes('about') || line.includes('syntx') || line.includes('projects') ||
                          line.includes('skills') || line.includes('experience') || line.includes('music') ||
                          line.includes('contact') || line.includes('whoami') || line.includes('date') ||
                          line.includes('uptime') || line.includes('pwd') || line.includes('clear') ||
                          line.includes('exit') || line.includes('ls') || line.includes('cd') ||
                          line.includes('mkdir') || line.includes('touch') || line.includes('cat') ||
                          line.includes('echo') || line.includes('rm') || line.includes('curl') ||
                          line.includes('ping') || line.includes('play'))) ? '#22c55e' :
                        // All command description lines (starts with spaces, has command name and dash)
                        (/^\s+[a-zA-Z0-9\[\]_\s]+\s+-\s+/.test(line) && !line.includes('Available commands:') && !line.includes('Type any command')) ? '#22c55e' :
                        // Song entries (lines starting with [number] or containing song names)
                        (/^\s*\[\d+\]/.test(line) || line.includes('Cruel Angel') || line.includes('Dragostea') || line.includes('Duvet') || 
                         line.includes('Feel Good') || line.includes('Hacking') || line.includes('Harder') || line.includes('Inner Universe') ||
                         line.includes('Kids') || line.includes('Midnight City') || line.includes('New Gold') || line.includes('Nightcall') ||
                         line.includes('Rise') || line.includes('Tank') || line.includes('Time Pink Floyd')) ? '#22c55e' :
                        '#E0E0E0',
                  fontSize: (line.includes('███╗░░██╗███████╗░█████╗░') ||
                           line.includes('████╗░██║██╔════╝██╔══██╗') ||
                           line.includes('██╔██╗██║█████╗░░██║░░██║') ||
                           line.includes('██║╚████║██╔══╝░░██║░░██║') ||
                           line.includes('██║░╚███║███████╗╚█████╔╝') ||
                           line.includes('╚═╝░░╚══╝╚══════╝░╚════╝░')) ? '0.9rem' : undefined,
                  textShadow: (line.includes('███╗░░██╗███████╗░█████╗░') ||
                             line.includes('████╗░██║██╔════╝██╔══██╗') ||
                             line.includes('██╔██╗██║█████╗░░██║░░██║') ||
                             line.includes('██║╚████║██╔══╝░░██║░░██║') ||
                             line.includes('██║░╚███║███████╗╚█████╔╝') ||
                             line.includes('╚═╝░░╚══╝╚══════╝░╚════╝░')) ? '0 0 10px #FF00FF, 0 0 15px #FF00FF' : 'none',
                  fontWeight: (line.includes('███╗░░██╗███████╗░█████╗░') ||
                             line.includes('████╗░██║██╔════╝██╔══██╗') ||
                             line.includes('██╔██╗██║█████╗░░██║░░██║') ||
                             line.includes('██║╚████║██╔══╝░░██║░░██║') ||
                             line.includes('██║░╚███║███████╗╚█████╔╝') ||
                             line.includes('╚═╝░░╚══╝╚══════╝░╚════╝░')) ? 'bold' : 'normal'
                }}
              >
                {line}
              </div>
            ))}
          </div>
        ))}

        {/* Username Input Line - Only show during username input */}
        {awaitingUsername && (
          <form onSubmit={handleSubmit} className="flex">
            <span className="text-cyan-400">neural-signature</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$&nbsp;</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
              autoFocus
              spellCheck={false}
              placeholder="Enter your username..."
            />
          </form>
        )}

        {/* Input Line - Only show after boot sequence completes and not shutting down */}
        {showCliPrompt && !isShuttingDown && (
          <form onSubmit={handleSubmit} className="flex">
            <span style={{ color: '#ff6b35' }}>{username || '~'}</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$&nbsp;</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
              autoFocus
              spellCheck={false}
            />
          </form>
        )}
      </div>
      
      {/* Hidden Audio Elements */}
      <audio ref={audioRef} preload="metadata" />
      <audio ref={bootSoundRef} preload="metadata">
        <source src={`${(import.meta as any).env.BASE_URL || ''}clisounds/bootsound.mp3`} type="audio/mpeg" />
      </audio>
      <audio ref={shutdownSoundRef} preload="metadata">
        <source src={`${(import.meta as any).env.BASE_URL || ''}clisounds/shutdownsound.mp3`} type="audio/mpeg" />
      </audio>
    </div>
  );
}