import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(type: 'success' | 'error' | 'info', message: string) {
    const id = Math.random().toString(36).substring(2, 9);
    
    this.toasts.update(currentToasts => [...currentToasts, { id, type, message }]);

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: string) {
    this.toasts.update(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }
}