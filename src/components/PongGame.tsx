import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PongGameProps {
  onClose: () => void;
}

export default function PongGame({ onClose }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState({
    playerY: 150,
    aiY: 150,
    ballX: 300,
    ballY: 200,
    ballVelX: 5,
    ballVelY: 3,
    playerScore: 0,
    aiScore: 0,
    gameRunning: false
  });

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const PADDLE_HEIGHT = 80;
  const PADDLE_WIDTH = 10;
  const BALL_SIZE = 10;

  const updateGame = useCallback(() => {
    if (!gameState.gameRunning) return;

    setGameState(prev => {
      let newState = { ...prev };

      // Move ball
      newState.ballX += newState.ballVelX;
      newState.ballY += newState.ballVelY;

      // Ball collision with top/bottom walls
      if (newState.ballY <= 0 || newState.ballY >= CANVAS_HEIGHT - BALL_SIZE) {
        newState.ballVelY = -newState.ballVelY;
      }

      // Ball collision with paddles
      // Player paddle
      if (newState.ballX <= PADDLE_WIDTH && 
          newState.ballY >= newState.playerY && 
          newState.ballY <= newState.playerY + PADDLE_HEIGHT) {
        newState.ballVelX = -newState.ballVelX;
        newState.ballVelY += (Math.random() - 0.5) * 2; // Add some randomness
      }

      // AI paddle
      if (newState.ballX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE && 
          newState.ballY >= newState.aiY && 
          newState.ballY <= newState.aiY + PADDLE_HEIGHT) {
        newState.ballVelX = -newState.ballVelX;
        newState.ballVelY += (Math.random() - 0.5) * 2;
      }

      // Ball out of bounds
      if (newState.ballX < 0) {
        newState.aiScore++;
        newState.ballX = CANVAS_WIDTH / 2;
        newState.ballY = CANVAS_HEIGHT / 2;
        newState.ballVelX = 5;
        newState.ballVelY = 3;
      }

      if (newState.ballX > CANVAS_WIDTH) {
        newState.playerScore++;
        newState.ballX = CANVAS_WIDTH / 2;
        newState.ballY = CANVAS_HEIGHT / 2;
        newState.ballVelX = -5;
        newState.ballVelY = 3;
      }

      // AI movement (simple)
      const aiSpeed = 4;
      if (newState.aiY + PADDLE_HEIGHT / 2 < newState.ballY) {
        newState.aiY += aiSpeed;
      } else {
        newState.aiY -= aiSpeed;
      }

      // Keep AI paddle in bounds
      newState.aiY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, newState.aiY));

      return newState;
    });
  }, [gameState.gameRunning]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    setGameState(prev => ({
      ...prev,
      playerY: Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, mouseY - PADDLE_HEIGHT / 2))
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (!gameState.gameRunning) return;

    const interval = setInterval(updateGame, 16); // ~60 FPS
    return () => clearInterval(interval);
  }, [updateGame, gameState.gameRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = '#ffff00';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillRect(0, gameState.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, gameState.aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 15;
    ctx.fillRect(gameState.ballX, gameState.ballY, BALL_SIZE, BALL_SIZE);

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [gameState]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameRunning: true }));
  };

  const resetGame = () => {
    setGameState({
      playerY: 150,
      aiY: 150,
      ballX: 300,
      ballY: 200,
      ballVelX: 5,
      ballVelY: 3,
      playerScore: 0,
      aiScore: 0,
      gameRunning: false
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-black border border-yellow-400 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-yellow-400 text-xl matrix-glow">PONG.EXE</h2>
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-300 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="text-cyan-400">
            PLAYER: <span className="text-yellow-400">{gameState.playerScore}</span>
          </div>
          <div className="text-cyan-400">
            AI: <span className="text-yellow-400">{gameState.aiScore}</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-yellow-400/30 cursor-none"
        />

        <div className="mt-4 flex gap-4">
          {!gameState.gameRunning ? (
            <button 
              onClick={startGame}
              className="bg-yellow-400/20 border border-yellow-400 px-4 py-2 text-yellow-400 hover:bg-yellow-400/30 transition-all"
            >
              START
            </button>
          ) : (
            <button 
              onClick={() => setGameState(prev => ({ ...prev, gameRunning: false }))}
              className="bg-red-400/20 border border-red-400 px-4 py-2 text-red-400 hover:bg-red-400/30 transition-all"
            >
              PAUSE
            </button>
          )}
          <button 
            onClick={resetGame}
            className="bg-cyan-400/20 border border-cyan-400 px-4 py-2 text-cyan-400 hover:bg-cyan-400/30 transition-all"
          >
            RESET
          </button>
        </div>

        <div className="mt-4 text-xs text-yellow-400/60">
          Move mouse to control paddle
        </div>
      </div>
    </div>
  );
}