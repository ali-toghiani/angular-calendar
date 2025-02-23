import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';

import { DateService } from '@services';

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

  date = signal<Date | null>(null);

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
    this.router.navigate(this.dateService.getPreviousDayRoute(this.date()!));
  }

  goToToday() {
    this.router.navigate(this.dateService.getTodayNavigationRoute());
  }

  goToNextDay() {
    this.router.navigate(this.dateService.getNextDayRoute(this.date()!));
  }
}
