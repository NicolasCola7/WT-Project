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
  sortBy: 'title' | 'createdAt' | 'lengthAsc' | 'lengthDesc' = 'createdAt';
  searchText: string = '';
  selectedCategory: string = 'Tutte';

  readonly categories: string[] = ['Lavoro ', 'Attività', 'Studio', 'Idee', 'Personale', 'Lettura', 'Creatività'];

  constructor(public noteService: NoteService) {}

  sortedNotes(): Note[] {
  let notes = this.noteService.getNotes();

  if (this.searchText) {
    notes = notes.filter(note =>
      note.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedCategory !== 'Tutte') {
    notes = notes.filter(note => note.categories.includes(this.selectedCategory));
  }

  return notes.sort((a, b) => {
    switch (this.sortBy) {
      case 'createdAt':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'lengthAsc':
        return a.content.length - b.content.length;
      case 'lengthDesc':
        return b.content.length - a.content.length;
      default:
        return 0;
      }
    });
  }
  
  getPreviewText(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 200 ? text.slice(0, 200) + '…' : text;
  }

  deleteNote(id: string) {
    this.noteService.deleteNote(id);
  }

  duplicateNote(id: string) {
    this.noteService.duplicateNote(id);
  }
}