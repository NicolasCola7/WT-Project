import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapsible-list',
  imports: [CommonModule],
  templateUrl: './collapsible-list.component.html',
  styleUrl: './collapsible-list.component.css'
})
export class CollapsibleListComponent {
  @Input() title: string = 'Titolo';
  isExpanded: boolean = false;
  
  toggleList() {
    this.isExpanded = !this.isExpanded;
  }
}
