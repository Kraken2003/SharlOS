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
    '║                    UNIX SYSTEM V RELEASE 3.2                 ║',
    '║                      Personal Terminal v1.0                   ║',
    '║                                                               ║',
    '║                Welcome to my digital workspace                ║',
    '║                                                               ║',
    '║    Type "help" for available commands                         ║',
    '║    Type "about" to learn more about me                        ║',
    '║                                                               ║',
    '╚═══════════════════════════════════════════════════════════════╝',
    '',
    'System initialized successfully...',
    'Loading user profile...',
    '',
  ];

  const commands = {
    help: [
      'Available commands:',
      '',
      '  about       - Learn about me and my background',
      '  projects    - View my projects and ventures',
      '  skills      - Display technical skills',
      '  contact     - Get my contact information',
      '  experience  - View my professional experience',
      '  clear       - Clear the terminal screen',
      '  whoami      - Display current user info',
      '  date        - Show current date and time',
      '  uptime      - Show system uptime',
      '  pwd         - Print working directory',
      '',
      'Type any command to get started.',
    ],
    about: [
      '=== ABOUT ME ===',
      '',
      'Name: Tech Founder & Builder',
      'Role: Founder, Engineer, Innovator',
      'Status: Building the future, one line of code at a time',
      '',
      'I am a passionate founder and technologist who loves creating',
      'innovative solutions that make a difference. My journey spans',
      'across multiple domains of technology, from web development',
      'to emerging tech platforms.',
      '',
      'Current Focus:',
      '• Building scalable tech products',
      '• Exploring AI and machine learning applications',
      '• Leading engineering teams',
      '• Mentoring fellow developers',
      '',
      'Philosophy: "Code is poetry, and every bug is a haiku waiting',
      'to be debugged."',
    ],
    projects: [
      '=== CURRENT PROJECTS & VENTURES ===',
      '',
      '[1] STARTUP_ALPHA.exe',
      '    Status: In Development',
      '    Description: Revolutionary SaaS platform',
      '    Tech Stack: React, Node.js, PostgreSQL',
      '    Launch: Q2 2024',
      '',
      '[2] OPEN_SOURCE_TOOLKIT.git',
      '    Status: Active Development',
      '    Description: Developer productivity tools',
      '    Contributors: 50+ developers',
      '    Stars: 2.3k on GitHub',
      '',
      '[3] AI_EXPERIMENT.neural',
      '    Status: Research Phase',
      '    Description: ML-powered automation platform',
      '    Focus: Natural language processing',
      '',
      '[4] MOBILE_APP.native',
      '    Status: Beta Testing',
      '    Description: Cross-platform productivity app',
      '    Users: 10k+ beta testers',
      '',
      'Type "contact" to collaborate on any project.',
    ],
    skills: [
      '=== TECHNICAL SKILLS MATRIX ===',
      '',
      'Programming Languages:',
      '█████████████████████ JavaScript/TypeScript (95%)',
      '███████████████████   Python (85%)',
      '█████████████████     Go (75%)',
      '███████████████       Rust (65%)',
      '█████████████         Java (55%)',
      '',
      'Frontend Technologies:',
      '█████████████████████ React/Next.js (95%)',
      '███████████████████   Vue.js (85%)',
      '█████████████████     Svelte (75%)',
      '',
      'Backend & Infrastructure:',
      '█████████████████████ Node.js (95%)',
      '███████████████████   Docker/K8s (85%)',
      '█████████████████     AWS/GCP (75%)',
      '███████████████       PostgreSQL (65%)',
      '',
      'Emerging Technologies:',
      '█████████████████     AI/ML (75%)',
      '███████████████       Blockchain (65%)',
      '█████████████         WebAssembly (55%)',
    ],
    contact: [
      '=== CONTACT INFORMATION ===',
      '',
      '📧 Email: founder@example.com',
      '🐙 GitHub: github.com/techfounder',
      '💼 LinkedIn: linkedin.com/in/techfounder',
      '🐦 Twitter: @techfounder',
      '🌐 Website: techfounder.dev',
      '',
      '📍 Location: Silicon Valley, CA',
      '⏰ Timezone: PST (UTC-8)',
      '',
      'Available for:',
      '• Technical consulting',
      '• Speaking engagements',
      '• Collaboration opportunities',
      '• Mentorship sessions',
      '',
      'Response time: Usually within 24 hours',
      '',
      'PGP Key: Available upon request',
    ],
    experience: [
      '=== PROFESSIONAL EXPERIENCE ===',
      '',
      '🚀 CURRENT: Founder & CTO | TechStartup Inc.',
      '   Duration: 2022 - Present',
      '   Focus: Building next-gen developer tools',
      '   Team Size: 15+ engineers',
      '',
      '💻 PREVIOUS: Senior Software Engineer | BigTech Corp',
      '   Duration: 2019 - 2022',
      '   Focus: Scalable web applications',
      '   Impact: 10M+ users served',
      '',
      '⚡ EARLY CAREER: Full Stack Developer | StartupXYZ',
      '   Duration: 2017 - 2019',
      '   Focus: Rapid prototyping and MVP development',
      '   Achievement: Led team of 5 developers',
      '',
      '🎓 EDUCATION: Computer Science | Tech University',
      '   Graduated: 2017',
      '   Focus: Software Engineering & Algorithms',
      '',
      'Awards & Recognition:',
      '• Tech Innovator of the Year (2023)',
      '• Open Source Contributor Award (2022)',
      '• Hackathon Winner x3',
    ],
    whoami: [
      'root@techfounder-terminal:~$ whoami',
      'techfounder',
      '',
      'User privileges: sudo, docker, git',
      'Shell: /bin/bash',
      'Groups: developers, founders, innovators',
    ],
    date: [
      new Date().toString(),
    ],
    uptime: [
      'System uptime: 25 years, 3 months, 15 days',
      'Coffee consumed: 9,847 cups',
      'Lines of code written: 1,234,567',
      'Bugs fixed: 8,765',
      'Features shipped: 432',
    ],
    pwd: [
      '/home/techfounder/workspace/personal-website',
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
                <span className="text-yellow-400">techfounder@system</span>
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
          <span className="text-yellow-400">techfounder@system</span>
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