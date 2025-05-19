import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeMachineService {
  //la variabile appena dichiarata contiene la data corrente
  private currentDateSubject: BehaviorSubject<Date>;
  //Subscription al timer che aggiorna il tempo ogni secondo
  private timerSubscription!: Subscription;

  constructor() {
    //recupera la data e il timestamp precedentemente salvati nel localStorage
    const savedDateString = localStorage.getItem('time-machine-date');
    const savedTimestampString = localStorage.getItem('time-machine-timestamp');

    let initialDate: Date;

    //se presenti, calcola la nuova data sommando il tempo trascorso al salvataggio altrimenti riparte dalla data attuale
    if (savedDateString && savedTimestampString) {
      const savedDate = new Date(savedDateString);
      const savedTimestamp = Number(savedTimestampString);
      const now = Date.now();
      const elapsedMilliseconds = now - savedTimestamp;
      initialDate = new Date(savedDate.getTime() + elapsedMilliseconds);
    } else {
      initialDate = new Date();
    }

    //inizializza la variabile "currentDateSubject" con la data appena calcolata
    this.currentDateSubject = new BehaviorSubject<Date>(initialDate);
    //parte il "clock" che aggiorna la data ogni secondo
    this.startClock();
  }

  get currentDate$() {
    return this.currentDateSubject.asObservable();
  }

  //metodo che fa partire o riavvia l'intervallo che aggiorna la data ogni secondo
  private startClock(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    //incremento la data di un secondo e salvo la nuova data e il timestamp
    this.timerSubscription = interval(1000).subscribe(() => {
      const newDate = new Date(this.currentDateSubject.value.getTime() + 1000);
      this.currentDateSubject.next(newDate);
      this.saveState(newDate);
    });
  }

  //metodo per salvare la data corrente e il timestamp nel localStorage
  private saveState(date: Date): void {
    localStorage.setItem('time-machine-date', date.toISOString());
    localStorage.setItem('time-machine-timestamp', Date.now().toString());
  }

  //metodo per impostare una nuova data e riavvia il clock da quella data e ora
  setDate(date: Date): void {
    this.currentDateSubject.next(date);
    this.saveState(date);
    this.startClock();
  }

  //metodo per spostare la data indietro di un'ora
  goBack(): void {
    const newDate = new Date(this.currentDateSubject.value.getTime() - 3600000);
    this.setDate(newDate);
  }

  //metodo per spostare la data avanti di un'ora.
  goForward(): void {
    const newDate = new Date(this.currentDateSubject.value.getTime() + 3600000);
    this.setDate(newDate);
  }

  //metodo per aggiornare solo la data mantenendo lo stesso orario
  updateDateOnly(date: Date): void {
    const current = this.currentDateSubject.value;
    const updated = new Date(date.getFullYear(), date.getMonth(), date.getDate(), current.getHours(), current.getMinutes(), current.getSeconds());
    this.setDate(updated);
  }

  //metodo per aggiornare solo l'orario mantenendo la data attuale
  updateTimeOnly(hours: number, minutes: number): void {
    const current = this.currentDateSubject.value;
    const updated = new Date(current.getFullYear(), current.getMonth(), current.getDate(), hours, minutes, current.getSeconds());
    this.setDate(updated);
  }

  //metodo per resettare la data all'orario corrente del sistema
  resetToNow(): void {
    this.setDate(new Date());
  }
}