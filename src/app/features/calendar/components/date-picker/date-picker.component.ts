import { Component, effect, model } from '@angular/core';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { DateService } from '@services';

@Component({
  selector: 'app-date-picker',
  imports: [
    MatCardModule,
    MatDatepickerModule
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  selectedDate = model<Date | null>(null);

  constructor(
    private router: Router,
    private dateService: DateService
  ) {

    effect(() => {
      this.onDateChange(this.selectedDate());
    })
  }

  onDateChange(date: Date | null): void {
    if (!date) return;
    const route = this.dateService.getNavigationRoute(date);
    this.router.navigate(route);
  }
}
