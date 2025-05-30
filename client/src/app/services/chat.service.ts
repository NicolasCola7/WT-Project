import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import Chat from "../models/chat.model";
import { AuthService } from "./auth.service";
import { Message } from "../models/message.model";
import { AlertService } from "./alert.service";

@Injectable({ providedIn: 'root' })
export class ChatService {
    SYSTEM_PROMPT = "Sei un assistente per studenti universitari. Puoi rispondere a qualsiasi domanda ti viene fatta. Quando l'utente ti fa una domanda o chiede la soluzione ad un problema, fornisci la soluzione al problema e fornisci spunti per ampliare il ragionamento";
    private readonly _messages = signal<Message[]>([]);
    private readonly _chats = signal<Chat[]>([]);
    private currentChat?: Chat;
    private readonly _generatingInProgress = signal<boolean>(false);

    readonly messages = this._messages.asReadonly();
    readonly generatingInProgress = this._generatingInProgress.asReadonly();
    readonly chats = this._chats.asReadonly();

    constructor(private http: HttpClient,
                private authService: AuthService,
                private alertService: AlertService) {}

    newChat(): Observable<Chat> {
      this._messages.set([]);
      let newChat = {
        title: "Nessun titolo",
        messages: [{ role: 'system', content: this.SYSTEM_PROMPT }],
        creatorId: this.authService.currentUser._id
      };

      return this.http.post<Chat>('/api/chats', newChat);
    }

    getMyChats(): Observable<Chat[]> {
        return this.http.get<Chat[]>('/api/chats', {
          params: {userID: this.authService.currentUser._id!}
        });
    }

    sendMessage(chat: Chat): void {
      this._generatingInProgress.set(true);

      this._messages.set([
        ...chat.messages!
      ]);
  
      this.getResponse(chat).subscribe({
        next: (message) => {
          chat.messages?.push(message!);
          this.updateChat(chat).subscribe({
            next: () => {
              this._messages.set([...chat.messages!])
            },
            complete: () => this._generatingInProgress.set(false),
            error: (error) => this.alertService.showError("Si è verificato un errore imprevisto nel salvataggio dei nuovi messagi, riprova.")
          })
        },

        error: (error) => this.alertService.showError("Chiave API OpenAI non valida!"),
      });
    }

    getResponse(chat: Chat): Observable<Message> {
      return this.http.post<Message>(`/api/chats/${chat._id}`, chat.messages);
    }

    updateChat(chat: Chat): Observable<string> {
      return this.http.put(`/api/chats/${chat._id}`, chat, { responseType: 'text' });
    }

    loadChat(chat: Chat): Observable<Chat> {
      return this.http.get<Chat>(`/api/chats/${chat._id}`);
    }

    setChatMessages(messages: Message[]) {
      this._messages.set([
        ...messages
      ]);
    }

    deleteChat(chat: Chat): Observable<string> {
      return this.http.delete(`/api/chats/${chat._id}`, { responseType: 'text' });
    }
}