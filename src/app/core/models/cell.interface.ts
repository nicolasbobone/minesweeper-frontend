export interface Cell {
  id: number;
  gameId: number;
  row: number;
  column: number;
  isMine: boolean;
  isRevealed: boolean;
  adjacentMines: number;
  isFlag: boolean;
}
