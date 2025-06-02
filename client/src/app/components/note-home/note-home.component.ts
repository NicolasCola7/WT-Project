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
  //indica se il componente è in modalità preview oppure no
  @Input() isPreviewMode: boolean = false;

  //la lista di tutte le note dell'utente, il criterio di ordinamento delle note, il testo per la ricerca delle note e la categoria "Tutte" nel filtraggio delle ntoe
  notes: Note[] = [];
  sortBy: 'title' | 'createdAt' | 'lengthAsc' | 'lengthDesc' = 'createdAt';
  searchText: string = '';
  selectedCategory: string = 'Tutte';

  //le categorie disponibili a scelta dell'utente
  readonly categories: string[] = ['Lavoro', 'Attività', 'Studio', 'Idee', 'Personale', 'Lettura', 'Creatività'];

  constructor(
    //servizio per la gestione delle note e dell'autenticazione
    private noteService: NoteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    //carica le note all'inizializzazione del componente
    this.fetchMyNotes();
  }

  fetchMyNotes() {
    //recupera le note dell'utente corrente assegnando le note ad una variabile
    this.noteService.getMyNotes(this.authService.currentUser).subscribe({
      next: (myNotes) => this.notes = [...myNotes],
      error: (error) => console.log(error)
    });
  }

  sortedNotes(): Note[] {
    //creo una copia dell’array originale per la visualizzazione delle categorie delle note
    let filtered = [...this.notes];

    //se c'è del testo nella barra di ricerca, filtro le note per titolo (ignorando maiuscole/minuscole)
    if (this.searchText) {
      filtered = filtered.filter(note =>
        note.title!.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    //se è selezionata una categoria specifica (diversa da "Tutte"), filtro per quella categoria
    if (this.selectedCategory !== 'Tutte') {
      filtered = filtered.filter(note =>
        note.category === this.selectedCategory
      );
    }

    //ordino le note in base all'opzione selezionata
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        //ordina dalla più recente alla meno recente
        case 'createdAt':
          return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime();
        //ordina i titoli delle note in ordine alfabetico 
        case 'title':
          return a.title!.localeCompare(b.title!);
        //ordina per lunghezza del contenuto (dalla più corta alla più lunga)
        case 'lengthAsc':
          return a.content!.length - b.content!.length;
        //ordina per lunghezza del contenuto (dalla più lunga alla più corta)
        case 'lengthDesc':
          return b.content!.length - a.content!.length;
        //caso di default
        default:
          return 0;
      }
    });

    //mostro solo le utlime due note nella preview (se presente una sola ne mostro una sola altrimenti mostro la scritta che non ci sono note disponibili)
    return this.isPreviewMode ? filtered.slice(0, 2) : filtered;
  }

  getPreviewText(html: string): string {
    //estrae solo il testo da un contenuto html
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    //limitazione di visualizzazione dell'anteprima di una nota a 200 caratteri
    return text.length > 200 ? text.slice(0, 200) + '…' : text;
  }

  deleteNote(id: string) {
    //elimina una nota tramite l'id e aggiorna la lista dopo l'eliminazione
    this.noteService.deleteNote(id).subscribe({
      next: () => this.fetchMyNotes(),
      error: (error) => console.log(error)
    });
  }

  duplicateNote(note: Note) {
    //crea una copia della nota passata come parametro e aggiunge "(Copia)" al titolo
    const duplicated: Note = {
      title: note.title + ' (Copia)',
      content: note.content,
      category: note.category,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      creatorId: note.creatorId
    };

    //e infine aggiorna la lista delle note aggiungendo la nota duplicata
    this.noteService.addNote(duplicated).subscribe({
      next: () => this.fetchMyNotes(),
      error: (error) => console.log(error)
    });
  }

  viewNote(noteId: string) {
    //naviga alla vista di dettaglio della nota con modalità "view"
    window.location.href = `/home/editor/${noteId}?mode=view`;
  }
}