import { Cell } from './cell.interface';

export interface Game {
  id?: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  totalTime: number;
  result: GameResult;
  status: GameStatus;
  rows: number;
  columns: number;
  minesCount: number;
  difficulty: GameDifficulty;
  createdAt?: Date;
  updatedAt?: Date;
  cells?: Cell[];
}

export type GameDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type GameResult = 'WIN' | 'LOSE';
export type GameStatus = 'IN_PROGRESS' | 'FINISHED';
