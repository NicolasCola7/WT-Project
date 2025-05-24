import { Component, Input, OnInit } from '@angular/core';
import { GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponent } from 'angular-gridster2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardItem } from '../../models/dashboard-item.model';
import { PreviewLoaderComponent } from '../preview-loader/preview-loader.component';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  standalone: true,
  imports: [
    GridsterComponent,
    GridsterItemComponent,
    PreviewLoaderComponent,
    CommonModule,
    RouterModule
  ]
})
export class GridComponent implements OnInit {
  options!: GridsterConfig;
  @Input() dashboard: DashboardItem[] = [];
  userId: string = '';

  constructor(private authService: AuthService, private dashboardService: DashboardService) {
    this.userId = this.authService.currentUser._id!;
  }

  ngOnInit(): void {
    this.options = {
      itemChangeCallback: this.onItemChange.bind(this),
      draggable: { enabled: true },
      resizable: { enabled: false },
      minCols: 2,
      minRows: 2,
      maxCols: 2,
      maxRows: 2,
      setGridSize: true,
      pushItems: false,
      displayGrid: 'none',
      scrollToNewItems: true,
      fixedRowHeight: 350,
      fixedColWidth: 100
    };

    //sottoscrivo il componente al suo servizio dedicato
    this.dashboardService.getLayout(this.userId).subscribe(layout => {
      this.dashboard = layout;
    });
  }

  onItemChange(item: GridsterItem, itemComponent: any): void {
    this.dashboardService.saveLayout(this.userId, this.dashboard).subscribe({
      error: err => console.error('Errore nel salvataggio layout:', err)
    });
  }
}
