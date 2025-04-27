import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CalendarEvent } from "../models/event.model";
import { Activity } from "../models/activity.model";
import { User } from "../models/user.model";
import ImportedCalendar from "../models/imported-calendar.model";

@Injectable({ providedIn: 'root' })
export class CalendarService {

  constructor(private http: HttpClient) { }

  getMyEvents(user: User): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>('/api/events', {
      params: {userID: user._id!}
    });
  }

  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>('/api/event', event);
  }

  deleteEvent(eventId: string): Observable<string> {
    return this.http.delete(`/api/event/${eventId}`, { responseType: 'text' });
  }

  updateEvent(event: CalendarEvent): Observable<string> {
    return this.http.put(`/api/event/${event._id}`, event, { responseType: 'text' });
  }

  getMyActivities(user: User): Observable<Activity[]> {
    return this.http.get<Activity[]>('/api/activities', {
      params: {userID: user._id!}
    });
  }

  addActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>('/api/activity', activity);
  }

  deleteActivity(activityId: string): Observable<string> {
    return this.http.delete(`/api/activity/${activityId}`, { responseType: 'text' });
  }

  updateActivity(activity: Activity): Observable<string> {
    return this.http.put(`/api/activity/${activity._id}`, activity, { responseType: 'text' });
  }

  getMyImportedCalendars(user: User): Observable<ImportedCalendar[]> {
    return this.http.get<ImportedCalendar[]>('/api/imported-calendars', {
      params: {userID: user._id!}
    });
  }

  importCalendar(importedCalendar: ImportedCalendar): Observable<ImportedCalendar> {
    return this.http.post<ImportedCalendar>('/api/imported-calendars', importedCalendar);
  }

}