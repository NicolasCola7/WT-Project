import { Component, Input } from '@angular/core';
import { GridsterComponent, GridsterConfig, GridsterItemComponent } from 'angular-gridster2';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardItem } from '../../models/dashboard-item.model';
import { PreviewLoaderComponent } from '../preview-loader/preview-loader.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  standalone: true,
  imports: [GridsterComponent, 
            GridsterItemComponent, 
            PreviewLoaderComponent,
            CommonModule,
            RouterModule]
})
export class GridComponent {
  options!: GridsterConfig;
  @Input() dashboard: Array<DashboardItem> = [];

  constructor(private router: Router) {}

  ngOnInit() {
    //imposto le opzioni della griglia
    this.options = {
      //elementi con drag & drop e ridimensionabili
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: false,
      },
      //griglia 12x12
      minCols: 2,
      minRows: 3,
      maxCols: 2,
      maxRows: 3,
      setGridSize: true,
      pushItems: false,
      displayGrid: 'none',
      scrollToNewItems: true,
      fixedRowHeight: 350,
      fixedColWidth: 100
    };
  }
}
