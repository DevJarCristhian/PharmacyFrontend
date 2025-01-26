import type { Except } from 'type-fest'

export interface CalendarEvent {
    id: number
    url: string
    title: string
    start: Date | string
    end: Date | string
    allDay: boolean
    extendedProps: Record<string, any>
}

interface guest {
    id?: number,
    name: string,
    dni: string,
    type: number
    userId: number,
}

export interface Event extends CalendarEvent {
    extendedProps: {
        state: boolean
        calendar?: string
        categoryId: number | null
        place: string
        createdDate: string
        userCreated: number
        description: string
        guests: guest[]
    }
}

export type NewEvent = Except<Event, 'id'>