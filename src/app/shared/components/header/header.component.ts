import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../core/models/user.interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { DarkModeService } from '../../../core/services/dark-mode.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  menuSelected = 'instructions';
  darkModeService = inject(DarkModeService);
  router = inject(Router);
  userAuth: User | null = null;
  isAuth = false;
  private subscription!: Subscription;
  private subscriptionAuth!: Subscription;

  constructor() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const urlSegments = event.url.split('/');
        const lastSegment = urlSegments[urlSegments.length - 1];
        this.menuSelected = lastSegment;
      }
    });
  }

  ngOnInit() {
    this.subscriptionAuth = this.authService.getUserAuth().subscribe((userAuth: any) => {
      this.userAuth = userAuth.user;
      this.isAuth = userAuth.isAuthenticated;
    });
  }

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  selectMenu(selected: string) {
    this.menuSelected = selected;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionAuth.unsubscribe();
  }
}
