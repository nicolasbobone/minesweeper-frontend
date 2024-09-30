import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Game } from '../../core/models/game.interface';
import { GameService } from '../../core/services/game.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-games-played',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './games-played.component.html',
})
export class GamesPlayedComponent implements OnInit {
  gameService = inject(GameService);
  gamesPlayed: Game[] = [];
  filteredGames: Game[] = [];
  loading = true;
  error: boolean = false;
  filters: any = {
    startDate: '',
    endDate: '',
    totalTime: '',
    result: '',
    status: '',
    difficulty: '',
  };
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.getGamesPlayed();
  }

  getGamesPlayed() {
    this.loading = true;
    const activeFilters = Object.fromEntries(Object.entries(this.filters).filter(([_, value]) => value));
    this.gameService.get(activeFilters).subscribe({
      next: (response) => {
        this.gamesPlayed = response.data;
        this.sortGames();
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

  onFilterChange() {
    if (this.filters.startDate) {
      this.filters.startDate = new Date(this.filters.startDate);
    }
    if (this.filters.endDate) {
      this.filters.endDate = new Date(this.filters.endDate);
    }
    this.getGamesPlayed();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortGames();
  }

  sortGames(): void {
    this.gamesPlayed.sort((a: Game, b: Game) => {
      const valueA = a[this.sortField as keyof Game];
      const valueB = b[this.sortField as keyof Game];

      if (valueA === undefined || valueB === undefined) {
        return 0;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }
}
