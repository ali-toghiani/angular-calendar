import { Component, model, OnInit } from '@angular/core';
import { MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DateService } from '@services';
import { CalendarRoutes } from '@enums';

@Component({
  selector: 'app-action-bar',
  imports: [
      MatIconModule,
      MatButtonModule,
      CommonModule
    ],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss'
})
export class ActionBarComponent implements OnInit{

  date = model<Date | null>(null);

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private dateService: DateService
  ) {
    this.matIconRegistry.addSvgIcon(
      'calendar',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/google-calendar.svg')
    );
  }

  ngOnInit(): void {
    this.route.firstChild?.params.subscribe(params => {
      this.date.set(new Date(+params['year'], +params['month'] - 1, +params['day']));
    });
  }

  goToPreviousDay() {
    const previousDay = this.dateService.getPreviousDay(this.date());
    this.router.navigate(['/', CalendarRoutes.CALENDAR, CalendarRoutes.DAY, previousDay.getFullYear(), (previousDay.getMonth() + 1), previousDay.getDate()]);
  }

  goToToday() {
    const today = new Date();
    this.router.navigate(['/', CalendarRoutes.CALENDAR, CalendarRoutes.DAY, today.getFullYear(), today.getMonth() + 1, today.getDate()]);
  }

  goToNextDay() {
    const nextDay = this.dateService.getNextDay(this.date());
    this.router.navigate(['/', CalendarRoutes.CALENDAR, CalendarRoutes.DAY, nextDay.getFullYear(), (nextDay.getMonth() +1), nextDay.getDate()]);
  }
}
