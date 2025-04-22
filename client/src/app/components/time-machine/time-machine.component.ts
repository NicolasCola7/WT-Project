import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeMachineService } from '../../services/time-machine.service';

@Component({
  selector: 'app-time-machine',
  imports:[CommonModule],
  templateUrl: './time-machine.component.html',
  styleUrls: ['./time-machine.component.css', '../../../assets/css/button.css']
})
export class TimeMachineComponent {
  currentDate: Date = new Date();
  @Output() dateChanged = new EventEmitter<Date>();

  constructor(private timeMachineService: TimeMachineService) {
    this.timeMachineService.setDate(this.currentDate);
  }

  goBack(): void {
    this.currentDate = new Date(this.currentDate.getTime() - 3600000); // -1 ora
    this.timeMachineService.setDate(this.currentDate);
    this.dateChanged.emit(this.currentDate);
  }

  goForward(): void {
    this.currentDate = new Date(this.currentDate.getTime() + 3600000); // +1 ora
    this.timeMachineService.setDate(this.currentDate);
    this.dateChanged.emit(this.currentDate);
  }

  onDateChange(event: any): void {
    const [year, month, day] = event.target.value.split('-').map(Number);
    const hours = this.currentDate.getHours();
    const minutes = this.currentDate.getMinutes();
    this.currentDate = new Date(year, month - 1, day, hours, minutes);
    this.timeMachineService.setDate(this.currentDate);
    this.dateChanged.emit(this.currentDate);
  }

  onTimeChange(event: any): void {
    const [hours, minutes] = event.target.value.split(':').map(Number);
    this.currentDate.setHours(hours, minutes);
    this.timeMachineService.setDate(new Date(this.currentDate));
    this.dateChanged.emit(this.currentDate);
  }

  formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  resetToNow(): void {
    this.currentDate = new Date();
    this.timeMachineService.setDate(this.currentDate);
    this.dateChanged.emit(this.currentDate);
  }
}
