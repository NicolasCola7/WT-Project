import { model, Schema, Types } from "mongoose";

export const frequencies = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

interface CalendarEventI {
    title: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    repetitions?:  number | Date;
    location?: string;
    creatorId: Types.ObjectId;
}

const calendarEventSchema = new Schema<CalendarEventI>({
    title: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    allDay: { type: Boolean, required: true},
    frequency: { 
        type: String, 
        required: false, 
        enum: frequencies 
    },
    repetitions: { 
        type: Schema.Types.Mixed, 
        required: false
    },
    creatorId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    location: { type: String, required: false, trim: true }
});

const Event = model<CalendarEventI>('Event', calendarEventSchema);

export default Event;
export type { CalendarEventI };