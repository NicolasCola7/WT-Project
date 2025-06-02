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
  //l'oggetto che contiene la nota corrente
  note: Note = {}
  //indica se si è in modalità visualizzazione
  isViewMode: boolean = false;

  //le categorie disponibili a scelta dell'utente (vengono riportate perchè possono essere modificate in fase di "Modifica Nota")
  categories = ['Lavoro', 'Attività', 'Studio', 'Idee', 'Personale', 'Lettura', 'Creatività'];
  //la categoria selezionata dall'utente della nota corrente
  selectedCategory?: 'Lavoro' |'Attività' | 'Studio' | 'Idee' | 'Personale' | 'Lettura' | 'Creatività';

  //setto l'editor importato con le impostazioni di default consigliate
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '200px',
    placeholder: 'Scrivi la tua nota qui...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['subscript', 'superscript'], ['insertImage', 'insertVideo']]
  };

  //link per tornare alla lista delle note
  backLink = '../note';

  constructor(
    //gestisce i parametri del routing, la navigazione, il servizio per le note e il servizio per l'autenticazione
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private authService: AuthService
  ) {
    this.route.paramMap.subscribe(params => {
      //ottengo l'id della nota dalla route
      const id = params.get('id');
      //ottengo la modalità in cui si troviamo("Visualizza nota" o "Modifica nota")
      const mode = this.route.snapshot.queryParamMap.get('mode');
      //imposta se ci troviamo in modalità visualizzazione
      this.isViewMode = mode === 'view';
      //se siamo in mododalità visualizzazione, disattivo l’editor di testo
      this.editorConfig.editable = !this.isViewMode;

      if (id) {
        //carico la nota se è presente correttamente l'id e assegno il contenuto della nota trovato, la categoria e un link per tornare indietro
        this.noteService.getNote(id).subscribe({
          next: (found) => {
            this.note = found;
            this.selectedCategory = found.category!;
            this.backLink = '../../note';
          },
          error: (error) => console.log(error)
        });
      } else {
        this.backLink = '../note';
      }
    });
  }

  save() {
    //verifico che il titolo e la categoria siano validi
    if (!this.note.title!.trim() || !this.selectedCategory) {
      return;
    }

    this.note.category = this.selectedCategory;
    //mi salvo la nuova data di modifica della nota
    this.note.updatedAt = new Date(); 

    if (this.note._id) {
      //aggiorno una nota esistente modificando la data e ora dell'ultima modifica
      this.noteService.updateNote(this.note).subscribe();
    } else {
      //creo una nuova nota
      this.note.createdAt = new Date();
      this.note.creatorId = this.authService.currentUser._id;
      this.noteService.addNote(this.note).subscribe();
    }
    //navigo alla lista delle note dopo il salvataggio
    this.router.navigate(['/home/note']);
  }
}