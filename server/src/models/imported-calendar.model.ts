import { model, Schema, Types } from "mongoose";

interface ImportedCalendarI {
    calendarId?: string;
    url?: string;
    userId: Types.ObjectId;
}


const importedCalendarSchema = new Schema<ImportedCalendarI> ({
    calendarId: { type: String, unique: true, required: false, lowercase: true, trim: true },
    url: { type: String, unique: true, required: false, lowercase: false, trim: true },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
});

const ImportedCalendar = model<ImportedCalendarI>('ImportedCalendar', importedCalendarSchema);

export default ImportedCalendar;
export type { ImportedCalendarI };