import { Component, OnInit, signal } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { TimeMachineService } from '../../services/time-machine.service';
import { CalendarEvent } from '../../models/event.model';
import { Activity } from '../../models/activity.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calendar-preview',
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './calendar-preview.component.html',
  styleUrl: './calendar-preview.component.css'
})
export class CalendarPreviewComponent implements OnInit{

  currentDate = signal(new Date());
  todayEvents = signal<CalendarEvent[]> ([]);
  todayActivities = signal<Activity[]>([]);
  viewEvents: boolean = true;

  constructor(
    private calendarService: CalendarService,
    private timeMachineService: TimeMachineService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.timeMachineService.currentDate$.subscribe(date => {
      this.currentDate.set(date);
    });

    this.fetchTodayEvents();
    this.fetchTodoActivities();

  }

  toggle(viewEvents: boolean) {
    this.viewEvents = viewEvents;
  }

  fetchTodayEvents () {
    this.calendarService.getTodayEvents(this.authService.currentUser, this.currentDate()).subscribe({
      next: (events) => this.todayEvents.set(events),
      error: (error) => console.log(error)
    });
  }

  fetchTodoActivities() {
    this.calendarService.getTodoActivities(this.authService.currentUser).subscribe({
      next: (activities) => this.todayActivities.set(activities),
      error: (error) => console.log(error)
    });
  }

  isOverdue(date: Date) {
    return new Date(date) < this.currentDate();
  }

  convertDate(date: Date) {
    return  new Date(date).toLocaleDateString('it-IT', { 
      hour12: false, 
      hour: '2-digit',
      minute: '2-digit'
     });
  }

  formatEventScheduling(event: CalendarEvent): string {
    const startDate = new Date(event.startDate!);
    const endDate = new Date(event.endDate!);

    if(event.allDay) {
      return  `Tutto il giorno`;
    } else {
      if (startDate.getDate() == this.currentDate().getDate()) {
        if (endDate.getDate() > this.currentDate().getDate()) {
          return `${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${this.convertDate(endDate)}`;
        } else {
           return `${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
      } else {
        return `${this.convertDate(startDate)} - ${this.convertDate(endDate)}`;
      }
    }
  }
}
