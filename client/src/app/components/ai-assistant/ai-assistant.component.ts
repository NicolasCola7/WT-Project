import { Component, effect, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-ai-assistant',
  imports: [
    FormsModule,
    NgClass,
    MatIconModule,
    MarkdownComponent,
  ],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.css'
})
export class AiAssistantComponent {
  private readonly chatService = inject(ChatService);

  readonly messages = this.chatService.messages;
  //readonly generatingInProgress = this.chatService.generatingInProgress;

  private readonly scrollOnMessageChanges = effect(() => {
    // run this effect on every messages change
    this.messages();

    // scroll after the messages render
    setTimeout(() =>
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      }),
    );
  });

  sendMessage(form: NgForm, messageText: string): void {
    this.chatService.sendMessage(messageText);
    form.resetForm();
  }
}
