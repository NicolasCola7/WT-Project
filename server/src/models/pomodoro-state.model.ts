import mongoose, { Document } from 'mongoose';

export interface PomodoroStateI extends Document {
  userId: string;
  remainingTime: number;
  sessionType: string;
  timestamp: number;
  cicles: boolean[];
  isCounting: boolean;
  isSessionActive: boolean;
}

const PomodoroStateSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  remainingTime: Number,
  sessionType: String,
  timestamp: Number,
  cicles: [Boolean],
  isCounting: Boolean,
  isSessionActive: Boolean
});

export default mongoose.model<PomodoroStateI>('pomodoro-state', PomodoroStateSchema);
