import { model, Schema, Types } from "mongoose";

interface ActivityI {
    title: string;
    startDate: Date;
    endDate: Date;
    completed: boolean;
    overdue: boolean;
}

const activitySchema = new Schema<ActivityI>({
    title: {type: String, required: true, trim: true },
    startDate: {type: Date, default: Date.now },
    endDate: {type: Date, required: true },
    completed: {type: Boolean, default: false, required: true },
    overdue: {type: Boolean, default: false, required: true }
});

const Activity = model<ActivityI>('Activity', activitySchema);

export default Activity;
export type { ActivityI };