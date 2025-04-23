import { Component , signal, ChangeDetectorRef, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { CollapsibleListComponent } from "../../common/collapsible-list/collapsible-list.component";
import {MatListModule} from '@angular/material/list';
import { ActivityDetailsDialogComponent } from '../activity-details-dialog/activity-details-dialog.component';
import { TimeMachineService } from '../../services/time-machine.service';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    FullCalendarModule,
    DialogModule,
    CommonModule,
    LoadingComponent,
    MatCheckboxModule,
    MatIconModule,
    CollapsibleListComponent,
    MatListModule
],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;
  sidebarOpen: boolean = false;
  isLoading = true;
  selectedDate!: Date;
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
    //considero la data della time-machine
    now: () => this.timeMachineService.getCurrentDate(),
    nowIndicator: true,
    locales: [ itLocale ],
    locale: 'it',
    eventClick: this.handleEventClick.bind(this),
  });

  constructor(private alertService: AlertService,
              private dialog: MatDialog,
              private calendarService: CalendarService,
              private authService: AuthService,
              private timeMachineService: TimeMachineService){}

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchActivities();
  }
              
  private loadCalendar(): void {
    this.isLoading = true;
    const calendarEvents = this.convertEvents();
    const calendarActivities = [
      ...this.convertActivities(this.activities),
      ...this.convertActivities(this.overdueActivities)
    ];
    const allCalendarEvents = [...calendarEvents, ...calendarActivities]; 

    this.calendarOptions.set({
      ...this.calendarOptions(),
      events: allCalendarEvents,
    });
  }

  private convertEvents() {
    const converted = this.events.map(event => {
      const rrule: any = {};
      
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
        backgroundColor: '#4c95e4',
        frequency: Object.keys(rrule).length ? rrule.freq : 'NONE',
        repetitions: Object.keys(rrule).length ? (rrule.count ? rrule.count : rrule.until) : undefined
      }
    });

    return converted;
  }

  private convertActivities(activities: Activity[]) {
    const converted = activities.map(activity => ({
      id: activity._id,
      title: activity.title,
      start: this.isOverdue(activity.dueDate!) ? new Date(this.timeMachineService.getCurrentDate()) : activity.dueDate!,
      allDay: true,
      backgroundColor: this.getActivityStatus(activity), 
      completed: activity.completed,
      description: activity.description,
      isActivity: true,
      creatorId: activity.creatorId,
      borderColor: this.getActivityStatus(activity)
    }));

    return converted;
  }

  private getActivityStatus(activity: Activity) {
    
    if (activity.completed)
      return '#4c9621';
    
    if(this.isOverdue(activity.dueDate!))
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
    if(!eventData.extendedProps['isActivity']) {
      const event: CalendarEvent = {
        _id: eventData.id,
        title: eventData.title,
        startDate: eventData.start!,
        endDate: eventData.end!,
        location: eventData.extendedProps['place'],
        frequency: eventData.extendedProps['frequency'],
        repetitions: eventData.extendedProps['repetitions'],
        creatorId: eventData.extendedProps['creatorId']
      }
      this.viewEventDetails(event);
    } else {
      const activity: Activity = {
        _id: eventData.id,
        title: eventData.title,
        dueDate: eventData.start!,
        completed: eventData.extendedProps['completed'],
        description: eventData.extendedProps['description'],
        creatorId: eventData.extendedProps['creatorId']
      };
      this.viewActivityDetails(activity);
    }
  }

  viewEventDetails(event: CalendarEvent) {
    const dialogRef = this.dialog.open(EventDetailsDialogComponent, {
      width: '80vw',
      data: event,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.alertService.showQuestion(
          `Sei sicuro di voler eliminare l'evento '${event.title}'`,
          () => this.deleteEvent(event)
        );
      }
      if(result === 'edit') {
        this.editEvent(event);
      }
    });
  }

  viewActivityDetails(activity: Activity) {
    const dialogRef = this.dialog.open(ActivityDetailsDialogComponent, {
      width: '80vw',
      data: activity,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteActivity(activity._id!, activity.title!);
      }

      if(result === 'edit') {
        this.editActivity(activity);
      }
    });
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
            dueDate: result.dueDate,
            creatorId: result.creatorId,
            description: result.description
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
      if (!this.activities[i].completed && this.isOverdue(this.activities[i].dueDate!)) {
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

    this.calendarService.updateActivity(activity).subscribe({
      next: () => this.fetchActivities(),
      error: (error) => console.log(error),
      complete: () => this.isLoading = false
    });
  }

  private isOverdue(date: Date) {
    const endDate = new Date(date).getTime();

    return endDate < this.timeMachineService.getCurrentDate().getTime();
  }

  deleteActivity(id: string, title: string) {
    this.alertService.showQuestion(
      `Sei sicuro di voler eliminare l'attività '${title}'`,
      () => this.calendarService.deleteActivity(id).subscribe({
        next: () => this.fetchActivities(),
        error: (error) => console.log(error)
      })
    );
  } 

  private deleteEvent(event: CalendarEvent) {
    this.calendarService.deleteEvent(event._id!).subscribe({
      next: () => this.fetchEvents(),
      error: (error) => console.log(error)
    });
  }

  editEvent(event: CalendarEvent) {
    const dialogRef = this.dialog.open(CreateEventDialogComponent, {
      width: '400vw',
      height: 'auto',
      data: event
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedEvent: CalendarEvent = {
          _id: event._id,
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

  editActivity(activity: Activity) {
    const dialogRef = this.dialog.open(CreateActivityDialogComponent, {
      width: '400vw',
      height: 'auto',
      data: activity 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedActivity: Activity = {
          _id: activity._id,
          title: result.title,
          dueDate: result.dueDate,
          description: result.description,
          creatorId: result.creatorId
        };

        this.calendarService.updateActivity(updatedActivity).subscribe({
          next: () => this.fetchActivities(),
          error: error => console.log(error)
        });
      }
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
