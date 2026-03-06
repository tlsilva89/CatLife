import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { CatService } from '../../../core/services/cat.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './appointment-list.component.html'
})
export class AppointmentListComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private catService = inject(CatService);
  private confirmDialog = inject(ConfirmDialogService);
  private toast = inject(ToastService);

  cats = signal<any[]>([]);
  selectedCatId = signal<number | null>(null);
  appointments = signal<any[]>([]);

  ngOnInit() {
    this.catService.getCats().subscribe((data: any[]) => {
      this.cats.set(data);
      if (data.length > 0) {
        this.selectedCatId.set(data[0].id);
        this.loadAppointments(data[0].id);
      }
    });
  }

  onCatChange(event: any) {
    const catId = Number(event.target.value);
    this.selectedCatId.set(catId);
    this.loadAppointments(catId);
  }

  loadAppointments(catId: number) {
    this.appointmentService.getAppointments(catId).subscribe((data: any[]) => {
      this.appointments.set(data);
    });
  }

  async onDelete(appt: any) {
    const confirmed = await this.confirmDialog.confirm(
      'Remover Compromisso',
      `Deseja realmente excluir o agendamento "${appt.type}"?`,
      'Excluir',
      'Cancelar'
    );

    if (confirmed) {
      try {
        await this.appointmentService.deleteAppointment(appt.id);
        this.toast.show('success', 'Agendamento removido.');
        this.loadAppointments(this.selectedCatId()!);
      } catch (error) {
        this.toast.show('error', 'Erro ao excluir agendamento.');
      }
    }
  }
}