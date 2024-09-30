import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from '../models/toast.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);

  setToast(toast: Toast | null): void {
    this.toastSubject.next(toast);
  }

  getToast(): Observable<Toast | null> {
    return this.toastSubject.asObservable();
  }
}
