

export enum SkillLevel {
  Junior = 'Junior',
  Senior = 'Senior',
}

export enum AppMode {
  Review = 'Code Review',
  Challenge = 'AI vs. Human',
  Multiplayer = 'Multiplayer',
}

export interface AnalysisSection {
    title: string;
    explanation: string;
    codeSnippet?: string;
}

export interface AnalysisResult {
  errors: AnalysisSection[];
  warnings: AnalysisSection[];
  optimizations: AnalysisSection[];
  bestPractices: AnalysisSection[];
  rewrittenCode: string;
}

export interface Challenge {
  buggyCode: string;
  description: string;
}

export interface ChallengeResult {
  aiSolution: string;
  feedback: string;
}

// --- Multiplayer Types ---

export enum MultiplayerMode {
  None,
  Local,
  Online,
}

export enum OnlineGameState {
  Lobby,
  Waiting,
  Playing,
  // GameOver state is handled by gameWinner property
}

export interface Player {
  name: string;
  score: number;
}

export interface MultiplayerGameState {
  mode: MultiplayerMode;
  onlineState: OnlineGameState;
  roomCode: string | null;

  players: [Player, Player];
  targetScore: number;
  currentChallenge: Challenge | null;
  roundWinner: Player | null;
  roundStartTime: number | null;
  gameWinner: Player | null;
  isVerifying: boolean;
  activePlayerIndex: 0 | 1;
}

export interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
}