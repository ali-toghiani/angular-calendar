import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Appointment } from '@models';

export function timeSlotConflictValidator(existingAppointments: Appointment[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('start')?.value;
    const end = control.get('end')?.value;

    if (!start || !end) {
      return null;
    }

    const hasConflict = existingAppointments.some(appointment => {
      const appointmentStart = appointment.start;
      const appointmentEnd = appointment.end;

      const isOverlapping = (
        (start >= appointmentStart && start < appointmentEnd) ||
        (end > appointmentStart && end <= appointmentEnd) ||
        (start <= appointmentStart && end >= appointmentEnd)
      );

      return isOverlapping;
    });

    return hasConflict ? { timeSlotConflict: true } : null;
  };
}