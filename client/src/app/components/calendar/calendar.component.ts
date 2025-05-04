import { Component , signal, ChangeDetectorRef, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
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
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { computed, effect } from '@angular/core';
import { ImportCalendarDialogComponent } from '../import-calendar-dialog/import-calendar-dialog.component';
import ImportedCalendar from '../../models/imported-calendar.model';
import iCalendarPlugin from '@fullcalendar/icalendar'
import UploadedCalendar from '../../models/uploaded-calendar.model';

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
  timeMachineService = inject(TimeMachineService);
  importedCalendars: ImportedCalendar[] = [];
  uploadedCalendars: UploadedCalendar[] = [];
  showDropdown = false;
  sidebarOpen: boolean = false;
  isLoading = true;
  selectedDate!: Date;
  calendarVisible = signal(true);
  events: CalendarEvent[] = [];
  activities: Activity[] = [];
  completedActivities: Activity[] = [];
  overdueActivities: Activity[] = [];
  currentEvents = signal<EventApi[]>([]);

  // 👇 Creo un signal locale per la currentDate
  currentDate = signal(new Date());

  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      rrulePlugin,
      googleCalendarPlugin,
      iCalendarPlugin
    ],
    googleCalendarApiKey: 'AIzaSyDT7orYSSUNvhYXdYo2jDQYVNNOF12ChXw',
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
    now: () => this.currentDate(),
    nowIndicator: true,
    locales: [ itLocale ],
    locale: 'it',
    displayEventTime: false,
    eventClick: this.handleEventClick.bind(this),
  });

  ngOnInit(): void {
    // 👇 Quando cambia il valore della timeMachine, aggiorno il mio signal
    this.timeMachineService.currentDate$.subscribe(date => {
      this.currentDate.set(date);
    });

    this.fetchEvents(false);
    this.fetchActivities(false);
    this.fetchImportedCalendars(false);
    this.fetchUploadedCalendars(true);

  }

  constructor(private alertService: AlertService,
              private dialog: MatDialog,
              private calendarService: CalendarService,
              private authService: AuthService){
    
    // Add click listener to detect clicks outside the dropdown
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }
              
  private loadCalendar(): void {
    this.isLoading = true;
    const calendarEvents = this.convertEvents();
    const calendarActivities = [
      ...this.convertActivities(this.activities),
      ...this.convertActivities(this.overdueActivities)
    ];
    const allCalendarEvents = [...calendarEvents, ...calendarActivities]; 
    const importedCalendars = this.convertImportedCalendars();
    const uploadedCalendars = this.convertUploadedCalendars();

    this.calendarOptions.set({
      ...this.calendarOptions(),
      eventSources: [
        ...importedCalendars,
        ...uploadedCalendars,
        allCalendarEvents
      ]
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
        className: 'event',
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
      start: this.isOverdue(activity.dueDate!) 
              ? new Date(this.currentDate())  // 👈 USO IL SIGNAL
              : activity.dueDate!,
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

  convertImportedCalendars() {
    const converted = this.importedCalendars.map(calendar => {
        return {
          googleCalendarId: calendar.calendarId,
          className: 'google-calendar-event',
          editable: false
        };
    });

    return converted;
  }

  convertUploadedCalendars() {
    const converted = this.uploadedCalendars.map(calendar => {
      const parts = calendar.url!.split('/');
      const userId = parts[0];
      const filename = parts[1];

      return {
        url: `/api/uploads/${userId}/${filename}`,
        format: 'ics'
      };
    });

    return converted;
  }
  
  private isOverdue(date: Date) {
    const endDate = new Date(date).getTime();
    return endDate < this.currentDate().getTime(); // 👈 USO IL SIGNAL
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
    
    // se si stratta di un evento importato, lo apro su google calendar
    if (eventData.url) {
      return;
    }

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
            next: () => this.fetchActivities(true),
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
          next: () => this.fetchEvents(true),
          error: error => console.log(error)
        });
      }
    });
  }

  fetchEvents(reload: boolean) {
    this.calendarService.getMyEvents(this.authService.currentUser).subscribe({
      next: (data) => {
        this.events = data;
        if(reload)
          this.loadCalendar();

      },
      error: error => console.log(error),
      complete: () => this.isLoading = false
    });
  }

  fetchActivities(reload: boolean) {
    this.completedActivities = [];
    this.overdueActivities = [];
    
    this.calendarService.getMyActivities(this.authService.currentUser).subscribe({
      next: (data) => {
        this.activities = data;
        this.getOverdueActivities();
        this.getCompletedActivities();
        if(reload)
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
      next: () => this.fetchActivities(true),
      error: (error) => console.log(error),
      complete: () => this.isLoading = false
    });
  }

  deleteActivity(id: string, title: string) {
    this.alertService.showQuestion(
      `Sei sicuro di voler eliminare l'attività '${title}'`,
      () => this.calendarService.deleteActivity(id).subscribe({
        next: () => this.fetchActivities(true),
        error: (error) => console.log(error)
      })
    );
  } 

  private deleteEvent(event: CalendarEvent) {
    this.calendarService.deleteEvent(event._id!).subscribe({
      next: () => this.fetchEvents(true),
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
          next: () => this.fetchEvents(true),
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
          next: () => this.fetchActivities(true),
          error: error => console.log(error)
        });
      }
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  onDocumentClick(event: MouseEvent): void {
    // Close dropdown when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.create-button-container')) {
      this.showDropdown = false;
    }
  }

  fetchImportedCalendars(reload: boolean) {
    this.calendarService.getMyImportedCalendars(this.authService.currentUser).subscribe({
      next: (calendars) => {
        this.importedCalendars = calendars
        if(reload)
          this.loadCalendar();
      },
      complete: () => this.isLoading = false,
      error: (error) => console.log(error)
    });
  }

  fetchUploadedCalendars(reload: boolean) {
    this.calendarService.getMyUploadedCalendars(this.authService.currentUser).subscribe({
      next: (calendars) => {
        this.uploadedCalendars = calendars
        if(reload)
          this.loadCalendar();
      },
      complete: () => this.isLoading = false,
      error: (error) => console.log(error)
    });
  }

  importCalendar() {
    const dialogRef = this.dialog.open(ImportCalendarDialogComponent, {
      width: '400vw',
      height: 'auto',
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
        
      if (result) {
        if(result.isGoogle) {
          const newImported: ImportedCalendar = {
            calendarId: result.calendarId,
            userId: this.authService.currentUser._id
          }
          
          this.calendarService.importCalendar(newImported).subscribe({
            next: () => this.fetchImportedCalendars(true),
            error: (error) => this.alertService.showError(JSON.stringify(error))
          });

        } else {
          const newImported: UploadedCalendar = {
            url: `${this.authService.currentUser._id}/${result.fileName}`,
            userId: this.authService.currentUser._id
          }

          this.calendarService.uploadCalendar(newImported, result.file).subscribe({
            next: () => this.fetchUploadedCalendars(true),
            error: () => this.alertService.showError('Calendario già importato!')
          });
        }
      }
    });
  }
}
