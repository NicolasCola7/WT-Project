export class Activity {
    _id?: string;
    title?: string;
    startDate?: Date;
    endDate?: Date;
    partecipants?: Array<string>;
    completed?: boolean;
    overdue?: boolean;
}