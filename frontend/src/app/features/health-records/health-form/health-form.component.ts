import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HealthRecordService } from '../../../core/services/health-record.service';
import { CatService } from '../../../core/services/cat.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-health-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './health-form.component.html'
})
export class HealthFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private healthService = inject(HealthRecordService);
  private catService = inject(CatService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  cats = signal<any[]>([]);
  isEditMode = signal<boolean>(false);
  recordId = signal<number | null>(null);

  healthForm = this.fb.group({
    catId: ['', Validators.required],
    type: ['', Validators.required],
    date: ['', Validators.required],
    nextDueDate: ['']
  });

  ngOnInit() {
    this.catService.getCats().subscribe((data: any[]) => {
      this.cats.set(data);
      const id = this.route.snapshot.paramMap.get('id');
      
      if (id) {
        this.isEditMode.set(true);
        this.recordId.set(Number(id));
        this.loadRecordData(Number(id));
      } else if (data.length > 0) {
        this.healthForm.patchValue({ catId: data[0].id.toString() });
      }
    });
  }

  loadRecordData(id: number) {
    this.catService.getCats().subscribe(cats => {
      cats.forEach(cat => {
        this.healthService.getRecords(cat.id).subscribe(records => {
          const record = records.find(r => r.id === id);
          if (record) {
            this.healthForm.patchValue({
              catId: cat.id.toString(),
              type: record.type,
              date: new Date(record.date).toISOString().split('T')[0],
              nextDueDate: record.nextDueDate ? new Date(record.nextDueDate).toISOString().split('T')[0] : ''
            });
          }
        });
      });
    });
  }

  async onSubmit() {
    if (this.healthForm.valid) {
      try {
        const formValue = this.healthForm.value;
        
        const date = new Date(formValue.date as string);
        date.setHours(12, 0, 0, 0);

        let nextDueDate = null;
        if (formValue.nextDueDate) {
          const nextDate = new Date(formValue.nextDueDate as string);
          nextDate.setHours(12, 0, 0, 0);
          nextDueDate = nextDate.toISOString();
        }

        const input = {
          type: formValue.type,
          date: date.toISOString(),
          nextDueDate: nextDueDate
        };

        if (this.isEditMode()) {
          await this.healthService.updateRecord(this.recordId()!, input);
          this.toast.show('success', 'Registro atualizado!');
        } else {
          const createInput = { ...input, catId: Number(formValue.catId) };
          await this.healthService.addRecord(createInput);
          this.toast.show('success', 'Registro de saúde salvo!');
        }
        
        this.router.navigate(['/cats']);
      } catch (error: any) {
        this.toast.show('error', 'Erro ao salvar registro.');
      }
    }
  }
}