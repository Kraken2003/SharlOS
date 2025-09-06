import React, { useState, useEffect, useRef, useCallback } from 'react';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SpaceInvadersGameProps {
  onClose: () => void;
}

const GAME_WIDTH = 500;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 24;
const ENEMY_WIDTH = 24;
const ENEMY_HEIGHT = 16;
const BULLET_WIDTH = 3;
const BULLET_HEIGHT = 8;

export default function SpaceInvadersGame({ onClose }: SpaceInvadersGameProps) {
  const [gameState, setGameState] = useState({
    player: { x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - 50 },
    playerBullets: [] as GameObject[],
    enemyBullets: [] as GameObject[],
    enemies: [] as GameObject[],
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    levelComplete: false,
    isPaused: false,
    showLevelStart: true
  });

  const [enemyDirection, setEnemyDirection] = useState(1);
  const [enemyMoveTimer, setEnemyMoveTimer] = useState(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastShotRef = useRef(0);
  const levelStartTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate enemy move speed based on remaining enemies and level
  const getEnemyMoveSpeed = useCallback((enemyCount: number, level: number) => {
    const baseSpeed = Math.max(30 - level * 2, 8); // Faster each level, minimum 8 frames
    const speedBoost = Math.max(1, Math.floor((50 - enemyCount) / 5)); // Speed up as enemies die
    return Math.max(baseSpeed - speedBoost, 3); // Minimum 3 frames between moves
  }, []);

  // Calculate enemy shooting frequency based on level
  const getEnemyShootChance = useCallback((level: number) => {
    return Math.min(0.005 + (level - 1) * 0.002, 0.015); // Increases with level, capped
  }, []);

  // Initialize enemies for current level
  const initializeEnemies = useCallback((level: number) => {
    const enemies: GameObject[] = [];
    const rows = Math.min(3 + Math.floor((level - 1) / 2), 5); // More rows in higher levels
    const cols = 8 + Math.min(Math.floor((level - 1) / 3), 2); // More columns in higher levels
    
    const startY = 60;
    const spacing = 32;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        enemies.push({
          x: col * spacing + (GAME_WIDTH - cols * spacing) / 2,
          y: row * (ENEMY_HEIGHT + 12) + startY,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT
        });
      }
    }
    return enemies;
  }, []);

  // Collision detection
  const checkCollision = useCallback((obj1: GameObject, obj2: GameObject): boolean => {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }, []);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current[e.key] = true;
    
    if (e.key === 'p' || e.key === 'P') {
      setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    }
    
    if (e.key === ' ') {
      e.preventDefault();
      const now = Date.now();
      if (now - lastShotRef.current > 200) { // Slightly slower shooting for balance
        setGameState(prev => {
          if (prev.gameOver || prev.isPaused || prev.showLevelStart) return prev;
          
          const newBullet: GameObject = {
            x: prev.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
            y: prev.player.y - 5,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT
          };
          
          return {
            ...prev,
            playerBullets: [...prev.playerBullets, newBullet]
          };
        });
        lastShotRef.current = now;
      }
    }

    // Next level or restart on Enter
    if (e.key === 'Enter') {
      setGameState(prev => {
        if (prev.levelComplete) {
          return {
            ...prev,
            level: prev.level + 1,
            enemies: initializeEnemies(prev.level + 1),
            playerBullets: [],
            enemyBullets: [],
            levelComplete: false,
            showLevelStart: true
          };
        } else if (prev.gameOver) {
          return {
            player: { x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - 50 },
            playerBullets: [],
            enemyBullets: [],
            enemies: initializeEnemies(1),
            score: 0,
            lives: 3,
            level: 1,
            gameOver: false,
            levelComplete: false,
            isPaused: false,
            showLevelStart: true
          };
        }
        return prev;
      });
      setEnemyDirection(1);
      setEnemyMoveTimer(0);
    }
  }, [initializeEnemies]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current[e.key] = false;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.isPaused || prev.showLevelStart) return prev;

      let newState = { ...prev };

      // Move player
      const playerSpeed = 3;
      if (keysRef.current['ArrowLeft'] && newState.player.x > 0) {
        newState.player = { ...newState.player, x: Math.max(0, newState.player.x - playerSpeed) };
      }
      if (keysRef.current['ArrowRight'] && newState.player.x < GAME_WIDTH - PLAYER_WIDTH) {
        newState.player = { ...newState.player, x: Math.min(GAME_WIDTH - PLAYER_WIDTH, newState.player.x + playerSpeed) };
      }

      // Move player bullets
      newState.playerBullets = newState.playerBullets
        .map(bullet => ({ ...bullet, y: bullet.y - 5 }))
        .filter(bullet => bullet.y > 0);

      // Move enemy bullets
      newState.enemyBullets = newState.enemyBullets
        .map(bullet => ({ ...bullet, y: bullet.y + 3 }))
        .filter(bullet => bullet.y < GAME_HEIGHT);

      return newState;
    });

    // Handle enemy movement with proper timing
    setEnemyMoveTimer(prev => {
      const newTimer = prev + 1;
      const enemyCount = gameState.enemies.length;
      const moveSpeed = getEnemyMoveSpeed(enemyCount, gameState.level);
      
      if (newTimer >= moveSpeed) {
        setGameState(prevState => {
          if (prevState.gameOver || prevState.isPaused || prevState.showLevelStart) return prevState;
          
          let newState = { ...prevState };
          let shouldMoveDown = false;
          
          // Check if enemies should move down
          const leftMost = Math.min(...newState.enemies.map(e => e.x));
          const rightMost = Math.max(...newState.enemies.map(e => e.x + e.width));
          
          if ((enemyDirection > 0 && rightMost >= GAME_WIDTH - 10) || 
              (enemyDirection < 0 && leftMost <= 10)) {
            shouldMoveDown = true;
          }

          if (shouldMoveDown) {
            // Move enemies down
            newState.enemies = newState.enemies.map(enemy => ({ 
              ...enemy, 
              y: enemy.y + 20 
            }));
            setEnemyDirection(prev => -prev);
          } else {
            // Move enemies horizontally
            newState.enemies = newState.enemies.map(enemy => ({ 
              ...enemy, 
              x: enemy.x + enemyDirection * 8
            }));
          }

          // Check if enemies reached player
          const lowestEnemy = Math.max(...newState.enemies.map(e => e.y + e.height));
          if (lowestEnemy >= newState.player.y - 10) {
            newState.lives = 0; // Instant game over if enemies reach player
          }

          // Enemy shooting
          if (Math.random() < getEnemyShootChance(newState.level) && newState.enemies.length > 0) {
            const bottomRowEnemies = newState.enemies.filter(enemy => {
              return !newState.enemies.some(other => 
                other.x === enemy.x && other.y > enemy.y
              );
            });
            
            if (bottomRowEnemies.length > 0) {
              const randomEnemy = bottomRowEnemies[Math.floor(Math.random() * bottomRowEnemies.length)];
              const newBullet: GameObject = {
                x: randomEnemy.x + ENEMY_WIDTH / 2 - BULLET_WIDTH / 2,
                y: randomEnemy.y + ENEMY_HEIGHT,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT
              };
              newState.enemyBullets = [...newState.enemyBullets, newBullet];
            }
          }

          return newState;
        });
        return 0;
      }
      return newTimer;
    });

    // Handle collisions
    setGameState(prev => {
      if (prev.gameOver || prev.isPaused || prev.showLevelStart) return prev;
      
      let newState = { ...prev };

      // Check player bullet vs enemy collisions
      newState.playerBullets = newState.playerBullets.filter(bullet => {
        const hitEnemyIndex = newState.enemies.findIndex(enemy => 
          checkCollision(bullet, enemy)
        );
        
        if (hitEnemyIndex !== -1) {
          newState.enemies.splice(hitEnemyIndex, 1);
          newState.score += (10 * newState.level); // More points in higher levels
          return false;
        }
        return true;
      });

      // Check enemy bullet vs player collisions
      const playerHit = newState.enemyBullets.some(bullet => 
        checkCollision(bullet, {
          x: newState.player.x,
          y: newState.player.y,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT
        })
      );

      if (playerHit) {
        newState.lives -= 1;
        newState.enemyBullets = []; // Clear enemy bullets on hit
        newState.playerBullets = []; // Clear player bullets on hit
        
        if (newState.lives <= 0) {
          newState.gameOver = true;
        }
      }

      // Check level completion
      if (newState.enemies.length === 0) {
        newState.levelComplete = true;
        newState.score += 100 * newState.level; // Level completion bonus
      }

      return newState;
    });
  }, [gameState.enemies.length, gameState.level, enemyDirection, getEnemyMoveSpeed, getEnemyShootChance, checkCollision]);

  // Initialize first level
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      enemies: initializeEnemies(1)
    }));
  }, [initializeEnemies]);

  // Level start timer
  useEffect(() => {
    if (gameState.showLevelStart) {
      levelStartTimerRef.current = setTimeout(() => {
        setGameState(prev => ({ ...prev, showLevelStart: false }));
      }, 2000);
    }
    
    return () => {
      if (levelStartTimerRef.current) {
        clearTimeout(levelStartTimerRef.current);
      }
    };
  }, [gameState.showLevelStart]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Start game loop
  useEffect(() => {
    gameLoopRef.current = setInterval(gameLoop, 16); // 60 FPS
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-black border border-red-400 p-6 max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-red-400 text-xl matrix-glow">SPACE_INVADERS.EXE</h2>
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-300 text-xl"
          >
            ×
          </button>
        </div>
        
        <div 
          className="relative bg-black border border-red-400/30 overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Player */}
          <div
            className="absolute bg-yellow-400 shadow-lg shadow-yellow-400/50 flex items-center justify-center text-yellow-900 font-bold text-lg"
            style={{
              left: gameState.player.x,
              top: gameState.player.y,
              width: PLAYER_WIDTH,
              height: PLAYER_HEIGHT
            }}
          >
            ▲
          </div>

          {/* Enemies */}
          {gameState.enemies.map((enemy, index) => (
            <div
              key={`enemy-${index}`}
              className="absolute bg-red-400 shadow-lg shadow-red-400/50 flex items-center justify-center text-red-900 font-bold text-sm"
              style={{
                left: enemy.x,
                top: enemy.y,
                width: ENEMY_WIDTH,
                height: ENEMY_HEIGHT
              }}
            >
              ▼
            </div>
          ))}

          {/* Player Bullets */}
          {gameState.playerBullets.map((bullet, index) => (
            <div
              key={`player-bullet-${index}`}
              className="absolute bg-cyan-400 shadow-lg shadow-cyan-400/50"
              style={{
                left: bullet.x,
                top: bullet.y,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT
              }}
            />
          ))}

          {/* Enemy Bullets */}
          {gameState.enemyBullets.map((bullet, index) => (
            <div
              key={`enemy-bullet-${index}`}
              className="absolute bg-red-400 shadow-lg shadow-red-400/50"
              style={{
                left: bullet.x,
                top: bullet.y,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT
              }}
            />
          ))}

          {/* Level Start Screen */}
          {gameState.showLevelStart && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
              <div className="text-center">
                <div className="text-yellow-400 text-3xl mb-4 font-bold animate-pulse">
                  LEVEL {gameState.level}
                </div>
                <div className="text-red-400 text-lg">
                  GET READY!
                </div>
              </div>
            </div>
          )}

          {/* Level Complete Screen */}
          {gameState.levelComplete && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
              <div className="text-center">
                <div className="text-green-400 text-3xl mb-4 font-bold">
                  LEVEL {gameState.level} COMPLETE!
                </div>
                <div className="text-yellow-400 text-xl mb-2">
                  Bonus: +{100 * gameState.level} points
                </div>
                <div className="text-cyan-400 text-lg">
                  Press ENTER for Level {gameState.level + 1}
                </div>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState.gameOver && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-400 text-3xl mb-4 font-bold">
                  GAME OVER
                </div>
                <div className="text-yellow-400 text-xl mb-2">
                  FINAL SCORE: {gameState.score}
                </div>
                <div className="text-yellow-400 text-lg mb-4">
                  Level Reached: {gameState.level}
                </div>
                <div className="text-cyan-400 text-lg">
                  Press ENTER to restart
                </div>
              </div>
            </div>
          )}

          {/* Pause Screen */}
          {gameState.isPaused && !gameState.gameOver && !gameState.levelComplete && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-yellow-400 text-3xl animate-pulse font-bold">
                PAUSED
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-4">
          <div className="text-red-400 text-sm">
            <div>SCORE: {gameState.score}</div>
            <div>LEVEL: {gameState.level}</div>
            <div>LIVES: {'❤️'.repeat(gameState.lives)}</div>
          </div>
          <div className="text-xs text-red-400/60 text-right">
            <div>← → : Move</div>
            <div>SPACE : Shoot</div>
            <div>P : Pause</div>
            <div>ENTER : Next Level/Restart</div>
          </div>
        </div>
      </div>
    </div>
  );
}
