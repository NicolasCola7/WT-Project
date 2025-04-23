import { Component } from '@angular/core';
import { GridsterComponent, GridsterConfig, GridsterItemComponent } from 'angular-gridster2';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardItem } from '../../models/dashboard-item.model';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  standalone: true,
  imports: [GridsterComponent, 
            GridsterItemComponent, 
            CommonModule,
            RouterModule]
})
export class GridComponent {
  options!: GridsterConfig;
  dashboard!: Array<DashboardItem>;

  constructor(private router: Router) {}

  //queste due callback ci serviranno più avanti
  static itemResize(item: any, itemComponent: any) {
    console.info('itemResized', item, itemComponent);
  }

  ngOnInit() {
    //imposto le opzioni della griglia
    this.options = {
      //callback per evento ridimensionamento
      itemResizeCallback: GridComponent.itemResize,
      //elementi con drag & drop e ridimensionabili
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
      //griglia 12x12
      minCols: 12,
      minRows: 12,
      maxCols: 12,
      maxRows: 12,
      setGridSize: true,
      pushItems: false,
      displayGrid: 'none',
      scrollToNewItems: true,
    };
    //componenti della dashboard
    this.dashboard = [
      // Prima riga (y: 0)
      { cols: 4, rows: 6, y: 0, x: 0, name: 'Calendario', relativeUrl: '/calendar', urlImg: "calendar.png", isTimeMachine: false },
      { cols: 4, rows: 6, y: 0, x: 4, name: 'Timer', relativeUrl: '/timer', urlImg: "timer.png", isTimeMachine: false },
      { cols: 4, rows: 6, y: 0, x: 8, name: 'Note', relativeUrl: '/note', urlImg: "note.png", isTimeMachine: false },
    
      // Seconda riga (y: 3)
      { cols: 4, rows: 6, y: 3, x: 0, name: 'AsistenteAi', relativeUrl: '/assistant', urlImg: "chatbot.png", isTimeMachine: false },
      { cols: 4, rows: 6, y: 3, x: 4, name: 'Extra 2', relativeUrl: '/extra2', urlImg: "extra.png", isTimeMachine: false },
      { cols: 4, rows: 6, y: 3, x: 8, name: 'Time Machine', relativeUrl: '/time-machine', urlImg: "time-machine.png", isTimeMachine: true },
    ];
    
  }
  goToPage(url: string) {
    this.router.navigate([url]);
  }
}
