import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  darkModeSignal = signal<string>(this.getInitialTheme());

  constructor() {
    effect(() => {
      localStorage.setItem('theme', this.darkModeSignal());
    });
  }

  getInitialTheme(): string {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  updateDarkMode() {
    this.darkModeSignal.update((value) =>
      value === 'dark' ? 'light' : 'dark'
    );
  }
}
