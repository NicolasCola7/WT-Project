import { model, Schema, Types } from "mongoose";

interface ActivityI {
    title: string;
    startDate: Date;
    endDate: Date;
    completed: boolean;
    creatorId: Types.ObjectId;
}

const activitySchema = new Schema<ActivityI>({
    title: {type: String, required: true, trim: true },
    startDate: {type: Date, default: Date.now() },
    endDate: {type: Date, required: true },
    completed: {type: Boolean, default: false, required: true },
    creatorId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
});

const Activity = model<ActivityI>('Activity', activitySchema);

export default Activity;
export type { ActivityI };