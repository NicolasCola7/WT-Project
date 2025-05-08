import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, switchMap } from "rxjs";
import { CalendarEvent } from "../models/event.model";
import { Activity } from "../models/activity.model";
import { User } from "../models/user.model";
import ImportedCalendar from "../models/imported-calendar.model";
import UploadedCalendar from "../models/uploaded-calendar.model";

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

  getMyUploadedCalendars(user: User): Observable<UploadedCalendar[]> {
    return this.http.get<UploadedCalendar[]>('/api/uploaded-calendars', {
      params: {userID: user._id!}
    });
  }

  importCalendar(importedCalendar: ImportedCalendar): Observable<ImportedCalendar> {
    return this.http.post<ImportedCalendar>('/api/imported-calendars', importedCalendar);
  }

  uploadCalendar(uploadedCalendar: UploadedCalendar, file?: File): Observable<UploadedCalendar> {
    const userID = uploadedCalendar.url!.split('/')[0];

    return this.upload(userID, file!).pipe(
      switchMap( () => {
        return this.http.post<UploadedCalendar>('/api/uploaded-calendars', uploadedCalendar);
      })
    );
  }

  upload(destination: string, file: File): Observable<string> {
    var formData: any = new FormData();
    formData.append('destination', destination);
    formData.append('calendar', file);
    return this.http.post('/api/uploads', formData,  {responseType: 'text'});
  }

  deleteImportedCalendar(calendar: ImportedCalendar): Observable<string> {
    return this.http.delete(`/api/imported-calendars/${calendar._id}`, { responseType: 'text' });
  }

  deleteUploadedCalendar(calendar: UploadedCalendar): Observable<string> {
    return this.deleteFile(calendar.url!).pipe(
      switchMap( () => {
        return this.http.delete(`/api/uploaded-calendars/${calendar._id}`, { responseType: 'text' });
      })
    );
  }

  deleteFile(destination: string): Observable<string> {
    const parts = destination.split('/');

    return this.http.delete(`/api/uploads/${parts[0]}/${parts[1]}`,  { responseType: 'text' });
  }

  getTodayEvents(user: User, currentDate: Date): Observable<CalendarEvent[]> {
    const formattedDate = currentDate.toISOString().split('T')[0];

    return this.http.get<CalendarEvent[]>('/api/events', {
      params: {userID: user._id!, date: formattedDate}
    });
  }

  getTodayActivities(user: User, currentDate: Date): Observable<Activity[]> {
    const formattedDate = currentDate.toISOString().split('T')[0];

    return this.http.get<Activity[]>('/api/activities', {
      params: {userID: user._id!, date: formattedDate}
    });
  }

}