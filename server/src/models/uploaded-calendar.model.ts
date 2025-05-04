import { model, Schema, Types } from "mongoose";

interface UploadedCalendarI {
    url: string;
    userId: Types.ObjectId;
}

const uploadedCalendarSchema = new Schema<UploadedCalendarI>({
    url: { 
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

const UploadedCalendar = model<UploadedCalendarI>('UploadedCalendar', uploadedCalendarSchema);

export default UploadedCalendar;
export type { UploadedCalendarI as UploadedCalendarI };