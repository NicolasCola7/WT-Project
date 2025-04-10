export class CalendarEvent {
    _id?: string
    title?: string;
    startDate?: Date;
    endDate?: Date;
    frequency?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    repetitions?: number | Date;
    location?: string;
    creatorId?: string;
}