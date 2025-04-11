import { Component , signal, ChangeDetectorRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventApi, DateSelectArg, Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import itLocale from '@fullcalendar/core/locales/it';
import rrulePlugin from '@fullcalendar/rrule';
import { DialogModule } from '@angular/cdk/dialog';
import { AlertService } from '../../services/alert.service';
import { CreateEventDialogComponent } from '../create-event-dialog/create-event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CreateActivityDialogComponent } from '../create-activity-dialog/create-activity-dialog.component';
import { CalendarEvent } from '../../models/event.model';
import { CalendarService } from '../../services/calendar.service';
import { AuthService } from '../../services/auth.service';
import { LoadingComponent } from '../../common/loading/loading.component';
import { Activity } from '../../models/activity.model';
import { EventDetailsDialogComponent } from '../event-details-dialog/event-details-dialog.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    FullCalendarModule,
    DialogModule,
    CommonModule,
    LoadingComponent,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true
})
export class CalendarComponent implements OnInit {
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent
  isLoading = true;
  selectedDate = new Date();
  calendarVisible = signal(true);
  events: CalendarEvent[] = [];
  activities: Activity[] = [];
  completedActivities: Activity[] = [];
  overdueActivities: Activity[] = [];
  currentEvents = signal<EventApi[]>([]);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      rrulePlugin
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: false,
    selectMirror: false,
    dayMaxEvents: true,
    nowIndicator: true,
    locales: [ itLocale ],
    locale: 'it',
    //select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
  });

  constructor(private changeDetector: ChangeDetectorRef,
              private alertService: AlertService,
              private dialog: MatDialog,
              private calendarService: CalendarService,
              private authService: AuthService){}

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchActivities();
  }

  // Carica attività ed eventi nel calendario
  private loadCalendar(): void {
    const calendarEvents = this.convertEvents();
    const calendarActivities = [...this.convertActivities(this.activities), ...this.convertActivities(this.overdueActivities)];
    const allCalendarEvents = [...calendarEvents, ...calendarActivities]; 

    this.calendarOptions.set({
      ...this.calendarOptions(),
      events: allCalendarEvents,
    });
  }

  private convertEvents() {
    const converted = this.events.map(event => {
      const rrule: any = {};  //creazione oggetto rrule per gestire ripetizione
      
      if(event.frequency !== 'NONE'){
        rrule.freq = event.frequency;
        rrule.dtstart = new Date(event.startDate!).toISOString();
      }
      if (event.repetitions) {
        if(typeof event.repetitions === 'string') {
          rrule.until = new Date(event.repetitions).toISOString(); 
        } else {
          rrule.count = event.repetitions;
        }
      }

      //serve per gli eventi ricorrenti (altrimenti non visualizza orario fine nel calendario)
      const startTime = new Date(event.startDate!).getTime();
      const endTime = new Date(event.endDate!).getTime();
      const durationInMs = endTime - startTime;

      return{
        id: event._id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        place: event.location, 
        rrule: Object.keys(rrule).length ? rrule : undefined,
        duration: durationInMs > 0 ? { milliseconds: durationInMs } : undefined,
        allDay: event.startDate == event.endDate,
        backgroundColor: '#4c95e4'
      }
    });

    return converted;
  }

  private convertActivities(activities: Activity[]) {
    const converted = activities.map(activity => ({
      id: activity._id,
      title: activity.title,
      start: this.isOverdue(activity.endDate!) ? new Date(Date.now()) : activity.endDate!, 
      allDay: true,
      backgroundColor: this.getActivityStatus(activity), 
      borderColor: 'transparent',
      classNames: ['activity']
    }));

    return converted;
  }

  private getActivityStatus(activity: Activity) {
    
    if (activity.completed)
      return '#4c9621';
    
    if(this.isOverdue(activity.endDate!))
      return '#d82839';
    
    return '#FFBB33';
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleEventClick(clickInfo: EventClickArg) {
    const eventData = clickInfo.event;
    if(!eventData.classNames.length) {
      const dialogRef = this.dialog.open(EventDetailsDialogComponent, {
        width: '80vw',
        data: eventData,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'delete') {
          this.alertService.showQuestion(
            `Sei sicuro di voler eliminare l'evento '${eventData.title}'`,
            () => this.deleteEvent(eventData)
          );
        }
        if(result === 'edit') {
          this.editEvent(eventData);
        }
      });
    }
  }

  newActivity(){
    const dialogRef = this.dialog.open(CreateActivityDialogComponent, {
      width: '400vw',
      height: 'auto',
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if (result) {
          const newActivity: Activity = {
            title: result.title,
            endDate: result.endDate,
            creatorId: result.creatorId
          };
  
          this.calendarService.addActivity(newActivity).subscribe({
            next: () => this.fetchActivities(),
            error: error => console.log(error)
          });
        }
      });
    }

  newEvent(){
    const dialogRef = this.dialog.open(CreateEventDialogComponent, {
      width: '400vw',
      height: 'auto',
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      
    if (result) {
        const newEvent: CalendarEvent = {
          title: result.title,
          startDate: result.startDate,
          endDate: result.endDate,
          location: result.location,
          frequency: result.frequency,
          repetitions: result.repetitions,
          creatorId: result.creatorId
        };

        this.calendarService.addEvent(newEvent).subscribe({
          next: () => this.fetchEvents(),
          error: error => console.log(error)
        });
      }
    });
  }

  fetchEvents() {
    this.calendarService.getMyEvents(this.authService.currentUser).subscribe({
      next: (data) => {
        this.events = data;
        this.loadCalendar();
      },
      error: error => console.log(error),
      complete: () => this.isLoading = false
    });
  }

  fetchActivities() {
    this.activities = [];
    this.completedActivities = [];
    this.overdueActivities = [];
    
    this.calendarService.getMyActivities(this.authService.currentUser).subscribe({
      next: (data) => {
        this.activities = data;
        this.getOverdueActivities();
        this.getCompletedActivities();
        this.loadCalendar();
      },
      error: error => console.log(error),
      complete: () => this.isLoading = false
    });
  }

  private getOverdueActivities() {
    for (let i = this.activities.length - 1; i >= 0; i--) {
      if (!this.activities[i].completed && this.isOverdue(this.activities[i].endDate!)) {
        this.overdueActivities.unshift(this.activities.splice(i, 1)[0]);
      }
    }
  }

  private getCompletedActivities() {
    for (let i = this.activities.length - 1; i >= 0; i--) {
      if (this.activities[i].completed) {
        this.completedActivities.unshift(this.activities.splice(i, 1)[0]);
      }
    }
  }

  changeActivityStatus(activity: Activity) {
    activity.completed = !activity.completed;

    this.calendarService.changeActivityStatus(activity).subscribe({
      next: () => this.fetchActivities(),
      error: (error) => console.log(error),
      complete: () => this.isLoading = false
    });
  }

  private isOverdue(date: Date) {
    const endDate = new Date(date).getTime();

    return endDate < Date.now();
  }

  deleteActivity(activity: Activity) {
    this.alertService.showQuestion(
      `Sei sicuro di voler eliminare l'attività '${activity.title}'`,
      () => this.calendarService.deleteActivity(activity._id!).subscribe({
        next: () => this.fetchActivities(),
        error: (error) => console.log(error)
      })
    );
  } 

  private deleteEvent(event: EventApi) {
    this.calendarService.deleteEvent(event.id!).subscribe({
      next: () => this.fetchEvents(),
      error: (error) => console.log(error)
    });
  }

  editEvent(event: EventApi) {
    const dialogRef = this.dialog.open(CreateEventDialogComponent, {
      width: '400vw',
      height: 'auto',
      data: event 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedEvent: CalendarEvent = {
          _id: event.id,
          title: result.title,
          startDate: result.startDate,
          endDate: result.endDate,
          location: result.location,
          frequency: result.frequency,
          repetitions: result.repetitions,
          creatorId: result.creatorId
        };

        this.calendarService.updateEvent(updatedEvent).subscribe({
          next: () => this.fetchEvents(),
          error: error => console.log(error)
        });
      }
    });
  }
}
