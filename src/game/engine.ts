import { GameData, Pipe } from './types';
import * as C from './constants';

export function createInitialState(): GameData {
  const best = parseInt(localStorage.getItem('flappy_best') || '0', 10);
  return {
    bird: {
      x: C.BIRD_X,
      y: C.CANVAS_HEIGHT / 2 - C.BIRD_HEIGHT / 2,
      velocity: 0,
      rotation: 0,
      wingPhase: 0,
    },
    pipes: [],
    score: 0,
    bestScore: best,
    state: 'idle',
    groundOffset: 0,
    lastPipeSpawn: 0,
    flashTimer: 0,
  };
}

export function flap(game: GameData): GameData {
  if (game.state === 'gameover') {
    // Restart after a short delay
    return createInitialState();
  }

  const newState = game.state === 'idle' ? 'playing' : game.state;

  return {
    ...game,
    state: newState,
    bird: {
      ...game.bird,
      velocity: C.FLAP_FORCE,
    },
  };
}

export function spawnPipe(_game: GameData, _timestamp: number): Pipe {
  const playableHeight = C.CANVAS_HEIGHT - C.GROUND_HEIGHT - C.PIPE_GAP - C.PIPE_MIN_HEIGHT * 2;
  const topHeight = C.PIPE_MIN_HEIGHT + Math.random() * playableHeight;

  return {
    x: C.CANVAS_WIDTH + 10,
    topHeight,
    scored: false,
  };
}

export function update(game: GameData, _dt: number, timestamp: number): GameData {
  if (game.state === 'idle') {
    // Idle animation: bird bobs, ground scrolls
    const bird = {
      ...game.bird,
      y: C.CANVAS_HEIGHT / 2 - C.BIRD_HEIGHT / 2 + Math.sin(timestamp / 300) * 10,
      wingPhase: game.bird.wingPhase + 0.15,
      rotation: 0,
    };
    const groundOffset = game.groundOffset + C.GROUND_SPEED;
    return { ...game, bird, groundOffset };
  }

  if (game.state === 'gameover') {
    // Bird falls, flash fades
    const bird = { ...game.bird };
    const groundY = C.CANVAS_HEIGHT - C.GROUND_HEIGHT - C.BIRD_HEIGHT;

    if (bird.y < groundY) {
      bird.velocity = Math.min(bird.velocity + C.GRAVITY, C.MAX_FALL_SPEED);
      bird.y += bird.velocity;
      bird.rotation = C.BIRD_ROTATION_DOWN;
      if (bird.y >= groundY) {
        bird.y = groundY;
        bird.velocity = 0;
      }
    }

    const flashTimer = Math.max(0, game.flashTimer - 0.05);
    return { ...game, bird, flashTimer };
  }

  // === PLAYING ===
  let bird = { ...game.bird };
  let pipes = game.pipes.map(p => ({ ...p }));
  let score = game.score;
  let bestScore = game.bestScore;
  let flashTimer = game.flashTimer;

  // Bird physics
  bird.velocity = Math.min(bird.velocity + C.GRAVITY, C.MAX_FALL_SPEED);
  bird.y += bird.velocity;
  bird.wingPhase += 0.2;

  // Bird rotation based on velocity
  if (bird.velocity < 0) {
    bird.rotation = C.BIRD_ROTATION_UP;
  } else {
    const t = Math.min(bird.velocity / C.MAX_FALL_SPEED, 1);
    bird.rotation = C.BIRD_ROTATION_UP + t * (C.BIRD_ROTATION_DOWN - C.BIRD_ROTATION_UP);
  }

  // Ground scroll
  const groundOffset = game.groundOffset + C.GROUND_SPEED;

  // Pipe spawning
  let lastPipeSpawn = game.lastPipeSpawn;
  if (timestamp - lastPipeSpawn > C.PIPE_SPAWN_INTERVAL || pipes.length === 0) {
    // Only spawn if there's room
    const lastPipe = pipes[pipes.length - 1];
    if (!lastPipe || lastPipe.x < C.CANVAS_WIDTH - 200) {
      pipes.push(spawnPipe(game, timestamp));
      lastPipeSpawn = timestamp;
    }
  }

  // Move pipes
  pipes.forEach(p => {
    p.x -= C.PIPE_SPEED;
  });

  // Remove off-screen pipes
  pipes = pipes.filter(p => p.x + C.PIPE_WIDTH + C.PIPE_CAP_OVERHANG > -10);

  // Score - bird passes pipe center
  pipes.forEach(p => {
    if (!p.scored && p.x + C.PIPE_WIDTH < bird.x) {
      p.scored = true;
      score++;
    }
  });

  // Update best score
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('flappy_best', bestScore.toString());
  }

  // Collision detection
  const birdBox = {
    left: bird.x + 4,
    right: bird.x + C.BIRD_WIDTH - 4,
    top: bird.y + 4,
    bottom: bird.y + C.BIRD_HEIGHT - 4,
  };

  const groundY = C.CANVAS_HEIGHT - C.GROUND_HEIGHT;
  let dead = false;

  // Ground / ceiling collision
  if (birdBox.bottom >= groundY || birdBox.top <= 0) {
    dead = true;
    if (bird.y + C.BIRD_HEIGHT > groundY) {
      bird.y = groundY - C.BIRD_HEIGHT;
    }
    if (bird.y < 0) bird.y = 0;
  }

  // Pipe collision
  for (const p of pipes) {
    const pipeLeft = p.x - C.PIPE_CAP_OVERHANG;
    const pipeRight = p.x + C.PIPE_WIDTH + C.PIPE_CAP_OVERHANG;
    const gapTop = p.topHeight;
    const gapBottom = p.topHeight + C.PIPE_GAP;

    if (birdBox.right > pipeLeft && birdBox.left < pipeRight) {
      if (birdBox.top < gapTop || birdBox.bottom > gapBottom) {
        dead = true;
        break;
      }
    }
  }

  if (dead) {
    return {
      ...game,
      bird: { ...bird, velocity: -4 },
      pipes,
      score,
      bestScore,
      state: 'gameover',
      groundOffset,
      lastPipeSpawn,
      flashTimer: 1,
    };
  }

  return {
    ...game,
    bird,
    pipes,
    score,
    bestScore,
    state: 'playing',
    groundOffset,
    lastPipeSpawn,
    flashTimer,
  };
}
