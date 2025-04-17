import { HttpClient, HttpDownloadProgressEvent, HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { filter, map, Observable, startWith } from "rxjs";
import Chat from "../models/chat.model";
import { AuthService } from "./auth.service";
import { Message } from "../models/message.model";

@Injectable({ providedIn: 'root' })
export class ChatService {
    SYSTEM_PROMPT = "Sei un assistente per studenti universitari. Puoi rispondere solo a domande riguardanti la matematica e l'informatica. Quando l'utente ti fa una domanda o chiede la soluzione ad un problema, non dare subito la risposta, ma aiuta lo studente ad arrivarci attraverso spunti di ragionamento";
    private readonly _completeMessages = signal<Message[]>([]);
    private readonly _messages = signal<Message[]>([]);
    //private readonly _generatingInProgress = signal<boolean>(false);
  
    readonly messages = this._messages.asReadonly();
    //readonly generatingInProgress = this._generatingInProgress.asReadonly();
    constructor(private http: HttpClient,
                private authService: AuthService) {}

    newChat(): Observable<Chat> {
        const newChat: Chat = {
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

    sendMessage(prompt: string): void {
      //this._generatingInProgress.set(true);
  
      this._completeMessages.set([
        ...this._completeMessages(),
        { id: window.crypto.randomUUID(), content: prompt, role: 'user'}
      ]);
  
      this.getResponse(prompt).subscribe({
        next: (message) =>
          this._messages.set([...this._completeMessages(), message]),
  
        complete: () => {
          //this._generatingInProgress.set(false);
          this._completeMessages.set(this._messages());
        },
  
        error: (error) => console.log(error),
      });
    }

    getResponse(prompt: string) {
      const id = window.crypto.randomUUID();

      return this.http
        .post(`/api/chats/chatid`, prompt, {
          responseType: 'text',
          observe: 'events',
          reportProgress: true,
        })
        .pipe(
            filter(
                (event: HttpEvent<string>): boolean =>
                  event.type === HttpEventType.DownloadProgress ||
                  event.type === HttpEventType.Response,
            ),
            map(
                (event: HttpEvent<string>): Message =>
                  event.type === HttpEventType.DownloadProgress
                    ? {
                        id,
                        content: (event as HttpDownloadProgressEvent).partialText!,
                        role: 'assistant',
                        generating: true,
                      }
                    : {
                        id,
                        content: JSON.parse((event as HttpResponse<string>).body!),
                        role: 'assistant',
                        generating: false,
                      },
            ),
            startWith<Message>({
                id,
                content: '',
                role: 'assistant',
                generating: true,
            }),
        );
      }
}