import { Component, OnInit } from '@angular/core';
import { ActionBarComponent } from "./components/action-bar/action-bar.component";
import { DatePickerComponent } from "./components/date-picker/date-picker.component";
import { CommonModule } from "@angular/common";
import { RouterOutlet, Router } from '@angular/router';
import { CalendarRoutes } from '@enums';
@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    RouterOutlet,
    ActionBarComponent,
    DatePickerComponent
    ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    this.navigateToDate(year, month, day);
  }

  navigateToDate(year: number, month: number, day: number) {
    this.router.navigate(['/' , CalendarRoutes.CALENDAR, CalendarRoutes.DAY, year, month, day]);
  }
}
