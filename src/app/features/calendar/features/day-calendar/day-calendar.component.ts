import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-day-calendar',
  standalone: true,
  templateUrl: './day-calendar.component.html',
  styleUrls: ['./day-calendar.component.scss']
})
export class DayCalendarComponent implements OnInit {
  hours = Array.from({ length: 24 }, (_, i) => i);
  
  ngOnInit() {
    this.updateCurrentTimeIndicator();
  }

  private updateCurrentTimeIndicator() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const top = (minutes / 60) * 48; // 48px per hour
    
    // Add current time indicator to DOM
    const indicator = document.createElement('div');
    indicator.className = 'current-time-indicator';
    indicator.style.top = `${top}px`;
    
    const grid = document.querySelector('.events-grid');
    grid?.appendChild(indicator);
  }
}