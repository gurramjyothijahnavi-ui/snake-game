import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  className?: string;
}

export default function SnakeGame({ onScoreUpdate, className = '' }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const directionRef = useRef<Direction>('RIGHT');

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 10 });
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setIsGameOver(false);
    setScore(0);
    onScoreUpdate(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Collision check
        if (
          newHead.x < 0 || 
          newHead.x >= CANVAS_SIZE / GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= CANVAS_SIZE / GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        
        // Food check
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const nextScore = s + 10;
            onScoreUpdate(nextScore);
            return nextScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, 120);
    return () => clearInterval(gameInterval);
  }, [isPaused, isGameOver, food, generateFood, onScoreUpdate, score, highScore]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Grid (Subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw Snake
    ctx.shadowBlur = 15;
    prevSnakeRef.current = snake;
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00f2ff' : '#00aacc';
      ctx.shadowColor = '#00f2ff';
      ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow for further draws
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const prevSnakeRef = useRef(snake);

  return (
    <div className={`relative flex flex-col items-center gap-4 ${className}`}>
      <div className="flex justify-between w-full max-w-[400px] font-mono text-cyan-400 text-sm">
        <span>SCORE: {score}</span>
        <span>HIGH: {highScore}</span>
      </div>

      <div className="relative border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded-lg overflow-hidden bg-[#0a0a0a]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block"
        />
        
        {(isPaused || isGameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all">
            {isGameOver ? (
              <>
                <h2 className="text-4xl font-black text-magenta-500 mb-2 tracking-tighter drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">GAME OVER</h2>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all font-bold uppercase tracking-widest rounded-sm"
                >
                  R E T R Y
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-cyan-400 mb-6 tracking-widest">NEON RHYTHM</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-cyan-500 text-black hover:bg-cyan-400 transition-all font-black uppercase tracking-widest rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                >
                  S T A R T
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="text-xs text-slate-500 font-mono text-center uppercase tracking-tighter">
        Use Arrow Keys to Navigate the Void
      </div>
    </div>
  );
}
