import React, { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface TetrisGameProps {
  onClose: () => void;
}

export default function TetrisGame({ onClose }: TetrisGameProps) {
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  const [board, setBoard] = useState<number[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<number[][]>([]);
  const [position, setPosition] = useState<Position>({ x: 4, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const tetrominoes = [
    // I piece
    [[1, 1, 1, 1]],
    // O piece
    [[1, 1], [1, 1]],
    // T piece
    [[0, 1, 0], [1, 1, 1]],
    // S piece
    [[0, 1, 1], [1, 1, 0]],
    // Z piece
    [[1, 1, 0], [0, 1, 1]],
    // J piece
    [[1, 0, 0], [1, 1, 1]],
    // L piece
    [[0, 0, 1], [1, 1, 1]]
  ];

  const getRandomPiece = () => {
    return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
  };

  const isValidMove = (piece: number[][], pos: Position, boardState: number[][]) => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          if (newY >= 0 && boardState[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const rotatePiece = (piece: number[][]) => {
    const rotated = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
    return rotated;
  };

  const clearLines = (boardState: number[][]) => {
    const newBoard = boardState.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    const emptyRows = Array(linesCleared).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    return [...emptyRows, ...newBoard];
  };

  const placePiece = useCallback(() => {
    if (!currentPiece.length) return;

    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x] && position.y + y >= 0) {
          newBoard[position.y + y][position.x + x] = 1;
        }
      }
    }

    const clearedBoard = clearLines(newBoard);
    const linesCleared = newBoard.length - clearedBoard.length;
    
    setBoard(clearedBoard);
    setScore(prev => prev + linesCleared * 100 * level);
    setCurrentPiece(getRandomPiece());
    setPosition({ x: 4, y: 0 });

    // Check game over
    if (!isValidMove(getRandomPiece(), { x: 4, y: 0 }, clearedBoard)) {
      setGameOver(true);
    }
  }, [board, currentPiece, position, level]);

  const moveDown = useCallback(() => {
    if (!currentPiece.length || gameOver || isPaused) return;

    const newPos = { ...position, y: position.y + 1 };
    if (isValidMove(currentPiece, newPos, board)) {
      setPosition(newPos);
    } else {
      placePiece();
    }
  }, [currentPiece, position, board, gameOver, isPaused, placePiece]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver || isPaused || !currentPiece.length) return;

    switch (e.key) {
      case 'ArrowLeft':
        const leftPos = { ...position, x: position.x - 1 };
        if (isValidMove(currentPiece, leftPos, board)) {
          setPosition(leftPos);
        }
        break;
      case 'ArrowRight':
        const rightPos = { ...position, x: position.x + 1 };
        if (isValidMove(currentPiece, rightPos, board)) {
          setPosition(rightPos);
        }
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowUp':
        const rotated = rotatePiece(currentPiece);
        if (isValidMove(rotated, position, board)) {
          setCurrentPiece(rotated);
        }
        break;
      case ' ':
        setIsPaused(prev => !prev);
        break;
    }
  }, [currentPiece, position, board, gameOver, isPaused, moveDown]);

  useEffect(() => {
    setCurrentPiece(getRandomPiece());
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      const interval = setInterval(moveDown, Math.max(100, 1000 - (level - 1) * 100));
      return () => clearInterval(interval);
    }
  }, [moveDown, level, gameOver, isPaused]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece.length) {
      for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
          if (currentPiece[y][x] && position.y + y >= 0) {
            displayBoard[position.y + y][position.x + x] = 2;
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-6 h-6 border border-yellow-400/20 ${
              cell === 1 ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' :
              cell === 2 ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' :
              'bg-black/50'
            }`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-black border border-yellow-400 p-6 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-yellow-400 text-xl matrix-glow">TETRIS.EXE</h2>
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-300 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex gap-4">
          <div className="flex flex-col">
            {renderBoard()}
          </div>
          
          <div className="text-yellow-400 space-y-4 min-w-32">
            <div>
              <div className="text-sm">SCORE:</div>
              <div className="text-cyan-400">{score.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm">LEVEL:</div>
              <div className="text-cyan-400">{level}</div>
            </div>
            {gameOver && (
              <div className="text-red-400 animate-pulse">
                GAME OVER
              </div>
            )}
            {isPaused && (
              <div className="text-yellow-400 animate-pulse">
                PAUSED
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-xs text-yellow-400/60">
          <div>← → ↓ : Move</div>
          <div>↑ : Rotate</div>
          <div>SPACE : Pause</div>
        </div>
      </div>
    </div>
  );
}