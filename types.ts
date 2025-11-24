export interface UserData {
  name: string;
  instagram: string;
}

export interface Riddle {
  question: string;
  hint?: string;
}

export interface GameState {
  currentLevel: number;
  score: number;
  isGameOver: boolean;
  history: string[]; // Store hashes or questions to prevent repeats locally
}

export enum AppStatus {
  WELCOME = 'WELCOME',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
}