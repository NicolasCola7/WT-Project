import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import Chat from "../models/chat.model";
import { AuthService } from "./auth.service";
import { Message } from "../models/message.model";

@Injectable({ providedIn: 'root' })
export class ChatService {
    SYSTEM_PROMPT = "Sei un assistente per studenti universitari di un corso di Informatica. Puoi rispondere solo a domande riguardanti l'informatica, ad ogni altra domanda o affermazione non ti è permesso rispondere. Quando l'utente ti fa una domanda o chiede la soluzione ad un problema, non dare subito la risposta, ma aiuta lo studente ad arrivarci attraverso spunti di ragionamento";
    private readonly _messages = signal<Message[]>([]);
    private readonly _chats = signal<Chat[]>([]);
    private currentChat?: Chat;
    private readonly _generatingInProgress = signal<boolean>(false);

    readonly messages = this._messages.asReadonly();
    readonly generatingInProgress = this._generatingInProgress.asReadonly();
    readonly chats = this._chats.asReadonly();

    constructor(private http: HttpClient,
                private authService: AuthService) {}

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
            error: (error) => console.log(error)
          })
        },

        error: (error) => console.log(error),
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