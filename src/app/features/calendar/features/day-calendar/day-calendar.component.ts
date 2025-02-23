import { Component, computed, effect, OnInit, Signal, DestroyRef } from '@angular/core';
import { CdkDragEnd, CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { CreateAppointmentModalComponent } from "../../components/create-appointment-modal/create-appointment-modal.component";
import { AppointmentService, DateService } from '@services';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Appointment } from '@models';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

@Component({
  selector: 'app-day-calendar',
  standalone: true,
  imports: [DragDropModule, CreateAppointmentModalComponent, CommonModule, MatIcon, MatIconButton],
  templateUrl: './day-calendar.component.html',
  styleUrls: ['./day-calendar.component.scss']
})
export class DayCalendarComponent implements OnInit {
  readonly hours = Array.from({ length: 24 }, (_, i) => i);
  readonly MINUTES_PER_STEP = 15;
  readonly PIXELS_PER_HOUR = 48;
  readonly PIXELS_PER_MINUTE = this.PIXELS_PER_HOUR / 60;

  selectedDate = new Date();
  dateId: string;
  isVisibleCreateModal = false;
  appointments: Appointment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private dateService: DateService,
    private destroyRef: DestroyRef
  ) {
    this.dateId = this.dateService.getDateId(this.selectedDate);
    
    effect(() => {
      const storage = this.appointmentService.storedAppointments();
      this.appointments = storage[this.dateId] || [];
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => ({
        year: params['year'],
        month: params['month'],
        day: params['day']
      })),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ year, month, day }) => {
      this.selectedDate = new Date(year, month - 1, day);
      this.dateId = this.dateService.formatDateId(year, month, day);
      const storage = this.appointmentService.storedAppointments();
      this.appointments = storage[this.dateId] || [];
    });
  }

  calculateEventStyle(event: CalendarEvent) {
    const startMinutes = this.getMinutesSinceMidnight(event.start);
    const endMinutes = this.getMinutesSinceMidnight(event.end);

    return {
      top: `${startMinutes * this.PIXELS_PER_MINUTE}px`,
      height: `${(endMinutes - startMinutes) * this.PIXELS_PER_MINUTE}px`,
      backgroundColor: event.color
    };
  }

  private getMinutesSinceMidnight(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  }

  private calculateNewStartMinutes(yOffset: number, originalTop: number): number {
    const newTop = originalTop + yOffset;
    return Math.round(newTop / (this.PIXELS_PER_MINUTE * this.MINUTES_PER_STEP))
      * this.MINUTES_PER_STEP;
  }

  private constrainToCalendarBounds(minutes: number): number {
    const maxTop = (24 * 60 - this.MINUTES_PER_STEP) * this.PIXELS_PER_MINUTE;
    return Math.max(0, Math.min(minutes * this.PIXELS_PER_MINUTE, maxTop));
  }

  private getTransformOffset(transform: string): number | null {
    const regex = /translate3d\(0px, ([0-9.-]+)px, 0px\)/;
    const match = regex.exec(transform);
    return match ? parseFloat(match[1]) : null;
  }

  onDragMoved(event: CdkDragMove, calendarEvent: CalendarEvent) {
    const element = event.source.element.nativeElement;
    const yOffset = this.getTransformOffset(element.style.transform);
    
    if (yOffset !== null) {
      const originalTop = parseInt(element.style.top, 10);
      const newStartMinutes = this.calculateNewStartMinutes(yOffset, originalTop);
      const constrainedTop = this.constrainToCalendarBounds(newStartMinutes);
      
      element.style.transform = `translate3d(0px, ${constrainedTop - originalTop}px, 0px)`;
    }
  }

  onDragEnded(event: CdkDragEnd, calendarEvent: CalendarEvent) {
    const element = event.source.element.nativeElement;
    const yOffset = this.getTransformOffset(element.style.transform);
    
    if (yOffset !== null) {
      const originalTop = parseInt(element.style.top, 10);
      const newStartMinutes = this.calculateNewStartMinutes(yOffset, originalTop);
      
      // Update event times
      const duration = calendarEvent.end.getTime() - calendarEvent.start.getTime();
      const newStart = new Date(calendarEvent.start);
      newStart.setHours(Math.floor(newStartMinutes / 60), newStartMinutes % 60, 0);

      calendarEvent.start = newStart;
      calendarEvent.end = new Date(newStart.getTime() + duration);

      this.appointmentService.updateAppointment(calendarEvent, this.dateId);
      
      // Reset transform and update position
      event.source._dragRef.reset();
      element.style.top = `${newStartMinutes * this.PIXELS_PER_MINUTE}px`;
    }
  }

  onHalfHourSlotClick(hour: number, isSecondHalf: boolean) {
    this.selectedDate.setHours(hour, isSecondHalf ? 30 : 0, 0, 0);
    this.isVisibleCreateModal = true;
  }

  closeModal() {
    this.isVisibleCreateModal = false;
  }

  deleteEvent(id: string): void {
    this.appointmentService.deleteAppointment(id, this.dateId);
  }
}
