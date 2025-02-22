import { Injectable, signal } from '@angular/core';
import { DateService } from './date.service';
import { Appointment, AppointmentDTO, AppointmentsByDate } from '@models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  storedAppointments = signal<Record<string, Appointment[]>>({});

  private readonly STORAGE_KEY = 'appointments';

  constructor(
    private dateService: DateService
  ) {
    this.loadAppointments();
  }

  loadAppointments(): void {
    const storageData = localStorage.getItem(this.STORAGE_KEY);
    if (!storageData) {return}
    const parsedDto = JSON.parse(storageData) as { string: AppointmentDTO[]};
    const mappedDto = this.mapStorageToAppointments(parsedDto);
    this.storedAppointments.set(mappedDto);
  }

  mapStorageToAppointments(storage: Record<string, AppointmentDTO[]>): Record<string, Appointment[]>{
    return Object.fromEntries(
      Object.entries(storage).map(([key, arrayOfObjects]) => [
        key,
        arrayOfObjects.map(item => {
          return {
            ...item,
            start: new Date(item.start),
            end: new Date(item.end)
          };
        })
      ])
    );
  }

  mapAppointmentsToStorage(data: Record<string, Appointment[]>): Record<string, AppointmentDTO[]>{
    return Object.fromEntries(
      Object.entries(data).map(([key, arrayOfObjects]) => [
        key,
        arrayOfObjects.map(item => {
          return {
            ...item,
            start: item.start.toISOString(),
            end: item.end.toISOString()
          };
        })
      ])
    );
  }

  storeAppointment(appointment: Appointment): void {
    const dayId = this.dateService.getDateId(appointment.start);
    const storedItems = this.storedAppointments()
    if (!dayId) return;
    const targetDayAppointments = this.storedAppointments()[dayId];
    if (targetDayAppointments) {
      if (this.isAppointmentDuplicate(appointment, targetDayAppointments)) {
        return;
      }
      storedItems[dayId].push(appointment);
    } else {
      storedItems[dayId] = [appointment];
    }
    const mappedStorage = this.mapAppointmentsToStorage(storedItems);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mappedStorage, null, 2));
    this.loadAppointments();
  }

  private isAppointmentDuplicate(appointment: Appointment, current: Appointment[]): boolean {
    return current.findIndex( (item:Appointment) => item.start.getTime() === appointment.start.getTime() && item.end.getTime() === appointment.end.getTime()) !== -1;
  }

  deleteAppointment(id: string, dateId: string): void {
    const storedItems = this.storedAppointments()
    const targetDayAppointments = this.storedAppointments()[dateId];
    if (targetDayAppointments) {
      storedItems[dateId] = storedItems[dateId].filter( item => item.id !== id)
    }
    const mappedStorage = this.mapAppointmentsToStorage(storedItems);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mappedStorage, null, 2));
    this.loadAppointments();
  }

  updateAppointment(appointment: Appointment, dateId: string): void {
    const storedItems = this.storedAppointments()
    const targetDayAppointments = this.storedAppointments()[dateId];
    if (targetDayAppointments) {
      storedItems[dateId] = storedItems[dateId].map( item => item.id == appointment.id ? appointment : item);
    }
    const mappedStorage = this.mapAppointmentsToStorage(storedItems);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mappedStorage, null, 2));
    this.loadAppointments();
  }
}
