import { Component } from '@angular/core';
import {GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponent} from 'angular-gridster2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


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
  dashboard!: Array<GridsterItem & { name: string } & {relativeUrl: string}>;

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
      //griglia 6x6
      minCols: 6,
      minRows: 6,
      maxCols: 6,
      maxRows: 6,
      setGridSize: true,
      pushItems: false,
      displayGrid: 'none',
      scrollToNewItems: true,
    };
    //componenti della dashboard
    this.dashboard = [
      { cols: 2, rows: 3, y: 0, x: 0, name: 'Calendario', relativeUrl: '/calendar' },
      { cols: 2, rows: 3, y: 0, x: 2, name: 'Timer', relativeUrl: '/timer'},
      { cols: 2, rows: 3, y: 0, x: 4, name: 'Note', relativeUrl: '/note' },
      { cols: 2, rows: 3, y: 3, x: 0, name: 'Time Machine', relativeUrl: '/time-machine' },
      { cols: 2, rows: 3, y: 3, x: 2, name: 'Extra 1', relativeUrl: '/extra1' },
      { cols: 2, rows: 3, y: 3, x: 4, name: 'Extra 2', relativeUrl: '/extra2' },
    ];
  }
}
