import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { CommonModule, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownComponent } from 'ngx-markdown';
import Chat from '../../models/chat.model';

@Component({
  selector: 'app-ai-assistant',
  imports: [
    FormsModule,
    NgClass,
    MatIconModule,
    MarkdownComponent,
    CommonModule
  ],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.css'
})
export class AiAssistantComponent implements OnInit{
  private readonly chatService = inject(ChatService);
  readonly generatingInProgress = this.chatService.generatingInProgress;
  readonly messages = this.chatService.messages;
  chats = signal<Chat[]>([]);
  currentChat?: Chat;
  sidebarOpen = false;
  selectedChatId: string | null = null;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  
  closeSidebar() {
    this.sidebarOpen = false;
  }
  
  ngOnInit(): void {
    this.loadMyChats();
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

  newChat(): Promise<Chat> {
    return new Promise((resolve, reject) => {
      this.chatService.newChat().subscribe({
        next: (chat) => {
          this.currentChat = chat;
          this.chats.set([...this.chats(), chat]);
          resolve(chat);
        },
        error: (error) => {
          console.log(error);
          reject(error);
        }
      });
    });
  }

  loadMyChats() {
    this.chatService.getMyChats().subscribe({
      next: (chats) =>this.chats.set([...chats]),
      error: (error) => console.log(error)
    });
  }

  loadChat(chat: Chat) {
    this.chatService.loadChat(chat).subscribe({
      next: (chat) => {
        this.currentChat = chat
        this.selectedChatId = chat._id!
        this.chatService.setChatMessages(chat.messages!);
      },
      error: (error) => console.log(error)
    })
  }

  deleteChat(chat: Chat) {
    this.chatService.deleteChat(chat).subscribe({
      next: () => this.loadMyChats(),
      error: (error) => console.log(error)
    })
  }

  renameChat(chat: Chat) {

  }
  
}
