import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import TetrisGame from './TetrisGame';
import PongGame from './PongGame';

export default function CyberpunkProfile() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [glitchText, setGlitchText] = useState('TECHNOCRAT');
  const [activeTab, setActiveTab] = useState('overview');
  const [statusText, setStatusText] = useState('ONLINE');
  const [showTetris, setShowTetris] = useState(false);
  const [showPong, setShowPong] = useState(false);

  const statusOptions = ['ONLINE', 'CODING', 'BUILDING', 'SHIPPING'];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Glitch effect for name
    const glitchInterval = setInterval(() => {
      const original = 'TECHNOCRAT';
      const glitched = original.split('').map(char => 
        Math.random() > 0.8 ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) : char
      ).join('');
      setGlitchText(glitched);
      setTimeout(() => setGlitchText(original), 100);
    }, 3000);

    // Status rotation
    const statusInterval = setInterval(() => {
      setStatusText(prev => {
        const currentIndex = statusOptions.indexOf(prev);
        return statusOptions[(currentIndex + 1) % statusOptions.length];
      });
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(glitchInterval);
      clearInterval(statusInterval);
    };
  }, []);

  const capabilities = [
    { skill: 'Full-Stack Development', level: 95, color: '#00ff00' },
    { skill: 'System Architecture', level: 88, color: '#00ffff' },
    { skill: 'AI/ML Implementation', level: 82, color: '#ff00ff' },
    { skill: 'DevOps & Cloud', level: 85, color: '#ffff00' },
    { skill: 'Blockchain Tech', level: 75, color: '#ff4444' },
    { skill: 'Team Leadership', level: 90, color: '#4444ff' },
  ];

  const predictions = [
    {
      topic: 'AI Singularity',
      prediction: 'AGI breakthrough within 3-5 years, but true consciousness remains elusive for another decade',
      confidence: 78,
      timeline: '2027-2029'
    },
    {
      topic: 'Web3 Evolution',
      prediction: 'Current crypto hype dies, real utility emerges in identity and ownership verification',
      confidence: 85,
      timeline: '2025-2026'
    },
    {
      topic: 'Dev Tools',
      prediction: 'AI-assisted coding becomes standard, junior dev roles transform into AI-trainer roles',
      confidence: 92,
      timeline: '2024-2025'
    },
    {
      topic: 'Remote Work',
      prediction: 'VR/AR finally reaches tipping point for remote collaboration, physical offices become rare',
      confidence: 67,
      timeline: '2026-2028'
    }
  ];

  const projects = [
    {
      name: 'NEXUS_AI',
      status: 'ACTIVE',
      description: 'Neural interface for developer productivity',
      tech: ['Python', 'TensorFlow', 'React'],
      impact: 'HIGH'
    },
    {
      name: 'CRYPTOVAULT',
      status: 'BETA',
      description: 'Decentralized identity management',
      tech: ['Solidity', 'Web3', 'IPFS'],
      impact: 'MEDIUM'
    },
    {
      name: 'CLOUDFORGE',
      status: 'SHIPPED',
      description: 'Infrastructure automation platform',
      tech: ['Go', 'Kubernetes', 'AWS'],
      impact: 'HIGH'
    }
  ];

  const workTimeline = [
    {
      year: '2024',
      title: 'Founder & CEO',
      company: 'NeuralSync Corp',
      description: 'Building the future of human-AI collaboration',
      tech: ['AI/ML', 'React', 'Python', 'Kubernetes'],
      status: 'CURRENT',
      location: 'Night City, CA'
    },
    {
      year: '2022-2024',
      title: 'Senior Tech Lead',
      company: 'Arasaka Digital',
      description: 'Led cybersecurity and neural interface development',
      tech: ['Cybersecurity', 'Neural Networks', 'Go', 'Docker'],
      status: 'COMPLETED',
      location: 'Silicon Valley, CA'
    },
    {
      year: '2020-2022',
      title: 'Full Stack Netrunner',
      company: 'Militech Solutions',
      description: 'Developed quantum-encrypted communication systems',
      tech: ['Quantum Computing', 'Blockchain', 'React', 'Node.js'],
      status: 'COMPLETED',
      location: 'Neo Francisco, CA'
    },
    {
      year: '2018-2020',
      title: 'Code Samurai',
      company: 'Freelance',
      description: 'Built cutting-edge web applications for startups',
      tech: ['JavaScript', 'Python', 'AWS', 'PostgreSQL'],
      status: 'COMPLETED',
      location: 'Various Locations'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-yellow-400 font-mono overflow-x-hidden">
      {/* Games */}
      {showTetris && <TetrisGame onClose={() => setShowTetris(false)} />}
      {showPong && <PongGame onClose={() => setShowPong(false)} />}

      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-yellow-900/10 to-black"></div>
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-cyan-400/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,0,0.1),transparent_50%)]"></div>
      </div>
      
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none opacity-20 crt-effect"></div>

      {/* Matrix Rain Background */}
      <div className="fixed inset-0 opacity-5">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-xs text-green-400 data-stream"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j} className="mb-2">
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header/Hero Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="border border-yellow-400/30 bg-black/80 backdrop-blur-sm p-6 mb-6 holographic">
                <div className="relative mb-4">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1532442312344-38696bc5294d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHRlY2glMjBmb3VuZGVyJTIwcHJvZmlsZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzAxNzQzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Profile"
                    className="w-32 h-32 mx-auto border-2 border-yellow-400 contrast-125 pixelated"
                    style={{ filter: 'sepia(100%) hue-rotate(40deg) saturate(150%)' }}
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50"></div>
                </div>
                
                <div className="text-center">
                  <h1 className="text-2xl mb-2 text-yellow-400 neon-flicker">
                    {glitchText}
                  </h1>
                  <div className="text-sm text-cyan-300 mb-4">
                    STATUS: <span className="text-red-400 animate-pulse">{statusText}</span>
                  </div>
                  
                  <div className="text-xs space-y-1 text-yellow-400">
                    <div>ID: 0x7F4A9B2C</div>
                    <div>CLEARANCE: LEVEL_9</div>
                    <div>LAST_SEEN: Night City, CA</div>
                    <div>UPTIME: {Math.floor((Date.now() - new Date('2002-01-01').getTime()) / (1000 * 60 * 60 * 24 * 365))} years</div>
                  </div>
                </div>
              </div>

              {/* System Stats */}
              <div className="border border-yellow-400/30 bg-black/80 backdrop-blur-sm p-4 mb-6">
                <h3 className="text-yellow-400 mb-3 text-sm">BIOMETRICS</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>CAFFEINE_LVL:</span>
                    <span className="text-red-400">███████░░░ 70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NEURAL_LINK:</span>
                    <span className="text-green-400">████████░░ 85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CREATIVITY:</span>
                    <span className="text-cyan-400">██████████ 100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STRESS_LVL:</span>
                    <span className="text-yellow-400">███░░░░░░░ 25%</span>
                  </div>
                </div>
              </div>

              {/* Games Section */}
              <div className="border border-cyan-400/30 bg-black/80 backdrop-blur-sm p-4">
                <h3 className="text-cyan-400 mb-3 text-sm">ARCADE.EXE</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowTetris(true)}
                    className="w-full bg-yellow-400/10 border border-yellow-400/50 p-2 text-yellow-400 hover:bg-yellow-400/20 transition-all text-xs"
                  >
                    ▶ TETRIS.EXE
                  </button>
                  <button
                    onClick={() => setShowPong(true)}
                    className="w-full bg-cyan-400/10 border border-cyan-400/50 p-2 text-cyan-400 hover:bg-cyan-400/20 transition-all text-xs"
                  >
                    ▶ PONG.EXE
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {/* Navigation */}
              <div className="border border-yellow-400/30 bg-black/80 backdrop-blur-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  {['overview', 'capabilities', 'projects', 'timeline', 'predictions', 'contact'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-xs uppercase tracking-wider transition-all ${
                        activeTab === tab
                          ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400 shadow-lg shadow-yellow-400/30'
                          : 'text-yellow-400/60 hover:text-yellow-400 border border-transparent hover:border-yellow-400/30'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Sections */}
              <div className="border border-yellow-400/30 bg-black/80 backdrop-blur-sm p-6">
                
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl text-yellow-400 mb-4 neon-flicker">NEURAL_INTERFACE_INIT</h2>
                      <div className="text-cyan-300 space-y-3 text-sm leading-relaxed">
                        <p>
                          Welcome, choom. You've jacked into my neural net. I'm a 22-year-old tech samurai 
                          cutting through corporate ice and building the digital future. Born in the data streams, 
                          raised by artificial minds, forged in the neon-lit streets of Night City's tech sector.
                        </p>
                        <p>
                          My reality: Cyberpunk aesthetics, hacker ethics, neural enhancement philosophy. 
                          I decrypt chaos into code, build bridges across digital divides, and turn impossible 
                          dreams into executable reality.
                        </p>
                        <p>
                          Currently: Architecting the next evolution of human-machine symbiosis while corps 
                          are still trying to figure out basic AI ethics. The future is bright, neon, and 
                          full of infinite possibilities.
                        </p>
                      </div>
                    </div>

                    {/* Location Map */}
                    <div className="border border-yellow-400/30 p-4">
                      <h3 className="text-yellow-400 mb-3">GPS_COORDINATES</h3>
                      <div className="bg-black/70 h-64 border border-yellow-400/20 relative overflow-hidden">
                        {/* Fake map grid */}
                        <div className="absolute inset-0 opacity-30">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute border-t border-yellow-400/20"
                              style={{ top: `${i * 5}%`, width: '100%' }}
                            />
                          ))}
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute border-l border-yellow-400/20"
                              style={{ left: `${i * 5}%`, height: '100%' }}
                            />
                          ))}
                        </div>
                        
                        {/* Location marker */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="text-center">
                            <div className="text-2xl mb-2 text-red-400 animate-pulse">⦿</div>
                            <div className="text-yellow-400 shadow-lg shadow-yellow-400/50">37.7749° N, 122.4194° W</div>
                            <div className="text-cyan-400 text-xs mt-1">Night City Financial District</div>
                            <div className="text-green-400 text-xs mt-2">LAST_PING: {currentTime.toLocaleTimeString()}</div>
                          </div>
                        </div>

                        {/* Radar sweep effect */}
                        <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-green-400/50 rounded-full animate-ping"></div>
                        <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-cyan-400/50 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'capabilities' && (
                  <div>
                    <h2 className="text-xl text-yellow-400 mb-6 neon-flicker">NEURAL_SKILLS</h2>
                    <div className="space-y-4">
                      {capabilities.map((cap, index) => (
                        <div key={index} className="border border-yellow-400/20 p-4 bg-black/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-yellow-400 text-sm">{cap.skill}</span>
                            <span className="text-xs" style={{ color: cap.color }}>{cap.level}%</span>
                          </div>
                          <div className="w-full bg-gray-900 h-3 border border-gray-700">
                            <div 
                              className="h-3 transition-all duration-1000"
                              style={{ 
                                width: `${cap.level}%`,
                                backgroundColor: cap.color,
                                boxShadow: `0 0 15px ${cap.color}, inset 0 0 5px rgba(255,255,255,0.2)`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 border border-red-400/30 p-4 bg-red-900/10">
                      <h3 className="text-red-400 mb-3">SYSTEM_LIMITATIONS</h3>
                      <div className="text-red-300 text-sm space-y-2">
                        <div>• Neural rejection of legacy PHP codebases</div>
                        <div>• Physical incompatibility with Internet Explorer</div>
                        <div>• Allergic reaction to unnecessary meetings</div>
                        <div>• System crash when exposed to SQL injection</div>
                        <div>• Cognitive overload from "make logo bigger" requests</div>
                        <div>• Automatic firewall against MLM schemes</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div>
                    <h2 className="text-xl text-yellow-400 mb-6 neon-flicker">ACTIVE_OPERATIONS</h2>
                    <div className="space-y-4">
                      {projects.map((project, index) => (
                        <div key={index} className="border border-yellow-400/20 p-4 bg-black/50 holographic">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-yellow-400">{project.name}</h3>
                            <span className={`text-xs px-2 py-1 border ${
                              project.status === 'ACTIVE' ? 'text-green-400 border-green-400 bg-green-900/20' :
                              project.status === 'BETA' ? 'text-yellow-400 border-yellow-400 bg-yellow-900/20' :
                              'text-cyan-400 border-cyan-400 bg-cyan-900/20'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="text-cyan-300 text-sm mb-3">{project.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex flex-wrap gap-2">
                              {project.tech.map((tech, i) => (
                                <span key={i} className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 border border-yellow-400/30">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <span className={`text-xs ${
                              project.impact === 'HIGH' ? 'text-red-400' : 'text-orange-400'
                            }`}>
                              THREAT_LVL: {project.impact}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div>
                    <h2 className="text-xl text-yellow-400 mb-6 neon-flicker">WORK_HISTORY.LOG</h2>
                    <div className="space-y-6">
                      {workTimeline.map((job, index) => (
                        <div key={index} className="relative">
                          {/* Timeline line */}
                          {index < workTimeline.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-20 bg-gradient-to-b from-yellow-400 to-cyan-400"></div>
                          )}
                          
                          <div className="flex gap-4">
                            {/* Timeline dot */}
                            <div className={`w-12 h-12 border-2 flex items-center justify-center text-xs ${
                              job.status === 'CURRENT' 
                                ? 'border-green-400 bg-green-900/20 text-green-400 animate-pulse' 
                                : 'border-yellow-400 bg-yellow-900/20 text-yellow-400'
                            }`}>
                              {job.year.split('-')[0]}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 border border-yellow-400/30 p-4 bg-black/50">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-yellow-400">{job.title}</h3>
                                  <div className="text-cyan-400 text-sm">{job.company}</div>
                                  <div className="text-gray-400 text-xs">{job.location}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-yellow-400">{job.year}</div>
                                  <span className={`text-xs px-2 py-1 border ${
                                    job.status === 'CURRENT' 
                                      ? 'text-green-400 border-green-400 bg-green-900/20' 
                                      : 'text-gray-400 border-gray-400 bg-gray-900/20'
                                  }`}>
                                    {job.status}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-cyan-300 text-sm mb-3">{job.description}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                {job.tech.map((tech, i) => (
                                  <span key={i} className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 border border-yellow-400/30">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'predictions' && (
                  <div>
                    <h2 className="text-xl text-yellow-400 mb-6 neon-flicker">NEURAL_PREDICTIONS</h2>
                    <div className="space-y-6">
                      {predictions.map((pred, index) => (
                        <div key={index} className="border border-yellow-400/20 p-4 bg-black/50">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-yellow-400">{pred.topic}</h3>
                            <div className="text-right">
                              <div className="text-xs text-green-400">CERTAINTY: {pred.confidence}%</div>
                              <div className="text-xs text-cyan-400">{pred.timeline}</div>
                            </div>
                          </div>
                          <p className="text-cyan-300 text-sm mb-3">{pred.prediction}</p>
                          <div className="w-full bg-gray-900 h-2 border border-gray-700">
                            <div 
                              className="h-2 transition-all duration-1000"
                              style={{ 
                                width: `${pred.confidence}%`,
                                background: `linear-gradient(90deg, #ff4444, #ffff00, #00ff00)`,
                                boxShadow: '0 0 10px rgba(255,255,0,0.5)'
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div>
                    <h2 className="text-xl text-yellow-400 mb-6 neon-flicker">NEURAL_LINK_PROTOCOLS</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="border border-yellow-400/30 p-4 bg-black/50">
                        <h3 className="text-yellow-400 mb-3">PRIMARY_CHANNELS</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>NEURAL_MAIL:</span>
                            <span className="text-cyan-400">founder@nightcity.net</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ENCRYPTED_LINK:</span>
                            <span className="text-green-400">+1.555.CYBER</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CODE_REPO:</span>
                            <span className="text-green-400">@cyberpunk_samurai</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CORP_NET:</span>
                            <span className="text-blue-400">linkedin.com/in/neural-interface</span>
                          </div>
                          <div className="flex justify-between">
                            <span>DARK_WEB:</span>
                            <span className="text-purple-400">@tech_ronin</span>
                          </div>
                        </div>
                      </div>

                      <div className="border border-cyan-400/30 p-4 bg-black/50">
                        <h3 className="text-cyan-400 mb-3">AVAILABILITY_STATUS</h3>
                        <div className="space-y-2 text-xs">
                          <div>Neural Link: 24/7 (Priority queue)</div>
                          <div>Business Hours: 09:00-18:00 PST</div>
                          <div>Emergency Protocol: Signal/Encrypted only</div>
                          <div>Code Review: Async neural processing</div>
                          <div>Physical Meet: Night City metro only</div>
                          <div>Response Time: &lt; 2 hours (avg)</div>
                        </div>
                      </div>

                      <div className="border border-red-400/30 p-4 md:col-span-2 bg-red-900/10">
                        <h3 className="text-red-400 mb-3">COLLABORATION_MATRIX</h3>
                        <div className="text-sm text-red-300 space-y-2">
                          <div>• ACCEPTING: Neural consulting, tech co-founding, conference speaking, mentorship</div>
                          <div>• REJECTING: Corporate pyramid schemes, rug-pull crypto, "visionary" partnerships without code</div>
                          <div>• RATES: ¥500/hour consulting, equity negotiations for long-term neural links</div>
                          <div>• SECURITY: Military-grade encryption for sensitive data transfers</div>
                          <div>• WARNING: Automatic ICE deployment against spam/scam attempts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-yellow-400/30 bg-black/80 backdrop-blur-sm p-4 mt-8">
          <div className="container mx-auto text-center text-xs text-yellow-400/60">
            <div className="flex justify-center space-x-8 flex-wrap">
              <span>NEURAL_TIME: {currentTime.toLocaleString()}</span>
              <span>VERSION: CYBERPUNK_2077.24</span>
              <span>NEURAL_LINK: STABLE</span>
              <span>ENCRYPTION: QUANTUM_AES-512</span>
              <span>ICE: ACTIVE</span>
              <span>STATUS: JACKED_IN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}