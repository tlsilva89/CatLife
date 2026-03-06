import { Injectable, signal } from '@angular/core';

export interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  resolve?: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  state = signal<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  });

  confirm(title: string, message: string, confirmText = 'Confirmar', cancelText = 'Cancelar'): Promise<boolean> {
    return new Promise((resolve) => {
      this.state.set({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        resolve
      });
    });
  }

  close(result: boolean) {
    const currentState = this.state();
    if (currentState.resolve) {
      currentState.resolve(result);
    }
    this.state.update(s => ({ ...s, isOpen: false }));
  }
}