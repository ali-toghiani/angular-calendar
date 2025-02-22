import { Component, computed, effect, OnInit, Signal } from '@angular/core';
import { CdkDragEnd, CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { CreateAppointmentModalComponent } from "../../components/create-appointment-modal/create-appointment-modal.component";
import { AppointmentService } from '@services';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DateService } from '@services';
import {Appointment} from '@models';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

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
  hours = Array.from({ length: 24 }, (_, i) => i);
  readonly MINUTES_PER_STEP = 15;
  readonly PIXELS_PER_HOUR = 48;
  readonly PIXELS_PER_MINUTE = this.PIXELS_PER_HOUR / 60;

  selectedDate = new Date();
  dateId: string;
  isVisibleCreateModal = false;


  appointments: Appointment[] = [
    {
      id: "d68u4ii0aluxhanrvna7o",
      title: "(No Title)",
      start: new Date("2025-02-22T13:55:24.768Z"),
      end: new Date("2025-02-22T14:55:24.768Z")
    }
  ];

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private dateService: DateService
  ) {
    effect(() => {
      const storage = this.appointmentService.storedAppointments()
      this.appointments = storage[this.dateId]
    })
    this.dateId = this.dateService.getDateId(this.selectedDate);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      const year = params['year'];
      const month = params['month'] ;
      const day = params['day'];
      this.selectedDate = new Date(year, month - 1, day);
      this.dateId = this.dateService.formatDateId(year,month,day);
    });
  }

  calculateEventStyle(event: CalendarEvent) {
    const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
    const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();

    return {
      top: `${startMinutes * this.PIXELS_PER_MINUTE}px`,
      height: `${(endMinutes - startMinutes) * this.PIXELS_PER_MINUTE}px`,
      backgroundColor: event.color
    };
  }

  onDragMoved(event: CdkDragMove, calendarEvent: CalendarEvent) {
    const element = event.source.element.nativeElement;
    const transform = element.style.transform;
    const regex = /translate3d\(0px, ([0-9.-]+)px, 0px\)/;
    const match = regex.exec(transform);

    if (match) {
      const yOffset = parseFloat(match[1]);
      const originalTop = parseInt(element.style.top, 10);
      const newTop = originalTop + yOffset;

      // Snap to 15-minute intervals
      const snapToMinutes = Math.round(newTop / (this.PIXELS_PER_MINUTE * this.MINUTES_PER_STEP))
        * this.MINUTES_PER_STEP;

      // Constrain to calendar bounds (0:00 to 23:45)
      const maxTop = (24 * 60 - this.MINUTES_PER_STEP) * this.PIXELS_PER_MINUTE;
      const constrainedTop = Math.max(0, Math.min(snapToMinutes * this.PIXELS_PER_MINUTE, maxTop));

      element.style.transform = `translate3d(0px, ${constrainedTop - originalTop}px, 0px)`;
    }
  }

  onDragEnded(event: CdkDragEnd, calendarEvent: CalendarEvent) {
    const element = event.source.element.nativeElement;
    const transform = element.style.transform;
    const regex = /translate3d\(0px, ([0-9.-]+)px, 0px\)/;
    const match = regex.exec(transform);

    if (match) {
      const yOffset = parseFloat(match[1]);
      const originalTop = parseInt(element.style.top, 10);
      const newTop = originalTop + yOffset;

      // Convert pixels to minutes (snapped to 15-minute intervals)
      const newStartMinutes = Math.round(newTop / (this.PIXELS_PER_MINUTE * this.MINUTES_PER_STEP))
        * this.MINUTES_PER_STEP;

      // Update event times
      const duration = calendarEvent.end.getTime() - calendarEvent.start.getTime();
      const newStart = new Date(calendarEvent.start);
      newStart.setHours(Math.floor(newStartMinutes / 60), newStartMinutes % 60, 0);

      calendarEvent.start = newStart;
      calendarEvent.end = new Date(newStart.getTime() + duration);

      // Reset the transform
      event.source._dragRef.reset();

      // Update the element position
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
    this.appointmentService.deleteAppointment(id, this.dateId)
  }
}
