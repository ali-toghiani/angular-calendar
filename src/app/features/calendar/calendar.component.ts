import { Component } from '@angular/core';
import { ActionBarComponent } from "./components/action-bar/action-bar.component";
import { DatePickerComponent } from "./components/date-picker/date-picker.component";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from '@angular/router';
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
export class CalendarComponent {

}
