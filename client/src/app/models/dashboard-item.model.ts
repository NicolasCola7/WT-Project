import { GridsterItem } from 'angular-gridster2';
import { Type } from '@angular/core';
export interface DashboardItem extends GridsterItem {
  name: string;
  relativeUrl: string;
  urlImg: string;
  isVisible: boolean;
  isTimeMachine: boolean;
  componentType: () => Promise<Type<any>>;
  data: any;
}
