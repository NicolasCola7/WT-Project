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
        unique: true,
        lowercase: true, 
        trim: true
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
});

const ImportedCalendar = model<ImportedCalendarI>('ImportedCalendar', importedCalendarSchema);

export default ImportedCalendar;
export type { ImportedCalendarI };