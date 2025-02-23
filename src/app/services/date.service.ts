import { Injectable } from '@angular/core';

import { CalendarRoutes } from '@enums';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getPreviousDay(date?: Date | null): Date {
    if (!date) {
      date = new Date();
    }
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    return previousDay;
  }

  getNextDay(date?: Date | null): Date {
    if (!date) {
      date = new Date();
    }
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }

  // Format Date to "yyyy-mm-dd"
  getDateId(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateId(year: string, month: string, day: string): string {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  getNavigationRoute(date: Date): (string|number)[] {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return ['/', CalendarRoutes.CALENDAR, CalendarRoutes.DAY, year, month, day];
  }

  getTodayNavigationRoute(): (string|number)[] {
    return this.getNavigationRoute(new Date());
  }

  getPreviousDayRoute(date: Date): (string|number)[] {
    return this.getNavigationRoute(this.getPreviousDay(date));
  }

  getNextDayRoute(date: Date): (string|number)[] {
    return this.getNavigationRoute(this.getNextDay(date));
  }
}
