import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ExpenseService } from '../../../core/services/expense.service';
import { CatService } from '../../../core/services/cat.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './expense-form.component.html'
})
export class ExpenseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private expenseService = inject(ExpenseService);
  private catService = inject(CatService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  cats = signal<any[]>([]);
  isEditMode = signal<boolean>(false);
  expenseId = signal<number | null>(null);

  expenseForm = this.fb.group({
    catId: ['', Validators.required],
    category: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    date: ['', Validators.required]
  });

  ngOnInit() {
    this.catService.getCats().subscribe((data: any[]) => {
      this.cats.set(data);
      const id = this.route.snapshot.paramMap.get('id');
      
      if (id) {
        this.isEditMode.set(true);
        this.expenseId.set(Number(id));
        this.loadExpenseData(Number(id));
      } else if (data.length > 0) {
        this.expenseForm.patchValue({ catId: data[0].id.toString() });
      }
    });
  }

  loadExpenseData(id: number) {
    this.catService.getCats().subscribe(cats => {
      cats.forEach(cat => {
        this.expenseService.getExpenses(cat.id).subscribe(expenses => {
          const expense = expenses.find(e => e.id === id);
          if (expense) {
            const formattedDate = new Date(expense.date).toISOString().split('T')[0];
            this.expenseForm.patchValue({
              catId: cat.id.toString(),
              category: expense.category,
              amount: expense.amount.toString(),
              date: formattedDate
            });
          }
        });
      });
    });
  }

  async onSubmit() {
    if (this.expenseForm.valid) {
      try {
        const formValue = this.expenseForm.value;
        const expenseDate = new Date(formValue.date as string);
        expenseDate.setHours(12, 0, 0, 0);

        const input = {
          category: formValue.category,
          amount: Number(formValue.amount),
          date: expenseDate.toISOString()
        };

        if (this.isEditMode()) {
          await this.expenseService.updateExpense(this.expenseId()!, input);
          this.toast.show('success', 'Despesa atualizada!');
        } else {
          const createInput = { ...input, catId: Number(formValue.catId) };
          await this.expenseService.addExpense(createInput);
          this.toast.show('success', 'Despesa registrada!');
        }
        
        this.router.navigate(['/expenses']);
      } catch (error: any) {
        this.toast.show('error', 'Erro ao salvar despesa.');
      }
    }
  }
}