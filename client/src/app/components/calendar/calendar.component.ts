import { Component , signal, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';
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


@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    FullCalendarModule,
    DialogModule,
    CommonModule,
    LoadingComponent,
    MatCheckboxModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true
})
export class CalendarComponent implements OnInit{
  isLoading = true;
  selectedDate = new Date();
  calendarVisible = signal(true);
  events: CalendarEvent[] = [];
  activities: Activity[] = [];
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
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locales: [ itLocale ],
    locale: 'it',
    //select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
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
    const calendarActivities = this.convertActivities();
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
        //ogni event di events diventa compatibile con FullCalendar
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        place: event.location, 
        rrule: Object.keys(rrule).length ? rrule : undefined,
        duration: durationInMs > 0 ? { milliseconds: durationInMs } : undefined,
        allDay: event.startDate == event.endDate 
      }
    });

    return converted;
  }

  private convertActivities() {
    const converted = this.activities.map(activity => ({
      title: activity.title,
      start: activity.startDate, 
      end: activity.endDate,
      backgroundColor: this.getActivityStatus(activity), 
    }));

    return converted;
  }

  private getActivityStatus(activity: Activity) {
    
    if (activity.completed)
      return '#4c9621';
    
    if(activity.overdue)
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

  /*
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  } */

  handleEventClick(clickInfo: EventClickArg) {
    this.alertService.showQuestion(
      `Sei sicuro di voler eliminare l'evento '${clickInfo.event.title}'`,
      () => clickInfo.event.remove()
    );
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
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
    this.calendarService.getMyActivities(this.authService.currentUser).subscribe({
      next: (data) => {
        this.activities = data;
        this.loadCalendar();
      },
      error: error => console.log(error),
      complete: () => this.isLoading = false
    });
  }

  changeActivityStatus(activity: Activity) {
  }
}
