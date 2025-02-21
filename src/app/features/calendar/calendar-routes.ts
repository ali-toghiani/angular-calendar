import { Routes } from '@angular/router';

import { CalendarRoutes } from '@enums';

import { DayCalendarComponent } from './features/day-calendar/day-calendar.component';

export const calendarRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./calendar.component').then(c => c.CalendarComponent),
    children: [
      { path: '', redirectTo: CalendarRoutes.DAY, pathMatch: 'full' },
      { 
        path: `${CalendarRoutes.DAY}/:year/:month/:day`,
        component: DayCalendarComponent 
      },
      { path: "**", redirectTo: CalendarRoutes.DAY }
    ]
  }
];