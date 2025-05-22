import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';
import Note from '../../models/note.model';

@Component({
  selector: 'app-note-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './note-home.component.html',
  styleUrl: './note-home.component.css'
})
export class NoteHomeComponent implements OnInit{
  @Input() isPreviewMode: boolean = false;

  notes: Note[] = [];
  sortBy: 'title' | 'createdAt' | 'lengthAsc' | 'lengthDesc' = 'createdAt';
  searchText: string = '';
  selectedCategory: string = 'Tutte';

  readonly categories: string[] = ['Lavoro', 'Attività', 'Studio', 'Idee', 'Personale', 'Lettura', 'Creatività'];

  constructor(
    private noteService: NoteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchMyNotes();
  }

  fetchMyNotes() {
    this.noteService.getMyNotes(this.authService.currentUser).subscribe({
      next: (myNotes) => this.notes = [...myNotes],
      error: (error) => console.log(error)
    });
  }

  sortedNotes(): Note[] {
  
    if (this.searchText) {
      this.notes = this.notes.filter(note =>
        note.title!.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.selectedCategory !== 'Tutte') {
      this.notes = this.notes.filter(note => note.category!.includes(this.selectedCategory));
    }

    this.notes = this.notes.sort((a, b) => {
      switch (this.sortBy) {
        case 'createdAt':
          return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime();
        case 'title':
          return a.title!.localeCompare(b.title!);
        case 'lengthAsc':
          return a.content!.length - b.content!.length;
        case 'lengthDesc':
          return b.content!.length - a.content!.length;
        default:
          return 0;
      }
    });

    //mostro solo le utlime due note nella preview (se presente una sola ne mostro una sola altrimenti mostro la scritta che non ci sono note disponibili)
    return this.isPreviewMode ? this.notes.slice(0, 2) : this.notes;
  }

  getPreviewText(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 200 ? text.slice(0, 200) + '…' : text;
  }

  deleteNote(id: string) {
    this.noteService.deleteNote(id).subscribe({
      next: () => this.fetchMyNotes(),
      error: (error) => console.log(error)
    });
  }

  duplicateNote(note: Note) {
    const duplicated: Note = {
      title: note.title + ' (Copia)',
      content: note.content,
      category: note.category,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      creatorId: note.creatorId
    };

    this.noteService.addNote(duplicated).subscribe({
      next: () => this.fetchMyNotes(),
      error: (error) => console.log(error)
    });
  }
}