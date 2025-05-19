import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PomodoroState } from '../models/pomodoro-state.model';
import { Settings, TimerMode } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  private baseUrl = 'http://localhost:4200';

  constructor(private http: HttpClient) {}

  // -------- POMODORO STATE --------
  getPomodoroState(userId: string): Observable<PomodoroState> {
    return this.http.get<PomodoroState>(`${this.baseUrl}/pomodoro/user/${userId}`);
  }

  saveOrUpdatePomodoroState(state: PomodoroState): Observable<PomodoroState> {
    return this.http.post<PomodoroState>(`${this.baseUrl}/pomodoro/user`, state);
  }

  // -------- SETTINGS --------
  getSettings(userId: string): Observable<Settings> {
    return this.http.get<Settings>(`${this.baseUrl}/settings/user/${userId}`);
  }

  saveOrUpdateSettings(settings: Settings): Observable<Settings> {
    return this.http.post<Settings>(`${this.baseUrl}/settings/user`, settings);
  }
}