import { AfterViewChecked, Component, effect, ElementRef, inject, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownComponent } from 'ngx-markdown';
import Chat from '../../models/chat.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-ai-assistant',
  imports: [FormsModule, NgClass, MatIconModule, MarkdownComponent, CommonModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.css'
})
export class AiAssistantComponent implements OnInit {
  private readonly chatService = inject(ChatService);
  readonly generatingInProgress = this.chatService.generatingInProgress;
  readonly messages = this.chatService.messages;
  chats = signal<Chat[]>([]);
  currentChat: any = null;
  inputText: string = '';
  sidebarOpen = false;
  selectedChatId: string | null = null;
  @ViewChildren('titleInput') titleInputs!: QueryList<ElementRef>;
  @ViewChild('chatContent') private chatContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {
    effect(() => {
      this.messages();
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  private scrollToBottom() {
    const el = this.chatContainer.nativeElement;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth'
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  
  closeSidebar() {
    this.sidebarOpen = false;
  }
  
  ngOnInit(): void {
    this.loadMyChats();

    //ricevo il parametro "q" dalla query nell'URL
    this.route.queryParams.subscribe(async (params) => {
      const question = params['q'];
      if (question) {
        //invio il messaggio predefinito in una nuova chat
        await this.sendPredefinedMessage(question);

        //rimuovo il parametro "q" dall’URL
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      }
    });
  }

  async sendMessage(form: NgForm, messageText: string): Promise<void> {
    if(!this.currentChat) {
      await this.newChat();
    }

    this.currentChat?.messages?.push({
      role: 'user',
      content: messageText
    });

    this.chatService.sendMessage(this.currentChat!);
    form.resetForm();
  }

  async sendPredefinedMessage(messageText: string): Promise<void> {
    if (!this.currentChat) {
      //se non esiste una chat, creo una nuova chat
      await this.newChat();
    }

    //inserisce il messaggio dell'utente cliccato dal bottone nella chat
    this.currentChat.messages.push({
      role: 'user',
      content: messageText
    });

    //invia la chat aggiornata al modello AI per ricevere la risposta
    this.chatService.sendMessage(this.currentChat);
  }
  
  newChat(): Promise<Chat> | void {
    if(this.currentChat?.messages?.length != 1) {
      return new Promise((resolve, reject) => {
        this.chatService.newChat().subscribe({
          next: (chat) => {
            this.currentChat = chat;
            this.selectedChatId = chat._id!
            this.chats.set([...this.chats(), chat]);
            resolve(chat);
          },
          error: (error) => {
            this.alertService.showError("Si è verificato un errore imprevisto nella creazione della nuova chat, riprova.");
            reject(error);
          }
        });
      });
    }
  }

  loadMyChats() {
    this.chatService.getMyChats().subscribe({
      next: (chats) =>this.chats.set([...chats]),
      error: (error) => this.alertService.showError("Si è verificato un errore imprevisto nel caricamento delle chat, riprova.")
    });
  }

  loadChat(chat: Chat) {
    this.chatService.loadChat(chat).subscribe({
      next: (chat) => {
        this.currentChat = chat
        this.selectedChatId = chat._id!
        this.chatService.setChatMessages(chat.messages!);
        this.scrollToBottom();
      },
      error: (error) => this.alertService.showError("Si è verificato un errore imprevisto nel caricamento dei messaggi, riprova."),
      complete: () =>  this.scrollToBottom()
    });
  }

  deleteChat(chat: Chat) {
    this.chatService.deleteChat(chat).subscribe({
      next: () => this.loadMyChats(),
      error: (error) => this.alertService.showError("Si è verificato un errore imprevisto nell'eliminazione della chat, riprova.")
    })
  }

  // Metodo per avviare la modifica del titolo
  startEditChat(chat: Chat, event: MouseEvent): void {
    event.stopPropagation();
    
    // Prima imposta tutte le chat in modalità non modifica
    this.chats().forEach(c => c.editing = false);
    
    // Imposta questa chat in modalità modifica
    chat.editing = true;
    chat.editTitle = chat.title;
    
    // Dopo il rendering, cerca l'input giusto
    setTimeout(() => {
      const inputs = this.titleInputs.toArray();
      if (inputs.length > 0) {
        // Trova l'input corrispondente alla chat corrente
        const index = this.chats().findIndex(c => c._id === chat._id);
        if (index >= 0 && index < inputs.length) {
          const inputElement = inputs[index].nativeElement;
          inputElement.focus();
          inputElement.select();
        }
      }
    });
  }

  // Metodo per salvare il titolo modificato
  saveEditedTitle(chat: Chat): void {
    if (chat.editTitle && chat.editTitle.trim() !== '') {
      chat.title = chat.editTitle.trim();
      
      this.chatService.updateChat(chat).subscribe({
        error: (error) => this.alertService.showError("Si è verificato un errore imprevisto nella modifica del titolo della chat, riprova.")
      });
    }
    
    // Esci dalla modalità modifica
    chat.editing = false;
  }

  // Metodo per annullare la modifica
  cancelEdit(chat: Chat): void {
    chat.editing = false;
  }

  clearCurrentChat() {
    this.currentChat = undefined;
    this.selectedChatId = null;
    this.chatService.setChatMessages([]);
  }
}
