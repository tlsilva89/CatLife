import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatService } from '../../../core/services/cat.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cat-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cat-list.component.html'
})
export class CatListComponent implements OnInit {
  private catService = inject(CatService);
  private confirmDialog = inject(ConfirmDialogService);
  private toast = inject(ToastService);
  
  cats = signal<any[]>([]);

  ngOnInit() {
    this.loadCats();
  }

  loadCats() {
    this.catService.getCats().subscribe((data: any[]) => {
      this.cats.set(data);
    });
  }

  async onDelete(cat: any) {
    const confirmed = await this.confirmDialog.confirm(
      'Remover Gatinho',
      `Tem certeza que deseja remover o(a) ${cat.name}? Todos os dados de saúde e despesas também serão excluídos.`,
      'Excluir',
      'Cancelar'
    );

    if (confirmed) {
      try {
        await this.catService.deleteCat(cat.id);
        this.toast.show('success', `${cat.name} foi removido(a) com sucesso.`);
        this.loadCats();
      } catch (error) {
        this.toast.show('error', 'Erro ao excluir gatinho.');
      }
    }
  }
}