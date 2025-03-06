export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
}

export interface AppointmentDTO {
  id: string;
  title: string;
  description?: string;
  start: string; 
  end: string;
  color?: string;
}

export interface AppointmentsByDate {
  [date: string]: AppointmentDTO[];
}
