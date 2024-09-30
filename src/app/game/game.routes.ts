import { Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { GamesPlayedComponent } from './games-played/games-played.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { SetupComponent } from './setup/setup.component';

export const GAME_ROUTES: Routes = [
  {
    path: 'setup',
    component: SetupComponent,
  },
  {
    path: 'board',
    component: BoardComponent,
  },
  {
    path: 'instructions',
    component: InstructionsComponent,
  },
  {
    path: 'games-played',
    component: GamesPlayedComponent,
  },
];
