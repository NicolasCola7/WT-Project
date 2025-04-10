export const SETTINGS_KEY = 'SETTINGS';
export type TimerMode = 'Focus' | 'Riposo';

export interface Settings {
  work: number;
  break: number;
  cicle: number;
}
