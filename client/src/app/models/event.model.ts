export class CalendarEvent {
    _id?: string
    title?: string;
    startDate?: Date;
    endDate?: Date;
    frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    repetitions?: 'INF' | number | Date;
    partecipants?: Array<string>;
    location?: string;
}