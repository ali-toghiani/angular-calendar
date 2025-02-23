import { Component, effect, Input, Output, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppointmentService } from '@services';
import { Appointment } from '@models';

type AppointmentFormControls = {
  title: FormControl<string>;
  start: FormControl<Date>;
  end: FormControl<Date>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-create-appointment-modal',
  standalone: true,
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
export class CreateAppointmentModalComponent {
  @Input() selectedDate: Date = new Date();
  @Output() closeModalEvent = new EventEmitter<void>();

  @ViewChild('Dialog') dialogRef!: TemplateRef<unknown>;
  
  private readonly DEFAULT_TITLE = '(No Title)';
  private readonly DIALOG_CONFIG = {
    width: '450px',
    height: '400px',
    panelClass: 'appointment-dialog'
  };
  
  private dialogInstance?: DialogRef;

  appointmentForm = new FormGroup<AppointmentFormControls>({
    title: new FormControl('', { nonNullable: true }),
    start: new FormControl(this.selectedDate, {
      validators: [Validators.required],
      nonNullable: true
    }),
    end: new FormControl(this.getEndTime(), {
      validators: [Validators.required],
      nonNullable: true
    }),
    description: new FormControl('', { nonNullable: true })
  });

  constructor(
    private dialog: Dialog,
    private appointmentService: AppointmentService
  ) {
    effect(() => {
      this.updateFormDates();
    });
  }

  private updateFormDates(): void {
    this.appointmentForm.patchValue({
      start: this.selectedDate,
      end: this.getEndTime()
    });
  }

  private getEndTime(): Date {
    const end = new Date(this.selectedDate);
    end.setHours(end.getHours() + 1);
    return end;
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  openDialog(): void {
    if (!this.dialogRef) return;

    this.dialogInstance = this.dialog.open(this.dialogRef, {
      ...this.DIALOG_CONFIG
    });

    this.dialogInstance.closed.subscribe(() => {
      this.handleDialogClose();
    });
  }

  private handleDialogClose(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.appointmentForm.reset({
      title: '',
      start: this.selectedDate,
      end: this.getEndTime(),
      description: ''
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
    this.closeModalEvent.emit();
  }

  submitForm(): void {
    if (this.appointmentForm.invalid) {
      this.markFormTouched();
      return;
    }

    try {
      const appointment = this.createAppointmentFromForm();
      this.appointmentService.storeAppointment(appointment);
      this.closeDialog();
    } catch (error) {
      console.error('Error submitting appointment form:', error);
    }
  }

  private markFormTouched(): void {
    Object.values(this.appointmentForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private createAppointmentFromForm(): Appointment {
    const formValue = this.appointmentForm.getRawValue();
    return {
      id: this.generateId(),
      title: formValue.title || this.DEFAULT_TITLE,
      start: formValue.start,
      end: formValue.end,
      description: formValue.description
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}
