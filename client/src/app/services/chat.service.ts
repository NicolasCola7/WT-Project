import { HttpClient, HttpDownloadProgressEvent, HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { filter, map, Observable, startWith } from "rxjs";
import OpenAI from 'openai';
import Chat from "../models/chat.model";
import { AuthService } from "./auth.service";
import { Message } from "../models/message.model";

@Injectable({ providedIn: 'root' })
export class ChatService {
    SYSTEM_PROMPT = "Sei un assistente per studenti universitari. Puoi rispondere solo a domande riguardanti la matematica e l'informatica. Quando l'utente ti fa una domanda o chiede la soluzione ad un problema, non dare subito la risposta, ma aiuta lo studente ad arrivarci attraverso spunti di ragionamento";

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

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

    async getResponse(chat: Chat) {
        return this.http
        .post(`/api/chats/${chat._id}`, chat.messages, {
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
                        content: (event as HttpDownloadProgressEvent).partialText!,
                        role: 'assistant',
                        generating: true,
                      }
                    : {
                        content: (event as HttpResponse<string>).body!,
                        role: 'assistant',
                        generating: false,
                      },
            ),
            startWith<Message>({
                content: '',
                role: 'assistant',
                generating: true,
              }),
        );
    }
}