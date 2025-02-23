import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterOutlet, Router } from '@angular/router';

import {DateService} from '@services';

import { ActionBarComponent } from "./components/action-bar/action-bar.component";
import { DatePickerComponent } from "./components/date-picker/date-picker.component";

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

  constructor(
    private router: Router,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.navigateToDate();
  }

  navigateToDate() {
    const calendarRoute = this.dateService.getNavigationRoute(new Date());
    this.router.navigate(calendarRoute);
  }
}
