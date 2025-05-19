import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Note from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NoteService {

  constructor(private http: HttpClient) {
  }

  getMyNotes(user: User): Observable<Note[]> {
    return this.http.get<Note[]>('/api/notes', {
      params: {userID: user._id!}
    });
  }

  getNote(noteId: string): Observable<Note> {
    return this.http.get<Note>(`/api/notes/${noteId}`);
  }
  
  addNote(note: Note): Observable<Note> {
    return this.http.post<Note>('/api/notes', note);
  }

  deleteNote(noteId: string): Observable<string> {
    return this.http.delete(`/api/notes/${noteId}`, { responseType: 'text' });
  }

  updateNote(note: Note): Observable<string> {
    return this.http.put(`/api/notes/${note._id}`, note, { responseType: 'text' });
  }
}