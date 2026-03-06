import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CatService } from '../../../core/services/cat.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cat-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cat-form.component.html'
})
export class CatFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private catService = inject(CatService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  isEditMode = signal<boolean>(false);
  catId = signal<number | null>(null);

  catForm = this.fb.group({
    name: ['', Validators.required],
    breed: [''],
    color: [''],
    birthDate: ['', Validators.required],
    isCastrated: [false]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.catId.set(Number(id));
      this.loadCatData(Number(id));
    }
  }

  loadCatData(id: number) {
    this.catService.getCats().subscribe(cats => {
      const cat = cats.find(c => c.id === id);
      if (cat) {
        const formattedDate = new Date(cat.birthDate).toISOString().split('T')[0];
        this.catForm.patchValue({
          name: cat.name,
          breed: cat.breed,
          color: cat.color,
          birthDate: formattedDate,
          isCastrated: cat.isCastrated
        });
      }
    });
  }

  async onSubmit() {
    if (this.catForm.valid) {
      try {
        const formValue = this.catForm.value;
        const birthDate = new Date(formValue.birthDate as string);
        birthDate.setHours(12, 0, 0, 0);

        const input = {
          name: formValue.name,
          breed: formValue.breed,
          color: formValue.color,
          birthDate: birthDate.toISOString(),
          isCastrated: formValue.isCastrated
        };

        if (this.isEditMode()) {
          await this.catService.updateCat(this.catId()!, input);
          this.toast.show('success', 'Perfil atualizado com sucesso!');
        } else {
          await this.catService.createCat(input);
          this.toast.show('success', 'Gatinho cadastrado com sucesso!');
        }
        
        this.router.navigate(['/cats']);
      } catch (error: any) {
        this.toast.show('error', 'Erro ao salvar dados do gatinho.');
      }
    }
  }
}