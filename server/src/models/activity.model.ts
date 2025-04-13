import { model, Schema, Types } from "mongoose";

interface ActivityI {
    title: string;
    dueDate: Date;
    completed: boolean;
    creatorId: Types.ObjectId;
    description?: string; 
}

const activitySchema = new Schema<ActivityI>({
    title: {type: String, required: true, trim: true },
    dueDate: {type: Date, required: true },
    completed: {type: Boolean, default: false, required: true },
    creatorId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    description: { type: String, required: false, trim: true }
});

const Activity = model<ActivityI>('Activity', activitySchema);

export default Activity;
export type { ActivityI };