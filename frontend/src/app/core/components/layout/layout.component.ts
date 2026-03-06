import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  authService = inject(AuthService);
  dialogService = inject(ConfirmDialogService);

  async logout() {
    const confirmed = await this.dialogService.confirm(
      'Sair da conta',
      'Tem certeza que deseja sair do CatLife?',
      'Sair',
      'Cancelar'
    );

    if (confirmed) {
      this.authService.logout();
    }
  }
}