import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Subscription } from 'rxjs';
import { Toast } from './core/models/toast.interface';
import { DarkModeService } from './core/services/dark-mode.service';
import { ToastService } from './core/services/toast.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-minesweeper-app';
  darkModeService = inject(DarkModeService);
  toastService = inject(ToastService);
  toast: Toast | null = null;
  private toastSubscription!: Subscription;

  ngOnInit(): void {
    initFlowbite();
    this.toastSubscription = this.toastService.getToast().subscribe((toast) => {
      this.toast = toast;
    });
  }

  clearError(): void {
    this.toastService.setToast(null);
  }

  ngOnDestroy(): void {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
  }
}
