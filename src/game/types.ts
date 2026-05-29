export interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
  wingPhase: number;
}

export interface Pipe {
  x: number;
  topHeight: number;   // height of the top pipe (from top of canvas)
  scored: boolean;
}

export type GameState = 'idle' | 'playing' | 'gameover';

export interface GameData {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  bestScore: number;
  state: GameState;
  groundOffset: number;
  lastPipeSpawn: number;
  flashTimer: number;
}
