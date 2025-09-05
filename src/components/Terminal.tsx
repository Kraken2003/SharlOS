import React, { useState, useEffect, useRef } from 'react';

interface Command {
  input: string;
  output: string[];
}

export default function Terminal() {
  const [history, setHistory] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = [
    '╔═══════════════════════════════════════════════════════════════╗',
    '║                 ORANGECAT TECHNOLOGIES TERMINAL               ║',
    '║                    SYNTX SYSTEM v2024.1                       ║',
    '║                                                               ║',
    '║             Welcome to Prithvi Chohan\'s Terminal             ║',
    '║                                                               ║',
    '║    Type "help" for available commands                         ║',
    '║    Type "about" to learn about SyntX and Orangecat            ║',
    '║                                                               ║',
    '╚═══════════════════════════════════════════════════════════════╝',
    '',
    'AI-powered development environment initialized...',
    'Loading Prithvi\'s neural profile...',
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
      '  clear       - Clear the terminal screen',
      '  whoami      - Display current user info',
      '  date        - Show current date and time',
      '  uptime      - Show system uptime',
      '  pwd         - Print working directory',
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
  };

  useEffect(() => {
    // Show welcome message on mount
    setHistory([{ input: '', output: welcomeMessage }]);
    // Focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
    </div>
  );
}