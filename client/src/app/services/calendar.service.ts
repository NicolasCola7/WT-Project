import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CalendarEvent } from "../models/event.model";
import { Activity } from "../models/activity.model";

@Injectable({providedIn: 'root'})
export class CalendarService {

  constructor(private http: HttpClient) { }

  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>('/api/event', event);
  }

  deleteEvent(event: CalendarEvent): Observable<string> {
    return this.http.delete(`/api/event/${event._id}`, { responseType: 'text' });
  }

  addActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>('/api/activity', activity);
  }

  deleteActivity(activity: Activity): Observable<string> {
    return this.http.delete(`/api/activity/${activity._id}`, { responseType: 'text' });
  }

}