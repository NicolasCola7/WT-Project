import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ai-assistant-preview',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './ai-assistant-preview.component.html',
  styleUrl: './ai-assistant-preview.component.css'
})
export class AiAssistantPreviewComponent {
  constructor(private router: Router) {}

  predefinedQuestions = [
    "Puoi aiutarmi ad organizzare lo studio di oggi?",
    "Mi dai un consiglio su cosa fare stasera?",
    "Ciao! Com'è il tempo oggi?"
  ];

  sendToAssistant(question: string) {
    this.router.navigate(['/home/ai-assistant'], {
      queryParams: { q: question }
    });
  }
}