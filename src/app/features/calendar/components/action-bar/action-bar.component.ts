import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, filter } from 'rxjs';

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
export class ActionBarComponent implements OnInit, OnDestroy {

  date = signal<Date | null>(null);
  private routerSubscription: Subscription | undefined;

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
    // Subscribe to router events
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Handle route change - update your component based on new route
      this.handleRouteChange();
    });
    
    // Initial load
    this.handleRouteChange();
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private handleRouteChange(): void {
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
