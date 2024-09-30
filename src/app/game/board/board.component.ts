import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Cell } from '../../core/models/cell.interface';
import { Game } from '../../core/models/game.interface';
import { GameService } from '../../core/services/game.service';
import { SetupService } from '../../core/services/setup.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  gameService = inject(GameService);
  setupService = inject(SetupService);
  toastService = inject(ToastService);
  currentGame!: Game;
  loading = true;
  error = false;
  emoji = '😃';
  gameStarted = false;
  interval: any;
  savedGame = true;
  flagsCount = 0;

  ngOnInit() {
    this.checkExistingGame();
  }

  checkExistingGame() {
    this.gameService.get({ status: 'IN_PROGRESS' }).subscribe({
      next: (response) => {
        if (!response.error && response.data.length > 0) {
          this.currentGame = response.data[response.data.length - 1];
        } else {
          this.startGame();
        }
      },
      error: () => {
        this.error = true;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  reloadPage() {
    location.reload();
  }

  startGame() {
    this.loading = true;
    this.gameService.startGame().subscribe({
      next: (response) => {
        this.currentGame = response.data;
      },
      error: () => {
        this.error = true;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  validateIfStartGame() {
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startTimer();
    }
  }

  revealCell(cell: Cell, index: number) {
    if (cell.isFlag || cell.isRevealed) return;
    this.validateIfStartGame();
    if (cell.isMine) {
      this.revealAllMines();
      this.endGame(false);
      return;
    } else if (cell.adjacentMines > 0) {
      cell.isRevealed = true;
    } else {
      this.revealAdjacentCells(index);
    }

    this.savedGame = false;
    this.checkWinCondition();
  }

  onRightClick(event: MouseEvent, cell: Cell) {
    event.preventDefault();
    if (this.currentGame.status === 'FINISHED') return;
    this.validateIfStartGame();
    if (!cell.isRevealed) {
      cell.isFlag = !cell.isFlag;
      this.countFlags();
    }
    this.savedGame = false;
  }

  countFlags() {
    this.flagsCount = this.currentGame.cells!.filter((cell: any) => cell.isFlag).length;
  }

  revealAllMines() {
    this.currentGame.cells!.forEach((cell: any) => {
      if (cell.isMine) {
        cell.isRevealed = true;
      }
    });
  }

  revealAdjacentCells(index: number) {
    const row = Math.floor(index / this.currentGame.columns);
    const col = index % this.currentGame.columns;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      const newIndex = newRow * this.currentGame.columns + newCol;

      if (
        newRow >= 0 &&
        newRow < this.currentGame.rows &&
        newCol >= 0 &&
        newCol < this.currentGame.columns &&
        !this.currentGame.cells![newIndex].isRevealed &&
        !this.currentGame.cells![newIndex].isMine
      ) {
        this.currentGame.cells![newIndex].isRevealed = true;
        if (this.currentGame.cells![newIndex].adjacentMines === 0) {
          this.revealAdjacentCells(newIndex);
        }
      }
    });
  }

  checkWinCondition() {
    const allNonMinesRevealed = this.currentGame.cells!.every((cell: any) => cell.isRevealed || cell.isMine);

    if (allNonMinesRevealed) {
      this.endGame(true);
    }
  }

  resetGame() {
    this.savedGame = true;
    if (this.currentGame.status === 'IN_PROGRESS') {
      this.gameService
        .updateGame(this.currentGame.id!, {
          endDate: new Date(),
          totalTime: this.currentGame.totalTime,
          cells: this.currentGame.cells,
          status: 'FINISHED',
          result: 'LOSE',
        })
        .subscribe({
          next: () => {
            this.gameStarted = false;
            clearInterval(this.interval);
            this.emoji = '😃';
            this.startGame();
          },
          error: () => {
            this.error = true;
          },
          complete: () => {
            return;
          },
        });
    }
    this.gameStarted = false;
    clearInterval(this.interval);
    this.emoji = '😃';
    this.startGame();
  }

  saveGame() {
    this.gameService
      .updateGame(this.currentGame.id!, {
        totalTime: this.currentGame.totalTime,
        cells: this.currentGame.cells,
      })
      .subscribe();
    this.savedGame = true;
  }

  endGame(win: boolean) {
    this.savedGame = true;
    clearInterval(this.interval);
    this.currentGame.result = win ? 'WIN' : 'LOSE';
    this.currentGame.status = 'FINISHED';
    this.emoji = win ? '😎' : '🥺';

    this.gameService
      .updateGame(this.currentGame.id!, {
        endDate: new Date(),
        totalTime: this.currentGame.totalTime,
        cells: this.currentGame.cells,
        status: 'FINISHED',
        result: this.currentGame.result,
      })
      .subscribe();

    this.toastService.setToast({ type: win ? 'SUCCESS' : 'ERROR', message: win ? 'You win!' : 'You lose!' });
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.currentGame.totalTime++;
    }, 1000);
  }
}
