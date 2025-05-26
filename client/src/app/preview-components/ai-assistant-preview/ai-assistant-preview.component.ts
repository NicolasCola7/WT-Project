import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ai-assistant-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './ai-assistant-preview.component.html',
  styleUrl: './ai-assistant-preview.component.css'
})
export class AiAssistantPreviewComponent {
  constructor(private router: Router) {}

  predefinedQuestions = [
    "Ciao! Com'è il tempo oggi?",
    "Mi consigli di andare al mare oggi?",
    "Quali eventi ci sono in zona questo weekend?",
    "Come posso rilassarmi oggi?"
  ];

  sendToAssistant(question: string) {
    // Passa la domanda come queryParam o stato e naviga all’assistente
    this.router.navigate(['/home/ai-assistant'], {
      queryParams: { q: question }
    });
  }
}