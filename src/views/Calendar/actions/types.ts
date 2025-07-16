import type { Except } from "type-fest";

export interface CalendarEvent {
  id: number;
  url: string;
  title: string;
  start: Date | string;
  end: Date | string;
  allDay: boolean;
  extendedProps: Record<string, any>;
}

interface Patient {
  id?: number;
  patientId: string;
  namePatient: string;
  phone: string;
}

export interface Event extends CalendarEvent {
  extendedProps: {
    status: string;
    calendar: string | null;
    createdDate: string;
    userCreated: number;
    description: string;
    timeStart: string | null;
    timeEnd: string | null;
    templateId: number | null;
    template: string | null;
    totalPatients: number;
    totalSending: number;
    totalPending: number;
    totalNot: number;
    istart: string | null;
    iend: string | null;
  };
}

export type NewEvent = Except<Event, "id">;
