import mongoose, { Document } from 'mongoose';

export interface SettingsI extends Document {
  userId: string;
  work: number;
  break: number;
  cicle: number;
}

const SettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  work: Number,
  break: Number,
  cicle: Number
});

export default mongoose.model<SettingsI>('settings-pomodoro', SettingsSchema);
