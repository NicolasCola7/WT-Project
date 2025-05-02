import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-editor',
  imports: [CommonModule, FormsModule, RouterLink, QuillModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.css'
})

export class NoteEditorComponent {
  note: Note = {
    id: '',
    title: '',
    content: '',
    categories: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  newCategory = '';

  constructor(private route: ActivatedRoute, private router: Router, private noteService: NoteService) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.noteService.getNote(id);
      if (found) this.note = { ...found };
    }
  }

  save() {
    if (this.note.id) {
      this.noteService.updateNote(this.note.id, this.note);
    } else {
      this.noteService.addNote(this.note);
    }
    this.router.navigate(['/']);
  }
}