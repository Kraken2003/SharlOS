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
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const welcomeMessage = [
    '╔═══════════════════════════════════════════════════════════════╗',
    '║                 ORANGECAT TECHNOLOGIES TERMINAL               ║',
    '║                    SYNTX SYSTEM v2024.1                       ║',
    '║                                                               ║',
    '║             Welcome to Prithvi Chohan\'s Terminal             ║',
    '║                                                               ║',
    '║    Type "help" for available commands                         ║',
    '║    Type "about" to learn about SyntX and Orangecat            ║',
    '║    Type "music" to access the music player                    ║',
    '║    Type "exit" to return to the Matrix                        ║',
    '║                                                               ║',
    '╚═══════════════════════════════════════════════════════════════╝',
    '',
    'AI-powered development environment initialized...',
    'Loading Prithvi\'s neural profile...',
    'Music system loaded...',
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
      '    Users: 5,500+ developers and counting',
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
      '█████████████████████ Python (95%)',
      '███████████████████   PyTorch (90%)',
      '█████████████████     TensorFlow (80%)',
      '███████████████       OpenCV (70%)',
      '█████████████         Scikit-learn (60%)',
      '',
      'Programming Languages:',
      '█████████████████████ JavaScript/TypeScript (95%)',
      '███████████████████   C++ (85%)',
      '█████████████████     Java (75%)',
      '',
      'Cloud & Infrastructure:',
      '█████████████████████ Google Cloud (95%)',
      '███████████████████   AWS (85%)',
      '█████████████████     Vercel (80%)',
      '███████████████       Cloudflare (70%)',
      '',
      'Databases:',
      '█████████████████     PostgreSQL (80%)',
      '███████████████       MongoDB (70%)',
      '█████████████         MySQL (60%)',
    ],
    contact: [
      '=== CONTACT INFORMATION ===',
      '',
      '📧 Email: founder@orangecat.ai',
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
      '   Impact: 5,500+ developers using SyntX',
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
      '• 5,500+ developers on SyntX',
      '• Building sovereign AI for India',
    ],
    whoami: [
      'prithvi@orangecat-terminal:~$ whoami',
      'prithvi',
      '',
      'User privileges: sudo, docker, kubectl, python, pytorch',
      'Shell: /bin/bash',
      'Groups: ai-engineers, founders, developers, syntx-team',
    ],
    date: [
      new Date().toString(),
    ],
    uptime: [
      'System uptime: Building AI since 2020',
      'Models trained: 500+ LLMs fine-tuned',
      'Lines of Python code: 500,000+',
      'SyntX users: 5,500+ developers',
      'AI agents deployed: 50+ in production',
    ],
    pwd: [
      '/home/prithvi/orangecat/syntx-ai',
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
      '• 5,500+ active developers',
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
      '  pause       - Pause current song',
      '  next        - Play next song',
      '  prev        - Play previous song',
      '  list        - Show playlist',
      '  status      - Show current song status',
      '',
      'Available songs:',
      ...(songs.length > 0 ? songs.map((song, index) => `  [${index + 1}] ${song.name}`) : ['  No songs loaded']),
      '',
      'Type "play" to start the music!',
    ],
    play: [
      'Starting music playback...',
      ...(songs.length > 0 ? [
        `Now playing: ${songs[currentSongIndex]?.name || 'Unknown'}`,
        'Use "pause", "next", "prev" to control playback.',
      ] : ['No songs available. Type "music" to see available songs.']),
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
      'Use "play [number]" to play a specific song.',
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
      'Returning to the Matrix...',
      'Goodbye, choom.',
    ],
  };

  // Load songs from audio directory
  useEffect(() => {
    const loadSongs = async () => {
      try {
        // Use Vite's import.meta.glob to automatically find all MP3 files at build time
        const audioModules = (import.meta as any).glob('/public/audio/*.mp3', { query: '?url', import: 'default' });
        const imageModules = (import.meta as any).glob('/public/audio/*.{jpg,jpeg,png,webp}', { query: '?url', import: 'default' });

        const detectedSongs: Song[] = [];

        // Process each audio file found by Vite
        for (const [path, moduleLoader] of Object.entries(audioModules)) {
          const audioUrl = await (moduleLoader as () => Promise<string>)();
          const fileName = path.split('/').pop()?.replace('.mp3', '') || '';

          // Convert filename to readable song name
          const songName = fileName.replace(/_/g, ' ');

          // Find matching image using Vite's glob
          let imageSrc = '';
          const possibleImagePaths = [
            `/public/audio/${fileName}.jpg`,
            `/public/audio/${fileName}.jpeg`,
            `/public/audio/${fileName}.png`,
            `/public/audio/${fileName}.webp`
          ];

          for (const imgPath of possibleImagePaths) {
            if (imageModules[imgPath]) {
              imageSrc = await (imageModules[imgPath] as () => Promise<string>)();
              break;
            }
          }

          detectedSongs.push({
            name: songName,
            audioSrc: audioUrl,
            imageSrc: imageSrc
          });
        }

        setSongs(detectedSongs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading songs:', error);
        setIsLoading(false);
      }
    };

    loadSongs();
  }, []);

  useEffect(() => {
    // Show welcome message on mount
    setHistory([{ input: '', output: welcomeMessage }]);
    // Focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    if (cmd === 'exit') {
      if (onBack) {
        onBack();
      }
      return;
    }

    // Handle music commands
    if (cmd === 'play') {
      if (audioRef.current && songs.length > 0) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    } else if (cmd === 'pause') {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else if (cmd === 'next') {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    } else if (cmd === 'prev') {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    } else if (cmd.startsWith('play ')) {
      const songNum = parseInt(cmd.split(' ')[1]) - 1;
      if (songNum >= 0 && songNum < songs.length) {
        setCurrentSongIndex(songNum);
        if (audioRef.current) {
          audioRef.current.play().catch(console.error);
          setIsPlaying(true);
        }
      }
    }

    let output = ['Command not found. Type "help" for available commands.'];
    
    if (commands[cmd as keyof typeof commands]) {
      output = commands[cmd as keyof typeof commands];
    }

    const newCommand = { input: command, output };
    setHistory(prev => [...prev, newCommand]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  return (
    <div className="h-screen bg-black text-green-400 font-mono overflow-hidden">
      
      <div 
        ref={terminalRef}
        className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-track-black scrollbar-thumb-green-800"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.03) 50%, transparent 50%),
            linear-gradient(90deg, transparent 50%, rgba(0, 255, 0, 0.03) 50%)
          `,
          backgroundSize: '2px 2px'
        }}
      >
        {/* Terminal Output */}
        {history.map((command, index) => (
          <div key={index} className="mb-2">
            {command.input && (
              <div className="flex">
                <span className="text-yellow-400">prithvi@orangecat</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">$ </span>
                <span className="text-green-400">{command.input}</span>
              </div>
            )}
            {command.output.map((line, lineIndex) => (
              <div key={lineIndex} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}
          </div>
        ))}
        
        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex">
          <span className="text-yellow-400">prithvi@orangecat</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$ </span>
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
          <span className="animate-pulse text-green-400">█</span>
        </form>
      </div>
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}