import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardItem } from '../models/dashboard-item.model';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  //mappa stringa-promise in cui ad ogni stringa è associato un componente da caricare differente
  private componentMap: { [key: string]: () => Promise<any> } = {
    'calendar': () => import("../preview-components/calendar-preview/calendar-preview.component").then(m => m.CalendarPreviewComponent),
    'timer': () => import("../components/page-timer/page-timer.component").then(m => m.PageTimerComponent),
    'note': () => import("../components/note-home/note-home.component").then(m => m.NoteHomeComponent),
    'assistant': () => import("../preview-components/ai-assistant-preview/ai-assistant-preview.component").then(m => m.AiAssistantPreviewComponent),
    'time-machine': () => import("../components/time-machine/time-machine.component").then(m => m.TimeMachineComponent),
  };

  constructor(private http: HttpClient) { }

  getLayout(userId: string): Observable<DashboardItem[]> {
    return this.http.get<DashboardItem[]>(`/api/users/${userId}/layout`).pipe(
      map(layout => {
        // Se l'array è vuoto, usa il layout di default
        if (!layout || layout.length === 0) {
          return this.getDefaultLayout();
        }

        // Mappa il layout normalmente se non è vuoto
        return layout.map(item => ({
          ...item,
          componentType: this.componentMap[item.relativeUrl] || undefined
        }));
      }),
      catchError(error => {
        console.error('Errore nel caricamento layout:', error);
        return of(this.getDefaultLayout()); // fallback in caso di errore HTTP
      })
    );
  }

  //metodo che aggiorna il layout della dashboard
  saveLayout(userId: string, layout: DashboardItem[]): Observable<void> {
    return this.http.put<void>('/api/users/layout', { userId, layout });
  }

  //layout di default della dashboard
  getDefaultLayout(): DashboardItem[] {
    return [
      {
        cols: 0, rows: 0, y: 0, x: 0, name: 'Home', relativeUrl: 'home', urlImg: "home.png",
        isTimeMachine: false, isVisible: false,
        componentType: this.componentMap['home'],
        data: { title: 'Prima Preview', description: 'Descrizione della prima preview' }
      },
      {
        cols: 1, rows: 1, y: 0, x: 0, name: 'Calendario', relativeUrl: 'calendar', urlImg: "calendar.png",
        isTimeMachine: false, isVisible: true,
        componentType: this.componentMap['calendar'],
        data: { title: 'Prima Preview', description: 'Descrizione della prima preview' }
      },
      {
        cols: 1, rows: 1, y: 0, x: 1, name: 'Timer', relativeUrl: 'timer', urlImg: "timer.png",
        isTimeMachine: false, isVisible: true,
        componentType: this.componentMap['timer'],
        data: { title: 'Prima Preview', description: 'Descrizione della prima preview' }
      },
      {
        cols: 1, rows: 1, y: 1, x: 0, name: 'Note', relativeUrl: 'note', urlImg: "note.png",
        isTimeMachine: false, isVisible: true,
        componentType: this.componentMap['note'],
        data: { title: 'Preview Note', description: 'Mostra le note recenti', isPreviewMode: true }
      },
      {
        cols: 1, rows: 1, y: 1, x: 1, name: 'Assistente AI', relativeUrl: 'assistant', urlImg: "chatbot.png",
        isTimeMachine: false, isVisible: true,
        componentType: this.componentMap['assistant'],
        data: { title: 'Prima Preview', description: 'Descrizione della prima preview' }
      },
      {
        cols: 0, rows: 0, y: 0, x: 0, name: 'Time Machine', relativeUrl: 'time-machine', urlImg: "time-machine.png",
        isTimeMachine: true, isVisible: false,
        componentType: this.componentMap['time-machine'],
        data: { title: 'Time-machine preview', description: 'Descrizione time machine preview' }
      }
    ];
  }
}
