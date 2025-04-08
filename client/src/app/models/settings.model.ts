export const SETTINGS_KEY = 'SETTINGS';
export type TimerMode = 'work' | 'break';

export interface Settings {
  work: number;
  break: number;
}
