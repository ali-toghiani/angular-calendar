import {AfterViewInit, Component, effect, inject, input, Input, OnInit, output, TemplateRef, ViewChild} from '@angular/core';
import {Dialog, DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AppointmentService } from 'app/services/appointment.service';
import { Appointment } from '@models';
@Component({
  selector: 'app-create-appointment-modal',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-appointment-modal.component.html',
  styleUrl: './create-appointment-modal.component.scss'
})
export class CreateAppointmentModalComponent implements AfterViewInit{
  selectedDate = input<Date>(new Date());
  closeModal = output<void>();
  @ViewChild('Dialog') dialogRef: TemplateRef<unknown> | undefined;

  readonly DEFAULT_TITLE = '(No Title)';
  dialog = inject(Dialog);

  appointmentForm = new FormGroup({
    title: new FormControl<string>('', {validators: []}),
    start: new FormControl<Date>(this.selectedDate(), {validators: [Validators.required]}),
    end: new FormControl<Date>(this.getEndTime(), {validators: [Validators.required]}),
    description: new FormControl<string>('', {validators: []}),
  })

  constructor(private appointmentService: AppointmentService) {
    effect(() => {
      this.appointmentForm.controls.start.setValue(this.selectedDate());
      this.appointmentForm.controls.end.setValue(this.getEndTime());
    });
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  getEndTime(): Date {
    const end = new Date(this.selectedDate());
    end.setHours(end.getHours() + 1);
    return end;
  }

  openDialog(): void {
    if (this.dialogRef === undefined) return;
    const dialogRef = this.dialog.open<string>(this.dialogRef, {
      width: '450px',
      height: '400px',
      panelClass: 'appointment-dialog',
      data: {name: 'this.name'},
    });

    dialogRef.closed.subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
    this.closeModal.emit();
  }

  submitForm(): void {
    const {value} = this.appointmentForm;
    const appointment: Appointment = {
      id: this.generateId(),
      title: value.title || this.DEFAULT_TITLE,
      start: value.start || new Date(),
      end: value.end || new Date(),
    }

    try {
      this.appointmentService.storeAppointment(appointment);
      this.closeDialog();
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
