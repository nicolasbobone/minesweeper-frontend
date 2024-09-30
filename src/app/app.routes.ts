import { Routes } from '@angular/router';
import { authGuard } from './guards/authentication';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.routes').then((m) => m.GAME_ROUTES),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
];
