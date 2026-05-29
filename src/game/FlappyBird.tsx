import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as C from './constants';
import { GameData } from './types';
import { createInitialState, flap, update } from './engine';
import {
  drawSky,
  drawClouds,
  drawGround,
  drawPipe,
  drawBird,
  drawScore,
  drawFlash,
  drawIdleScreen,
  drawGameOver,
} from './renderer';

const FlappyBird: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameData>(createInitialState());
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [, forceRender] = useState(0);

  const handleFlap = useCallback(() => {
    const game = gameRef.current;
    if (game.state === 'gameover') {
      // small delay before restart
      const newState = createInitialState();
      newState.state = 'playing';
      newState.bird.velocity = C.FLAP_FORCE;
      gameRef.current = newState;
    } else {
      gameRef.current = flap(game);
    }
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min(timestamp - lastTimeRef.current, 33); // cap at ~30fps min
      lastTimeRef.current = timestamp;

      // Update game state
      gameRef.current = update(gameRef.current, dt, timestamp);
      const game = gameRef.current;

      // Clear & draw
      ctx.clearRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);

      // Sky
      drawSky(ctx);
      drawClouds(ctx, game.groundOffset);

      // Pipes
      game.pipes.forEach(pipe => drawPipe(ctx, pipe));

      // Ground (on top of pipes)
      drawGround(ctx, game.groundOffset);

      // Bird
      drawBird(ctx, game.bird);

      // UI overlays
      if (game.state === 'playing') {
        drawScore(ctx, game.score);
      }

      if (game.state === 'idle') {
        drawIdleScreen(ctx);
      }

      if (game.state === 'gameover') {
        drawFlash(ctx, game.flashTimer);
        drawGameOver(ctx, game.score, game.bestScore);
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Input handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleFlap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlap]);

  // Force re-render for state-dependent UI (unused but kept for potential UI needs)
  useEffect(() => {
    const interval = setInterval(() => forceRender(c => c + 1), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 select-none">
      <canvas
        ref={canvasRef}
        width={C.CANVAS_WIDTH}
        height={C.CANVAS_HEIGHT}
        className="rounded-xl shadow-2xl cursor-pointer max-w-full"
        style={{
          imageRendering: 'auto',
          maxHeight: '90vh',
          aspectRatio: `${C.CANVAS_WIDTH}/${C.CANVAS_HEIGHT}`,
        }}
        onClick={handleFlap}
        onTouchStart={(e) => {
          e.preventDefault();
          handleFlap();
        }}
      />
      <div className="mt-4 text-gray-500 text-sm font-medium tracking-wide">
        Space / Tap to flap
      </div>
    </div>
  );
};

export default FlappyBird;
