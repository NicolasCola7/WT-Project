import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TimeMachineService {
  private currentDateSubject = new BehaviorSubject<Date>(new Date());
  private timerSubscription!: Subscription;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.initialize(this.authService.currentUser._id!);
  }

  get currentDate$() {
    return this.currentDateSubject.asObservable();
  }

  //metodo che richiama l'api get e fa partire la time-machine
  private initialize(userId: string): void {
    this.http.get<{ isRealTime: boolean, selectedDateTime: string, timestamp: string }>(`/api/users/${userId}/time-machine`).subscribe({
      next: (response) => {
        let simulatedNow: Date;
        // Orario attuale di sistema
        if (response.isRealTime) {
          simulatedNow = new Date(); 
        } else {
          //simulo il tempo passato da quando è stato chiuso il componente con il vecchio orario
          const selectedDate = new Date(response.selectedDateTime);
          const lastTimestamp = new Date(response.timestamp).getTime();
          const elapsed = Date.now() - lastTimestamp;
          simulatedNow = new Date(selectedDate.getTime() + elapsed);
        }

        this.currentDateSubject.next(simulatedNow);
        this.startClock();
      },
      error: () => {
        this.currentDateSubject.next(new Date());
        this.startClock();
      }
    });
  }

  //metodo che fa partire un nuovo orologio
  private startClock(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      const newDate = new Date(this.currentDateSubject.value.getTime() + 1000);
      this.currentDateSubject.next(newDate);
    });
  }

  //metodo che salva lo stato della time-machine sul db
  private saveState(date: Date, isRealTime: boolean): void {
    const payload = {
      isRealTime: isRealTime, 
      selectedDateTime: date.toISOString()
    };

    this.http.put(`/api/users/${this.authService.currentUser._id}/time-machine`, payload).subscribe({
      error: (err) => console.error('Errore nel salvataggio della time-machine:', err)
    });
  }

  //metodo per impostare una nuova data e riavvia il clock da quella data e ora
  setDate(date: Date, isRealTime: boolean): void {
    this.currentDateSubject.next(date);
    this.saveState(date, isRealTime);
    this.startClock();
  }

  //metodo per spostare la data indietro di un'ora
  goBack(): void {
    const newDate = new Date(this.currentDateSubject.value.getTime() - 3600000);
    this.setDate(newDate, false);
  }

  //metodo per spostare la data avanti di un'ora.
  goForward(): void {
    const newDate = new Date(this.currentDateSubject.value.getTime() + 3600000);
    this.setDate(newDate, false);
  }

  //metodo per aggiornare solo la data mantenendo lo stesso orario
  updateDateOnly(date: Date): void {
    const current = this.currentDateSubject.value;
    const updated = new Date(date.getFullYear(), date.getMonth(), date.getDate(), current.getHours(), current.getMinutes(), current.getSeconds());
    this.setDate(updated, false);
  }

  //metodo per aggiornare solo l'orario mantenendo la data attuale
  updateTimeOnly(hours: number, minutes: number): void {
    const current = this.currentDateSubject.value;
    const updated = new Date(current.getFullYear(), current.getMonth(), current.getDate(), hours, minutes, current.getSeconds());
    this.setDate(updated, false);
  }

  //metodo per resettare la data all'orario corrente del sistema
  resetToNow(): void {
    this.setDate(new Date(), true);
  }
}