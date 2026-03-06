import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../core/services/expense.service';
import { CatService } from '../../../core/services/cat.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private catService = inject(CatService);
  private confirmDialog = inject(ConfirmDialogService);
  private toast = inject(ToastService);

  cats = signal<any[]>([]);
  selectedCatId = signal<number | null>(null);
  expenses = signal<any[]>([]);

  totalExpenses = computed(() => {
    return this.expenses().reduce((acc, curr) => acc + Number(curr.amount), 0);
  });

  ngOnInit() {
    this.catService.getCats().subscribe((data: any[]) => {
      this.cats.set(data);
      if (data.length > 0) {
        this.selectedCatId.set(data[0].id);
        this.loadExpenses(data[0].id);
      }
    });
  }

  onCatChange(event: any) {
    const catId = Number(event.target.value);
    this.selectedCatId.set(catId);
    this.loadExpenses(catId);
  }

  loadExpenses(catId: number) {
    this.expenseService.getExpenses(catId).subscribe((data: any[]) => {
      this.expenses.set(data);
    });
  }

  async onDelete(expense: any) {
    const confirmed = await this.confirmDialog.confirm(
      'Remover Despesa',
      `Deseja realmente excluir o registro de "${expense.category}"?`,
      'Excluir',
      'Cancelar'
    );

    if (confirmed) {
      try {
        await this.expenseService.deleteExpense(expense.id);
        this.toast.show('success', 'Despesa removida com sucesso.');
        this.loadExpenses(this.selectedCatId()!);
      } catch (error) {
        this.toast.show('error', 'Erro ao excluir despesa.');
      }
    }
  }
}