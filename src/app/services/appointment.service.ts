import { Injectable, signal } from '@angular/core';
import { DateService } from './date.service';
import { Appointment, AppointmentDTO, AppointmentsByDate } from '@models';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  storedAppointments = signal<Record<string, Appointment[]>>({});

  private readonly STORAGE_KEY = 'appointments';

  constructor(private dateService: DateService) {
    this.loadAppointments();
  }

  loadAppointments(): void {
    try {
      const storageData = localStorage.getItem(this.STORAGE_KEY);
      if (!storageData) return;

      const parsedDto = JSON.parse(storageData) as Record<string, AppointmentDTO[]>;
      const mappedDto = this.mapStorageToAppointments(parsedDto);
      this.storedAppointments.set(mappedDto);
    } catch (error) {
      // Behold Error Handling of the highest orda 
      console.error('Error loading appointments', error);

      // optional: clear local storage,
      this.storedAppointments.set({});
    }
  }

  storeAppointment(appointment: Appointment): void {
    try {
      const dayId = this.dateService.getDateId(appointment.start);
      if (!dayId) return;

      const storedItems = { ...this.storedAppointments() };
      const targetDayAppointments = storedItems[dayId];

      if (targetDayAppointments) {
        if (this.isAppointmentDuplicate(appointment, targetDayAppointments)) {
          // If event is duplicate, ignore it
          return;
        }
        // If day has appointments, add new appointment to the day
        storedItems[dayId] = [...targetDayAppointments, appointment];
      } else {
        // If day has no appointments, create a new day with the appointment
        storedItems[dayId] = [appointment];
      }

      this.saveToLocalStorage(storedItems);

    } catch (error) {
      console.error('Error in storeAppointment:', error);
    }
  }

  deleteAppointment(id: string, dateId: string): void {
    this.updateStoredItems(
      dateId,
      items => items.filter(item => item.id !== id)
    );
  }

  updateAppointment(appointment: Appointment, dateId: string): void {
    this.updateStoredItems(
      dateId,
      items => items.map(item => 
        item.id === appointment.id ? appointment : item
      )
    );
  }

  private saveToLocalStorage(data: Record<string, Appointment[]>): void {
    try {
      const mappedStorage = this.mapAppointmentsToStorage(data);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mappedStorage, null, 2));
      this.loadAppointments();
    } catch (error) {
      // TODO: Implement proper error handling with LogService
      console.error('Error saving appointments', error);
    }
  }

  // Dates must be formatted to ISO strings (to preveserve timezone) before storing in local storage
  private mapStorageToAppointments(
    data: Record<string, AppointmentDTO[]>
  ): Record<string, Appointment[]> {
    return Object.fromEntries(
      Object.entries(data).map(([key, arrayOfObjects]) => [
        key,
        arrayOfObjects.map((item) => (
          {
            ...item,
            start: new Date(item.start),
            end: new Date(item.end),
          }
        )),
      ])
    );
  }

  private mapAppointmentsToStorage(
    data: Record<string, Appointment[]>
  ): Record<string, AppointmentDTO[]> {
    return Object.fromEntries(
      Object.entries(data).map(([key, arrayOfObjects]) => [
        key,
        arrayOfObjects.map((item) => (
          {
            ...item,
            start: item.start.toISOString(),
            end: item.end.toISOString(),
          }
        )),
      ])
    );
  }

  private updateStoredItems(
    dateId: string, 
    updateFn: (items: Appointment[]) => Appointment[]
  ): void {
    const storedItems = this.storedAppointments();
    const targetDayAppointments = storedItems[dateId];
    
    if (targetDayAppointments) {
      storedItems[dateId] = updateFn(targetDayAppointments);
      this.saveToLocalStorage(storedItems);
    }
  }

  // this checks if the appointment is a duplicate of an existing appointment in the day
  private isAppointmentDuplicate(appointment: Appointment, current: Appointment[]): boolean {
    return current.some(item => 
      item.start.getTime() === appointment.start.getTime() && 
      item.end.getTime() === appointment.end.getTime()
    );
  }
}

