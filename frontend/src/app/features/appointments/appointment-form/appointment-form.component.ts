import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { CatService } from '../../../core/services/cat.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './appointment-form.component.html'
})
export class AppointmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private catService = inject(CatService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  cats = signal<any[]>([]);
  isEditMode = signal<boolean>(false);
  appointmentId = signal<number | null>(null);

  appointmentForm = this.fb.group({
    catId: ['', Validators.required],
    type: ['', Validators.required],
    dateTime: ['', Validators.required],
    location: ['']
  });

  ngOnInit() {
    this.catService.getCats().subscribe((data: any[]) => {
      this.cats.set(data);
      const id = this.route.snapshot.paramMap.get('id');
      
      if (id) {
        this.isEditMode.set(true);
        this.appointmentId.set(Number(id));
        this.loadAppointmentData(Number(id));
      } else if (data.length > 0) {
        this.appointmentForm.patchValue({ catId: data[0].id.toString() });
      }
    });
  }

  loadAppointmentData(id: number) {
    this.catService.getCats().subscribe(cats => {
      cats.forEach(cat => {
        this.appointmentService.getAppointments(cat.id).subscribe(appts => {
          const appt = appts.find(a => a.id === id);
          if (appt) {
            const date = new Date(appt.dateTime);
            const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16);

            this.appointmentForm.patchValue({
              catId: cat.id.toString(),
              type: appt.type,
              dateTime: formattedDate,
              location: appt.location
            });
          }
        });
      });
    });
  }

  async onSubmit() {
    if (this.appointmentForm.valid) {
      try {
        const formValue = this.appointmentForm.value;
        const input = {
          type: formValue.type,
          dateTime: new Date(formValue.dateTime as string).toISOString(),
          location: formValue.location
        };

        if (this.isEditMode()) {
          await this.appointmentService.updateAppointment(this.appointmentId()!, input);
          this.toast.show('success', 'Agenda atualizada com sucesso!');
        } else {
          const createInput = { ...input, catId: Number(formValue.catId) };
          await this.appointmentService.addAppointment(createInput);
          this.toast.show('success', 'Compromisso agendado com sucesso!');
        }
        
        this.router.navigate(['/appointments']);
      } catch (error: any) {
        this.toast.show('error', 'Erro ao salvar compromisso.');
      }
    }
  }
}