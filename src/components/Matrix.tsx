import React, { useState, useEffect } from 'react';

interface MatrixProps {
  onPillChoice: (pill: 'red' | 'blue') => void;
}

export default function Matrix({ onPillChoice }: MatrixProps) {
  const [showPills, setShowPills] = useState(true);
  const [matrixRain, setMatrixRain] = useState<string[]>([]);


  const matrixChars = ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト'];

  useEffect(() => {
    // Initialize matrix rain
    const columns = Math.floor(window.innerWidth / 20);
    const rows = Math.ceil(window.innerHeight / 12) + 2; // Better coverage with buffer
    const initialRain = Array(columns).fill(0).map(() =>
      Array(rows).fill(0).map(() =>
        matrixChars[Math.floor(Math.random() * matrixChars.length)]
      ).join('')
    );
    setMatrixRain(initialRain);


    // Update matrix rain
    const rainInterval = setInterval(() => {
      setMatrixRain(prev => prev.map(column => {
        const chars = column.split('');
        chars.shift(); // Remove first character
        chars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)]); // Add new character
        return chars.join('');
      }));
    }, 150);

    return () => {
      clearInterval(rainInterval);
    };
  }, []);

  return (
    <>
      {/* Media query styles for hover-capable devices and overflow fixes */}
      <style>{`
        /* Prevent horizontal scrollbar */
        html, body {
          overflow-x: hidden;
        }

        @media (hover: hover) {
          .pill-hover-area:hover {
            cursor: pointer;
          }
        }
        @media (hover: none) {
          .pill-hover-area:active {
            transform: scale(0.98);
          }
        }
      `}</style>
      <div className="min-h-screen bg-black text-green-400 font-mono overflow-y-auto overflow-x-hidden relative">
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 opacity-30 -z-20 pointer-events-none" style={{ top: '-24px' }}>
        {matrixRain.map((column, index) => (
          <div
            key={index}
            className="absolute text-xs"
            style={{
              left: `${index * 20}px`,
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              textShadow: '0 0 8px #00ff00, 0 0 16px #00ff00',
            }}
          >
            {column}
          </div>
        ))}
      </div>

      {/* Scanlines effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.03) 50%, transparent 50%),
            linear-gradient(90deg, transparent 50%, rgba(0, 255, 0, 0.03) 50%)
          `,
          backgroundSize: '4px 4px'
        }}
      />

      {/* Main Content */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-full p-6 sm:p-8">
        {/* Morpheus Image with Pills */}
        <div className="mb-8 relative">
          <img
            src="/morpheus.png"
            alt="Morpheus"
            className="w-[70vw] max-w-xs sm:max-w-md md:w-96 h-auto mx-auto opacity-90 rounded-lg shadow-lg border border-green-400/30"
          />
          
          {/* Pills positioned on Morpheus's hands */}
          {showPills && (
            <div className="absolute inset-0">
              {/* Blue Pill hover area - 200x120px from bottom right corner */}
              <div
                className="absolute group pill-hover-area"
                style={{
                  right: '0',
                  bottom: '0',
                  width: '32%',
                  height: '33%'
                }}
                onClick={() => onPillChoice('blue')}
              >
                {/* Blue Pill - positioned directly above the hand pill */}
                <div
                  className="absolute"
                  style={{
                    right: '28%',
                    top: '50%',
                    transform: 'translate(50%, -50%)'
                  }}
                >
                  <img
                    src="/bluepill.png"
                    alt="Blue Pill"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out drop-shadow-2xl transform translate-y-4 group-hover:-translate-y-12 group-hover:scale-125"
                    style={{
                      filter: 'drop-shadow(0 0 25px rgba(59, 130, 246, 1)) drop-shadow(0 0 50px rgba(59, 130, 246, 0.6))',
                      transformOrigin: 'center bottom'
                    }}
                  />
                  
                  {/* Floating glow halo */}
                  <div className="absolute inset-0 group-hover:animate-pulse">
                    <img
                      src="/bluepill.png"
                      alt=""
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-0 group-hover:opacity-15 transition-all duration-700 ease-in-out absolute"
                      style={{
                        filter: 'blur(12px)',
                        transform: 'scale(2) translateY(-12px)'
                      }}
                    />
                  </div>
                </div>
                
                {/* Premium cyberpunk text container */}
                <div
                  className="absolute opacity-0 group-hover:opacity-100 transition-all duration-600 ease-in-out transform translate-y-2 group-hover:-translate-y-4"
                  style={{
                    right: '28%',
                    top: '25%',
                    transform: 'translate(50%, -50%)'
                  }}
                >
                  {/* Main pill label with cyberpunk styling */}
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-blue-800/60 to-blue-900/40 rounded-lg blur-sm"></div>
                    <div className="relative px-4 py-2 bg-black/80 border border-blue-400/50 rounded-lg backdrop-blur-sm">
                      <div className="text-blue-300 text-lg font-bold tracking-wider text-center font-mono">
                        BLUE PILL
                      </div>
                      {/* Scanning line effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-pulse rounded-lg"></div>
                    </div>
                  </div>
                  
                  {/* Subtitle with glitch effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-cyan-800/50 to-cyan-900/30 rounded blur-sm"></div>
                    <div className="relative px-3 py-1 bg-black/70 border border-cyan-400/30 rounded backdrop-blur-sm">
                      <div className="text-cyan-300 text-sm font-medium text-center tracking-wide font-mono">
                        Non-Developer
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Red Pill hover area - 200x120px from bottom left corner */}
              <div
                className="absolute group pill-hover-area"
                style={{
                  left: '0',
                  bottom: '0',
                  width: '32%',
                  height: '33%'
                }}
                onClick={() => onPillChoice('red')}
              >
                {/* Red Pill - positioned directly above the hand pill */}
                <div
                  className="absolute"
                  style={{
                    left: '28%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <img
                    src="/redpill.png"
                    alt="Red Pill"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out drop-shadow-2xl transform translate-y-4 group-hover:-translate-y-12 group-hover:scale-125"
                    style={{
                      filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 1)) drop-shadow(0 0 50px rgba(239, 68, 68, 0.6))',
                      transformOrigin: 'center bottom'
                    }}
                  />
                  
                  {/* Floating glow halo */}
                  <div className="absolute inset-0 group-hover:animate-pulse">
                    <img
                      src="/redpill.png"
                      alt=""
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-0 group-hover:opacity-15 transition-all duration-700 ease-in-out absolute"
                      style={{
                        filter: 'blur(12px)',
                        transform: 'scale(2) translateY(-12px)'
                      }}
                    />
                  </div>
                </div>
                
                {/* Premium cyberpunk text container */}
                <div
                  className="absolute opacity-0 group-hover:opacity-100 transition-all duration-600 ease-in-out transform translate-y-2 group-hover:-translate-y-4"
                  style={{
                    left: '28%',
                    top: '25%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {/* Main pill label with cyberpunk styling */}
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 via-red-800/60 to-red-900/40 rounded-lg blur-sm"></div>
                    <div className="relative px-4 py-2 bg-black/80 border border-red-400/50 rounded-lg backdrop-blur-sm">
                      <div className="text-red-300 text-lg font-bold tracking-wider text-center font-mono">
                        RED PILL
                      </div>
                      {/* Scanning line effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent animate-pulse rounded-lg"></div>
                    </div>
                  </div>
                  
                  {/* Subtitle with glitch effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 via-orange-800/50 to-orange-900/30 rounded blur-sm"></div>
                    <div className="relative px-3 py-1 bg-black/70 border border-orange-400/30 rounded backdrop-blur-sm">
                      <div className="text-red-300 text-sm font-medium text-center tracking-wide font-mono">
                        Developer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Matrix Text */}
        <div className="text-center mb-8 max-w-4xl px-4 sm:px-0">
          <div className="text-green-400 mb-4 overflow-hidden">
            <div className="text-xs sm:text-sm md:text-base whitespace-nowrap">
              ╔═══════════════════════════════════════════════════════════════╗
            </div>
          </div>
          <div className="text-green-400 mb-2 overflow-hidden">
            <div className="text-xs sm:text-sm md:text-base whitespace-nowrap">
              ║ This is your last chance. After this, there is no going back. ║
            </div>
          </div>
          <div className="text-green-400 mb-4 overflow-hidden">
            <div className="text-xs sm:text-sm md:text-base whitespace-nowrap">
              ╚═══════════════════════════════════════════════════════════════╝
            </div>
          </div>
          
          <div className="space-y-2 mb-8 text-sm sm:text-base">
            <p className="text-green-300">
              You take the blue pill - the story ends, you wake up in your bed
            </p>
            <p className="text-green-300">
              and believe whatever you want to believe.
            </p>
            <p className="text-red-400 mt-4">
              You take the red pill - you stay in Wonderland, and I show you
            </p>
            <p className="text-red-400">
              how deep the rabbit hole goes into the world of code.
            </p>
          </div>
        </div>


      </div>

    </div>
    </>
  );
}