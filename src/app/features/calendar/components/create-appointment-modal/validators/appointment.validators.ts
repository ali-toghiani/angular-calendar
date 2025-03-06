import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Appointment } from '@models';

export function timeSlotConflictValidator(existingAppointments: Appointment[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('start')?.value;
    const end = control.get('end')?.value;

    if (!start || !end) {
      return null;
    }

    if (end <= start) {
      return { invalidTimeRange: true };
    }

    // Check for overlaps with existing appointments
    const hasConflict = existingAppointments.some(existing => {
      // Convert everything to minutes since midnight for easier comparison
      const newStart = start.getHours() * 60 + start.getMinutes();
      const newEnd = end.getHours() * 60 + end.getMinutes();
      const existingStart = existing.start.getHours() * 60 + existing.start.getMinutes();
      const existingEnd = existing.end.getHours() * 60 + existing.end.getMinutes();

      // Check all possible overlap scenarios
      const startsInExisting = newStart >= existingStart && newStart < existingEnd;
      const endsInExisting = newEnd > existingStart && newEnd <= existingEnd;
      const encompassesExisting = newStart <= existingStart && newEnd >= existingEnd;

      return startsInExisting || endsInExisting || encompassesExisting;
    });

    return hasConflict ? { timeSlotConflict: true } : null;
  };
}