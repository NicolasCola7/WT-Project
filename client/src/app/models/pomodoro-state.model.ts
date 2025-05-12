export const POMODORO_STATE_KEY = 'pomodoroState';
export interface PomodoroState {
  remainingTime: number;
  sessionType: string;
  timestamp: number;
  cicles: boolean[];
  isCounting: boolean;
  isSessionActive: boolean;
}