import { Injectable } from '@angular/core';
import { Note } from '../models/note.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private notes: Note[] = [];

  constructor() {
    const saved = localStorage.getItem('notes');
    if (saved) {
      this.notes = JSON.parse(saved).map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      }));
    }
  }

  private saveToStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  getNotes(): Note[] {
    return [...this.notes];
  }

  getNote(id: string): Note | undefined {
    return this.notes.find(n => n.id === id);
  }

  addNote(note: Partial<Note>) {
    const newNote: Note = {
      id: uuidv4(),
      title: note.title || '',
      content: note.content || '',
      categories: note.categories || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notes.push(newNote);
    this.saveToStorage();
  }

  updateNote(id: string, updated: Partial<Note>) {
    const index = this.notes.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notes[index] = {
        ...this.notes[index],
        ...updated,
        updatedAt: new Date(),
      };
      this.saveToStorage();
    }
  }

  deleteNote(id: string) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.saveToStorage();
  }

  duplicateNote(id: string) {
    const original = this.getNote(id);
    if (original) {
      this.addNote({
        title: original.title + ' (Copia)',
        content: original.content,
        categories: [...original.categories],
      });
    }
  }
}