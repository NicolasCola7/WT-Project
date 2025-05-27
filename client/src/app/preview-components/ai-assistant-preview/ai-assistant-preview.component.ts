import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-assistant-preview',
  templateUrl: './ai-assistant-preview.component.html',
  styleUrls: ['./ai-assistant-preview.component.css']
})
export class AiAssistantPreviewComponent {
  constructor(private router: Router) {}

  askQuestion(question: string) {
    this.router.navigate(['/home/assistant'], {
      queryParams: { q: question }
    });
  }
}