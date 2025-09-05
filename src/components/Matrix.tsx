import React, { useState, useEffect } from 'react';

interface MatrixProps {
  onPillChoice: (pill: 'red' | 'blue') => void;
}

export default function Matrix({ onPillChoice }: MatrixProps) {
  const [showPills, setShowPills] = useState(false);
  const [matrixRain, setMatrixRain] = useState<string[]>([]);

  const morpheusArt = [
    '                    ████████████████████',
    '                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████',
    '              ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '            ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '      ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '    ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '  ██▓▓▓▓▓▓▓▓▓▓▓▓██████        ██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '██▓▓▓▓▓▓▓▓▓▓████    ░░          ░░  ████▓▓▓▓▓▓▓▓▓▓▓▓██',
    '██▓▓▓▓▓▓▓▓██    ░░██░░          ░░██░░  ██▓▓▓▓▓▓▓▓▓▓██',
    '██▓▓▓▓▓▓██      ░░██░░          ░░██░░    ██▓▓▓▓▓▓▓▓██',
    '██▓▓▓▓██          ░░              ░░        ██▓▓▓▓▓▓██',
    '██▓▓██                                        ██▓▓▓▓██',
    '██▓▓██            ████████████████              ██▓▓██',
    '██▓▓██          ██                ██            ██▓▓██',
    '██▓▓██        ██                    ██          ██▓▓██',
    '██▓▓██        ██                    ██          ██▓▓██',
    '██▓▓██          ██                ██            ██▓▓██',
    '██▓▓██            ████████████████              ██▓▓██',
    '██▓▓▓▓██                                      ██▓▓▓▓██',
    '██▓▓▓▓▓▓██                                  ██▓▓▓▓▓▓██',
    '██▓▓▓▓▓▓▓▓██                              ██▓▓▓▓▓▓▓▓██',
    '  ██▓▓▓▓▓▓▓▓▓▓██                      ██▓▓▓▓▓▓▓▓▓▓██',
    '    ██▓▓▓▓▓▓▓▓▓▓▓▓██              ██▓▓▓▓▓▓▓▓▓▓▓▓██',
    '      ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██      ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '            ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '              ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██',
    '                ████▓▓▓▓▓▓▓▓▓▓▓▓████',
    '                    ████████████',
  ];

  const matrixChars = ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト'];

  useEffect(() => {
    // Initialize matrix rain
    const columns = Math.floor(window.innerWidth / 20);
    const initialRain = Array(columns).fill(0).map(() => 
      Array(Math.floor(Math.random() * 100)).fill(0).map(() => 
        matrixChars[Math.floor(Math.random() * matrixChars.length)]
      ).join('')
    );
    setMatrixRain(initialRain);

    // Show pills after a delay
    const timer = setTimeout(() => {
      setShowPills(true);
    }, 3000);

    // Update matrix rain
    const rainInterval = setInterval(() => {
      setMatrixRain(prev => prev.map(column => {
        const chars = column.split('');
        chars.shift();
        chars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)]);
        return chars.join('');
      }));
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(rainInterval);
    };
  }, []);

  return (
    <div className="h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 opacity-20">
        {matrixRain.map((column, index) => (
          <div
            key={index}
            className="absolute text-xs animate-pulse"
            style={{
              left: `${index * 20}px`,
              top: '0',
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
        {/* Morpheus ASCII Art */}
        <div className="mb-8 text-green-300 opacity-80">
          {morpheusArt.map((line, index) => (
            <div key={index} className="text-xs leading-tight">
              {line}
            </div>
          ))}
        </div>

        {/* Matrix Text */}
        <div className="text-center mb-8 max-w-4xl">
          <div className="text-green-400 mb-4 animate-pulse">
            ╔═══════════════════════════════════════════════════════════════╗
          </div>
          <div className="text-green-400 mb-2">
            ║ This is your last chance. After this, there is no going back. ║
          </div>
          <div className="text-green-400 mb-4">
            ╚═══════════════════════════════════════════════════════════════╝
          </div>
          
          <div className="space-y-2 mb-8">
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

        {/* Pills */}
        {showPills && (
          <div className="flex space-x-16 animate-fade-in">
            {/* Blue Pill */}
            <div className="text-center">
              <button
                onClick={() => onPillChoice('blue')}
                className="group relative"
              >
                <div className="text-blue-400 hover:text-blue-300 transition-colors">
                  <div className="text-2xl mb-2">💊</div>
                  <div className="border border-blue-400 rounded-lg px-6 py-3 hover:bg-blue-900/20 transition-all">
                    <div className="text-blue-400 group-hover:text-blue-300">BLUE PILL</div>
                    <div className="text-xs text-blue-300 mt-1">Non-Developer</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-blue-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
              </button>
            </div>

            {/* Red Pill */}
            <div className="text-center">
              <button
                onClick={() => onPillChoice('red')}
                className="group relative"
              >
                <div className="text-red-400 hover:text-red-300 transition-colors">
                  <div className="text-2xl mb-2">💊</div>
                  <div className="border border-red-400 rounded-lg px-6 py-3 hover:bg-red-900/20 transition-all">
                    <div className="text-red-400 group-hover:text-red-300">RED PILL</div>
                    <div className="text-xs text-red-300 mt-1">Developer</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-red-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
              </button>
            </div>
          </div>
        )}

        {/* Loading message before pills appear */}
        {!showPills && (
          <div className="text-green-400 animate-pulse">
            <div className="text-center">
              Initializing choice protocol...
            </div>
            <div className="text-center mt-2">
              ████████████████████████ 100%
            </div>
          </div>
        )}
      </div>

      {/* Bottom terminal line */}
      <div className="absolute bottom-4 left-4 right-4 text-green-400 text-xs opacity-60">
        <div className="flex justify-between">
          <span>MATRIX_OS v1.0 | MORPHEUS_INTERFACE_ACTIVE</span>
          <span>CHOICE_PROTOCOL: ENABLED</span>
        </div>
      </div>
    </div>
  );
}