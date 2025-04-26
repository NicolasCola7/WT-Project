import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeMachineService {
  private currentDateSubject: BehaviorSubject<Date>;
  private timerSubscription!: Subscription;

  constructor() {
    const savedDateString = localStorage.getItem('time-machine-date');
    const savedTimestampString = localStorage.getItem('time-machine-timestamp');

    let initialDate: Date;

    if (savedDateString && savedTimestampString) {
      const savedDate = new Date(savedDateString);
      const savedTimestamp = Number(savedTimestampString);
      const now = Date.now();
      const elapsedMilliseconds = now - savedTimestamp;
      initialDate = new Date(savedDate.getTime() + elapsedMilliseconds);
    } else {
      initialDate = new Date();
    }

    this.currentDateSubject = new BehaviorSubject<Date>(initialDate);
    this.startClock();
  }

  get currentDate$() {
    return this.currentDateSubject.asObservable();
  }

  private startClock(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = interval(1000).subscribe(() => {
      const newDate = new Date(this.currentDateSubject.value.getTime() + 1000);
      this.currentDateSubject.next(newDate);
      this.saveState(newDate);
    });
  }

  private saveState(date: Date): void {
    localStorage.setItem('time-machine-date', date.toISOString());
    localStorage.setItem('time-machine-timestamp', Date.now().toString());
  }

  setDate(date: Date): void {
    this.currentDateSubject.next(date);
    this.saveState(date);
    this.startClock(); // Ricomincia il timer da questo momento
  }

  goBack(): void {
    const newDate = new Date(this.currentDateSubject.value.getTime() - 3600000);
    this.setDate(newDate);
  }

  goForward(): void {
    const newDate = new Date(this.currentDateSubject.value.getTime() + 3600000);
    this.setDate(newDate);
  }

  updateDateOnly(date: Date): void {
    const current = this.currentDateSubject.value;
    const updated = new Date(date.getFullYear(), date.getMonth(), date.getDate(), current.getHours(), current.getMinutes(), current.getSeconds());
    this.setDate(updated);
  }

  updateTimeOnly(hours: number, minutes: number): void {
    const current = this.currentDateSubject.value;
    const updated = new Date(current.getFullYear(), current.getMonth(), current.getDate(), hours, minutes, current.getSeconds());
    this.setDate(updated);
  }

  resetToNow(): void {
    this.setDate(new Date());
  }
}
