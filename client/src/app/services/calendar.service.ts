import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CalendarEvent } from "../models/event.model";
import { Activity } from "../models/activity.model";

@Injectable({ providedIn: 'root' })
export class CalendarService {

  constructor(private http: HttpClient) { }

  getMyEvents(userID: string): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>('/api/events', {
      params: {userID: userID}
    });
  }

  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>('/api/event', event);
  }

  deleteEvent(event: CalendarEvent): Observable<string> {
    return this.http.delete(`/api/event/${event._id}`, { responseType: 'text' });
  }

  getMyActivities(userID: string): Observable<Activity[]> {
    return this.http.get<Activity[]>('/api/activities', {
      params: {userID: userID}
    });
  }

  addActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>('/api/activity', activity);
  }

  deleteActivity(activity: Activity): Observable<string> {
    return this.http.delete(`/api/activity/${activity._id}`, { responseType: 'text' });
  }

}