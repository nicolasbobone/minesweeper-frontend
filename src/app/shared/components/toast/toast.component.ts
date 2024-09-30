import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Toast } from '../../../core/models/toast.interface';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit {
  @Input() toast: Toast = { type: 'INFO', message: 'This is a toast message!' };
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  isVisible = true;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = false;
      this.close.emit();
    }, 5000);
  }

  get toastClass() {
    return {
      'inline-flex h-8 w-8 items-center justify-center rounded-lg': true,
      'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200': this.toast.type === 'SUCCESS',
      'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200': this.toast.type === 'ERROR',
      'bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200': this.toast.type === 'INFO',
    };
  }

  closeToast() {
    this.isVisible = false;
    this.close.emit();
  }
}
