import { Routes } from '@angular/router';

import {CalendarRoutes} from '@enums';
import { calendarRoutes } from './features/calendar/calendar-routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: CalendarRoutes.CALENDAR,
  },
  {
    path: CalendarRoutes.CALENDAR,
    children: calendarRoutes
  },
  {
    path: "**",
    redirectTo: CalendarRoutes.CALENDAR
  }
];
