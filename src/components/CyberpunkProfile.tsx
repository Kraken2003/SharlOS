import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import TetrisGame from './TetrisGame';
import PongGame from './PongGame';
import SpaceInvadersGame from './SpaceInvadersGame';
import IPOD from './IPOD';

export default function CyberpunkProfile() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [glitchText, setGlitchText] = useState('PRITHVI_CHOHAN');
  const [activeTab, setActiveTab] = useState('overview');
  const [statusText, setStatusText] = useState('ONLINE');
  const [showTetris, setShowTetris] = useState(false);
  const [showPong, setShowPong] = useState(false);
  const [showSpaceInvaders, setShowSpaceInvaders] = useState(false);

  const statusOptions = ['ONLINE', 'CODING', 'BUILDING', 'SHIPPING'];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Glitch effect for name
    const glitchInterval = setInterval(() => {
      const original = 'PRITHVI_CHOHAN';
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
    { skill: 'Team Leadership', level: 90, color: '#4444ff' },
    { skill: 'AI/ML Engineering', level: 95, color: '#ff6b35' },
    { skill: 'Cloud Architecture', level: 85, color: '#4285f4' },
  ];

  const predictions = [
    {
      topic: 'Sovereign AI for India',
      prediction: 'India will lead in on-device AI with 120+ language support, making coding accessible to every Indian',
      confidence: 95,
      timeline: '2024-2026'
    },
    {
      topic: 'On-Device AI Revolution',
      prediction: 'Snapdragon X series with 45 TOPS NPU will make offline AI development mainstream',
      confidence: 90,
      timeline: '2024-2025'
    },
    {
      topic: 'Multilingual Coding',
      prediction: 'AI coding assistants will support native languages, breaking English-only barriers in tech',
      confidence: 88,
      timeline: '2024-2025'
    },
  ];

  const workTimeline = [
    {
      year: '2024-Present',
      title: 'Co-Founder',
      company: 'SyntX by OrangeCat',
      description: 'Building SyntX AI coding assistant, Qualcomm ISV Partner, leading AI engineering initiatives',
      tech: ['Python', 'PyTorch', 'AI/ML', 'TypeScript', 'Qualcomm'],
      status: 'CURRENT',
      location: 'Noida, Uttar Pradesh, India'
    },
    {
      year: '2024',
      title: 'AI Engineer (Freelance)',
      company: 'Gauge Advertising',
      description: 'Designed Python Flask server for automated ad banner resizing, reduced manual design time by 50-70%',
      tech: ['Python', 'Flask', 'AI Solutions', 'Docker', 'Google Cloud'],
      status: 'COMPLETED',
      location: 'Delhi, India'
    },
    {
      year: '2024',
      title: 'AI Intern',
      company: 'Olive Gaea',
      description: 'Optimized invoice processing with LLMs, increased processing capacity by 25x, expanded language support to 40 languages',
      tech: ['LLMs', 'Gemini', 'GPT-4o', 'Python', 'NLP'],
      status: 'COMPLETED',
      location: 'Dubai, UAE (Remote)'
    },
  ];

  return (
    <div className="min-h-screen bg-black text-yellow-400 font-mono overflow-x-hidden">
      {/* Games */}
      {showTetris && <TetrisGame onClose={() => setShowTetris(false)} />}
      {showPong && <PongGame onClose={() => setShowPong(false)} />}
      {showSpaceInvaders && <SpaceInvadersGame onClose={() => setShowSpaceInvaders(false)} />}

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
                    src="https://media.licdn.com/dms/image/v2/D5603AQEMT16-3Gn4AA/profile-displayphoto-crop_800_800/B56Zh0pOqXHQAM-/0/1754303622707?e=1759968000&v=beta&t=grrvq2alvg_MiEb8UFAWZ6OBdJzkp-BQgeFfclAWPmU"
                    alt="Profile"
                    className="w-32 h-32 mx-auto border-2 border-yellow-400 contrast-125 pixelated"
                    style={{ filter: 'sepia(100%) hue-rotate(40deg) saturate(150%)' }}
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50"></div>
                </div>
                
                <div className="text-center">
                  <h1 className="text-2xl mb-2 text-red-400">
                    {glitchText}
                  </h1>
                  <div className="text-sm text-cyan-300 mb-4">
                    STATUS: <span className="text-red-400 animate-pulse">{statusText}</span>
                  </div>
                  
                  <div className="text-xs space-y-1 text-yellow-400">
                    <div>ID: 0xFF6B35</div>
                    <div>CLEARANCE: SYNTX_FOUNDER</div>
                    <div>LAST_SEEN: New Delhi, India</div>
                    <div>UPTIME: {Math.floor((Date.now() - new Date('2003-12-17').getTime()) / (1000 * 60 * 60 * 24 * 365))} years</div>
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
                  <button
                    onClick={() => setShowSpaceInvaders(true)}
                    className="w-full bg-red-400/10 border border-red-400/50 p-2 text-red-400 hover:bg-red-400/20 transition-all text-xs"
                  >
                    ▶ SPACE_INVADERS.EXE
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {/* Navigation */}
              <div className="border border-yellow-400/30 bg-black/80 backdrop-blur-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  {['overview', 'capabilities', 'timeline', 'events', 'predictions', 'ipod', 'contact'].map((tab) => (
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
                      <h2 className="text-xl text-red-400 mb-4">NEURAL_INTERFACE_INIT</h2>
                      <div className="text-cyan-300 space-y-3 text-sm leading-relaxed">
                        <p>
                          Welcome, choom. You've jacked into my neural net. I'm Prithvi Singh Chohan, 
                          Co-Founder of SyntX by OrangeCat, architecting the future of AI-powered development 
                          from New Delhi, India. Born in the age of deep learning, raised on Python and PyTorch, 
                          forged in India's tech ecosystem.
                        </p>
                        <p>
                          My reality: Building sovereign AI for India, making coding accessible in 120+ languages, 
                          and pushing the boundaries of what AI can do for developers. I build SyntX - the AI 
                          coding assistant that's revolutionizing how we write, debug, and ship code.
                        </p>
                        <p>
                          Currently: Leading SyntX as a Qualcomm ISV Partner, building AI agents that understand
                          code like senior engineers, and scaling cloud infrastructure for the next generation 
                          of AI-powered development tools. Making India AI-ready, one developer at a time.
                        </p>
                      </div>
                    </div>

                    {/* Location Map */}
                    <div className="border border-yellow-400/30 p-4">
                      <h3 className="text-yellow-400 mb-3">GPS_COORDINATES</h3>
                      <div className="bg-black/70 h-64 border border-yellow-400/20 relative overflow-hidden">
                        {/* India Map Background */}
                        <img
                          src="https://simplemaps.com/static/svg/country/in/admin1/in.svg"
                          alt="India Map"
                          className="absolute inset-0 w-full h-full opacity-60"
                          style={{
                            filter: 'sepia(100%) hue-rotate(40deg) saturate(200%) contrast(150%) brightness(1.2)',
                            mixBlendMode: 'screen',
                            objectFit: 'cover',
                            objectPosition: '50% 24%',
                            transform: 'scale(4.8)',
                            transformOrigin: '30% center'
                          }}
                          onError={(e) => {
                            // Fallback to a simple placeholder if image fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />

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
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                          <div className="text-center">
                            <div className="text-3xl mb-2 text-red-400 animate-pulse drop-shadow-lg">⦿</div>
                            <div className="text-red-400 font-bold">28.6139° N, 77.2090° E</div>
                            <div className="text-cyan-400 text-xs mt-1">New Delhi, India</div>
                            <div className="text-green-400 text-xs mt-2">LAST_PING: {currentTime.toLocaleTimeString()}</div>
                          </div>
                        </div>
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === 'capabilities' && (
                  <div>
                    <h2 className="text-xl text-red-400 mb-6">NEURAL_SKILLS</h2>
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
                        <div>• Allergic reaction to unnecessary meetings</div>
                        <div>• Cognitive overload from "make logo bigger" requests</div>
                        <div>• Automatic firewall against Network Marketing</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div>
                    <h2 className="text-xl text-red-400 mb-6">WORK_HISTORY.LOG</h2>
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

                {activeTab === 'events' && (
                  <div>
                    <h2 className="text-xl text-red-400 mb-6">RECENT_EVENTS.LOG</h2>
                    <div className="space-y-6">
                      <div className="border border-yellow-400/20 p-4 bg-black/50">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-yellow-400">SyntX AI Unplugged Event</h3>
                          <span className="text-xs text-green-400">Gurugram, India • 1 week ago</span>
                        </div>
                        <p className="text-cyan-300 text-sm mb-3">
                          Successfully organized and hosted SyntX AI Unplugged event in Gurugram with 40k+ 
                          college students. Featured panel discussions, networking sessions, and showcased 
                          AI innovations. Event exceeded all expectations with incredible energy and collaboration.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 border border-yellow-400/30">
                            Event Management
                          </span>
                          <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 border border-yellow-400/30">
                            AI Community
                          </span>
                          <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 border border-yellow-400/30">
                            Networking
                          </span>
                        </div>
                      </div>

                      <div className="border border-red-400/20 p-4 bg-red-900/10">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-red-400">Qualcomm Snapdragon X Launch</h3>
                          <span className="text-xs text-green-400">Taj Palace, Delhi • 6 months ago</span>
                        </div>
                        <p className="text-cyan-300 text-sm mb-3">
                          Showcased Lagrange's offline, on-device AI agentic capabilities at the Snapdragon X 
                          Launch event. Demonstrated how Lagrange empowers users to build software offline, 
                          running seamlessly on Snapdragon X series AI PCs with 45 TOPS NPU support.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 border border-red-400/30">
                            Qualcomm ISV Partner
                          </span>
                          <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 border border-red-400/30">
                            On-Device AI
                          </span>
                          <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 border border-red-400/30">
                            Snapdragon X
                          </span>
                        </div>
                      </div>

                      <div className="border border-orange-400/20 p-4 bg-orange-900/10">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-orange-400">Independence Day AI Initiative</h3>
                          <span className="text-xs text-green-400">India • 3 weeks ago</span>
                        </div>
                        <p className="text-cyan-300 text-sm mb-3">
                          Launched "Sovereign AI for India" campaign, making coding accessible in 120+ languages 
                          from Kashmir to Kanyakumari. SyntX now supports native Indian languages, breaking 
                          English-only barriers in tech education and development.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 border border-orange-400/30">
                            Sovereign AI
                          </span>
                          <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 border border-orange-400/30">
                            Multilingual Support
                          </span>
                          <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 border border-orange-400/30">
                            Made in India
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'predictions' && (
                  <div>
                    <h2 className="text-xl text-red-400 mb-6">NEURAL_PREDICTIONS</h2>
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

                {activeTab === 'ipod' && (
                  <IPOD />
                )}

                {activeTab === 'contact' && (
                  <div>
                    <h2 className="text-xl text-red-400 mb-6">NEURAL_LINK_PROTOCOLS</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="border border-yellow-400/30 p-4 bg-black/50">
                        <h3 className="text-yellow-400 mb-3">PRIMARY_CHANNELS</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>NEURAL_MAIL:</span>
                            <span className="text-cyan-400">founder@orangecat.ai</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ENCRYPTED_LINK:</span>
                            <span className="text-green-400">linkedin.com/in/prithvichohan</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CODE_REPO:</span>
                            <span className="text-green-400">@Kraken2003</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SYNTX:</span>
                            <span className="text-blue-400">syntx.dev</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ORANGECAT:</span>
                            <span className="text-purple-400">orangecat.ai</span>
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
              <span>VERSION: SYNTX_2024.1</span>
              <span>NEURAL_LINK: STABLE</span>
              <span>ENCRYPTION: QUANTUM_AES-512</span>
              <span>ICE: ACTIVE</span>
              <span>STATUS: BUILDING_AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}