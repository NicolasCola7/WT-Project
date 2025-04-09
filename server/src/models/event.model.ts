import { model, Schema, Types } from "mongoose";

export const frequencies = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

interface CalendarEventI {
    title: string;
    startDate: Date;
    endDate: Date;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    repetitions?: 'INF' | number | Date;
    location?: string;
    creatorId: Types.ObjectId;
}

const calendarEventSchema = new Schema<CalendarEventI>({
    title: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    frequency: { 
        type: String, 
        required: false, 
        enum: frequencies 
    },
    repetitions: { 
        type: Schema.Types.Mixed, 
        required: false,
        validate: {
            validator: function(v: any) {
                return v === 'INF' || typeof v === 'number' || v instanceof Date;
            },
            message: props => `${props.value} is not a valid repetition value!`
        }
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