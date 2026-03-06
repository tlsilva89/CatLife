import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HealthRecordService } from '../../../core/services/health-record.service';
import { CatService } from '../../../core/services/cat.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-health-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './health-list.component.html'
})
export class HealthListComponent implements OnInit {
  private healthService = inject(HealthRecordService);
  private catService = inject(CatService);
  private confirmDialog = inject(ConfirmDialogService);
  private toast = inject(ToastService);

  cats = signal<any[]>([]);
  selectedCatId = signal<number | null>(null);
  records = signal<any[]>([]);

  ngOnInit() {
    this.catService.getCats().subscribe((data: any[]) => {
      this.cats.set(data);
      if (data.length > 0) {
        this.selectedCatId.set(data[0].id);
        this.loadRecords(data[0].id);
      }
    });
  }

  onCatChange(event: any) {
    const catId = Number(event.target.value);
    this.selectedCatId.set(catId);
    this.loadRecords(catId);
  }

  loadRecords(catId: number) {
    this.healthService.getRecords(catId).subscribe((data: any[]) => {
      this.records.set(data);
    });
  }

  async onDelete(record: any) {
    const confirmed = await this.confirmDialog.confirm(
      'Remover Registro',
      `Deseja realmente excluir o registro de "${record.type}"?`,
      'Excluir',
      'Cancelar'
    );

    if (confirmed) {
      try {
        await this.healthService.deleteRecord(record.id);
        this.toast.show('success', 'Registro removido com sucesso.');
        this.loadRecords(this.selectedCatId()!);
      } catch (error) {
        this.toast.show('error', 'Erro ao excluir registro.');
      }
    }
  }
}