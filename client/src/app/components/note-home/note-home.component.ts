import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './note-home.component.html',
  styleUrl: './note-home.component.css'
})
export class NoteHomeComponent {
  sortBy: 'title' | 'createdAt' | 'length' = 'title';
  searchText: string = '';
  selectedCategory: string = 'Tutte';

  readonly categories: string[] = ['Lavoro ', 'Attività', 'Studio', 'Idee', 'Personale', 'Lettura', 'Creatività'];

  constructor(public noteService: NoteService) {}

  sortedNotes(): Note[] {
    let notes = this.noteService.getNotes();

    if (this.searchText) {
      notes = notes.filter(note => note.title.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    if (this.selectedCategory !== 'Tutte') {
      notes = notes.filter(note => note.categories.includes(this.selectedCategory));
    }

    return notes.sort((a, b) => {
      if (this.sortBy === 'title') return a.title.localeCompare(b.title);
      if (this.sortBy === 'createdAt') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
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