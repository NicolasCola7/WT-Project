import { model, Schema, Types } from "mongoose";

interface ImportedCalendarI {
    calendarId: string;
    userId: Types.ObjectId;
}


const importedCalendarSchema = new Schema<ImportedCalendarI> ({
    calendarId: { type: String, unique: true, required: true, lowercase: true, trim: true },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
});

const ImportedCalendar = model<ImportedCalendarI>('ImportedCalendar', importedCalendarSchema);

export default ImportedCalendar;
export type { ImportedCalendarI };