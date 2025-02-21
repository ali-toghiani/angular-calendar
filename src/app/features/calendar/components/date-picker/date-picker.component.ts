import {Component, effect, model} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { CalendarRoutes } from '@enums';
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

  constructor(private router: Router) {

    effect(() => {
      const date = this.selectedDate();
      if (date) {
        this.onDateSelected(date);
      }
    })
  }

  onDateSelected(date: Date) {
    this.selectedDate.set(date);
    if (date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      this.router.navigate(['/', CalendarRoutes.CALENDAR, CalendarRoutes.DAY, year, month, day]);
    }
  }
}
