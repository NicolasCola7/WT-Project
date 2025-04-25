import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeMachineService {
  private currentDateSubject!: BehaviorSubject<Date>;
  currentDate$ = this.currentDateSubject?.asObservable();

  constructor() {
    const savedDate = localStorage.getItem('time-machine-date');
    const initialDate = savedDate ? new Date(savedDate) : new Date();
    this.currentDateSubject = new BehaviorSubject<Date>(initialDate);
    this.startClock();
  }

  private startClock(): void {
    setInterval(() => {
      const newDate = new Date(this.currentDateSubject.value.getTime() + 1000);
      this.currentDateSubject.next(newDate);
      localStorage.setItem('time-machine-date', newDate.toISOString());
    }, 1000);
  }

  setDate(date: Date): void {
    this.currentDateSubject.next(date);
    localStorage.setItem('time-machine-date', date.toISOString());
  }

  getCurrentDate(): Date {
    return this.currentDateSubject.value;
  }
}
