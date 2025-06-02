import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-assistant-preview',
  templateUrl: './ai-assistant-preview.component.html',
  styleUrls: ['./ai-assistant-preview.component.css']
})
export class AiAssistantPreviewComponent {
  //inizializzo il router per gestire la navigazione
  constructor(private router: Router) {}

  askQuestion(question: string) {
    //navigo verso la pagina dell'assistente AI passando la domanda come parametro
    this.router.navigate(['/home/assistant'], {
      queryParams: { q: question }
    });
  }
}