import { GridsterItem } from 'angular-gridster2';
export interface DashboardItem extends GridsterItem {
  name: string;
  relativeUrl: string;
  urlImg: string;
  isTimeMachine: boolean;
}
