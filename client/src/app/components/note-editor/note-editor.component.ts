import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { NoteService } from '../../services/note.service';
import Note from '../../models/note.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AngularEditorModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.css'
})
export class NoteEditorComponent {
  note: Note = {}

  categories = ['Lavoro', 'Attività', 'Studio', 'Idee', 'Personale', 'Lettura', 'Creatività'];
  selectedCategory?: 'Lavoro' |'Attività' | 'Studio' | 'Idee' | 'Personale' | 'Lettura' | 'Creatività';

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

  backLink = '../note';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private authService: AuthService
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.noteService.getNote(id).subscribe({
          next: (found) => {
            this.note = found;
            this.selectedCategory = found.category!
            this.backLink = '../../note';
          },
          error: (error) => console.log(error)
        });
      }
      //link per modificare una nuova nota non ancora esistente 
      else {
        this.backLink = '../note';
      }
    });
  }

  save() {
    if (!this.note.title!.trim() || !this.selectedCategory) {
      return;
    }

    this.note.category = this.selectedCategory;
    this.note.updatedAt = new Date(); // nuova data di modifica

    if (this.note._id) {
      this.noteService.updateNote(this.note).subscribe();
    } else {
      this.note.createdAt = new Date();
      this.note.creatorId = this.authService.currentUser._id;
      this.noteService.addNote(this.note).subscribe();
    }

    this.router.navigate(['/home/note']);
  }
}