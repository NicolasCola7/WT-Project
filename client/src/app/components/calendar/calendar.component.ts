import { Component , signal, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
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
import { CreateActivityDialogComponent } from '../create-activity-dialog/create-activity-dialog.component';
import { CalendarEvent } from '../../models/event.model';
import { CalendarService } from '../../services/calendar.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    FullCalendarModule,
    DialogModule,
    CommonModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true
})
export class CalendarComponent {
  selectedDate = new Date();
  calendarVisible = signal(true);
  events: CalendarEvent[] = [];
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

  // Carica attività ed eventi nel calendario
  private loadCalendar(): void {

    this.calendarOptions.set({
      ...this.calendarOptions(),
    });

    const calendarEvents = this.convertEvents();
    const allCalendarEvents = [...calendarEvents ]; 

    this.calendarOptions.set({
      ...this.calendarOptions(),
      events: allCalendarEvents 
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
        rrule.until = new Date(event.repetitions).toISOString(); 
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
        backgroundColor: '#4c95e4', 
        rrule: Object.keys(rrule).length ? rrule : undefined,
        duration: durationInMs > 0 ? { milliseconds: durationInMs } : undefined,
        allDay: event.startDate == event.endDate 
      }
    });

    return converted;
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
          startDate: result.dateStart,
          endDate: result.dateEnd,
          location: result.place,
          frequency: result.recurrence,
          repetitions: result.recurrenceEnd,
          creatorId: result.creatorId
        };

        alert(newEvent.creatorId);
        
        this.calendarService.addEvent(newEvent).subscribe(
          () =>  {
            this.alertService.showSuccess('Evento creato con successo!')
            this.fetchEvents()
          }
        );
      }
    });
  }

  fetchEvents() {
    this.calendarService.getMyEvents(this.authService.currentUser).subscribe(
      (data) => {

        this.events = data;
        this.loadCalendar();
      }
    );
  }
}
