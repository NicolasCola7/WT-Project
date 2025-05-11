import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AngularEditorModule],
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

  categories: string[] = ['Lavoro', 'Attività', 'Studio', 'Idee', 'Personale', 'Lettura', 'Creatività'];
  selectedCategory: string = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '200px',
    placeholder: 'Scrivi la tua nota qui...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['subscript', 'superscript'],
      ['insertImage', 'insertVideo']
    ]
  };

  constructor(private route: ActivatedRoute, private router: Router, private noteService: NoteService) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.noteService.getNote(id);
      if (found) {
        this.note = { ...found };
        this.selectedCategory = found.categories[0] || '';
      }
    }
  }

  save() {
    if (!this.note.title.trim() || !this.selectedCategory) {
      return;
    }

    this.note.categories = [this.selectedCategory];

    if (this.note.id) {
      this.noteService.updateNote(this.note.id, this.note);
    } else {
      this.noteService.addNote(this.note);
    }

    this.router.navigate(['/home/note']);
  }
}