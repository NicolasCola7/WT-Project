import { model, Schema, Types } from "mongoose";

interface UploadedCalendarI {
    title?: string;
    url: string;
    userId: Types.ObjectId;
}

const uploadedCalendarSchema = new Schema<UploadedCalendarI>({
    title: {
        type: String, 
        required: false, 
        trim: true
    },
    url: { 
        type: String, 
        required: true,
        unique: true,
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