import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeMachineService {
  private currentDateSubject = new BehaviorSubject<Date>(new Date());
  currentDate$ = this.currentDateSubject.asObservable();

  setDate(date: Date): void {
    this.currentDateSubject.next(date);
  }

  getCurrentDate(): Date {
    return this.currentDateSubject.value;
  }
}
