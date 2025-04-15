import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-home',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './note-home.component.html'
})
export class NoteHomeComponent {
  sortBy: 'title' | 'createdAt' | 'length' = 'title';
  searchText: string = '';
  selectedCategory: string = 'Tutte';

  constructor(public noteService: NoteService) {}

  getCategories(): string[] {
    const all = this.noteService.getNotes().flatMap(n => n.categories);
    return Array.from(new Set(all));
  }

  sortedNotes(): Note[] {
    let notes = this.noteService.getNotes();

    if (this.searchText) {
      notes = notes.filter(note =>
        note.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        note.content.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.selectedCategory !== 'Tutte') {
      notes = notes.filter(note => note.categories.includes(this.selectedCategory));
    }

    return notes.sort((a, b) => {
      if (this.sortBy === 'title') return a.title.localeCompare(b.title);
      if (this.sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (this.sortBy === 'length') return b.content.length - a.content.length;
      return 0;
    });
  }

  delete(id: string) {
    this.noteService.deleteNote(id);
  }

  duplicate(id: string) {
    this.noteService.duplicateNote(id);
  }
}