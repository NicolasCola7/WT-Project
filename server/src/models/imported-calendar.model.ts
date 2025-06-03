import { model, Schema, Types } from "mongoose";

interface ImportedCalendarI {
    title?: string;
    calendarId: string;
    userId: Types.ObjectId;
}

const importedCalendarSchema = new Schema<ImportedCalendarI>({
    title: {
        type: String, 
        required: false, 
        trim: true
    },
    calendarId: { 
        type: String, 
        required: true,
        lowercase: true, 
        trim: true
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
});

// prevents duplicate calendarId for the same userId
importedCalendarSchema.index({ calendarId: 1, userId: 1 }, { unique: true });

const ImportedCalendar = model<ImportedCalendarI>('ImportedCalendar', importedCalendarSchema);

export default ImportedCalendar;
export type { ImportedCalendarI };