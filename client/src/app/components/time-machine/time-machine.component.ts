import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeMachineService } from '../../services/time-machine.service';

@Component({
  selector: 'app-time-machine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-machine.component.html',
  styleUrls: ['./time-machine.component.css', '../../../assets/css/button.css']
})
export class TimeMachineComponent implements OnInit, OnDestroy {
  currentDate: Date;
  private intervalId: any;

  constructor(private timeMachineService: TimeMachineService) {
    this.currentDate = this.timeMachineService.getCurrentDate();
  }

  ngOnInit(): void {
    this.startRealTime();
  }

  ngOnDestroy(): void {
    this.stopRealTime();
  }

  goBack(): void {
    this.currentDate = new Date(this.currentDate.getTime() - 3600000);
    this.timeMachineService.setDate(this.currentDate);
    this.restartRealTime();
  }

  goForward(): void {
    this.currentDate = new Date(this.currentDate.getTime() + 3600000);
    this.timeMachineService.setDate(this.currentDate);
    this.restartRealTime();
  }

  onDateChange(event: any): void {
    const [year, month, day] = event.target.value.split('-').map(Number);
    const hours = this.currentDate.getHours();
    const minutes = this.currentDate.getMinutes();
    this.currentDate = new Date(year, month - 1, day, hours, minutes);
    this.timeMachineService.setDate(this.currentDate);
    this.restartRealTime();
  }

  onTimeChange(event: any): void {
    const [hours, minutes] = event.target.value.split(':').map(Number);
    this.currentDate.setHours(hours, minutes);
    this.timeMachineService.setDate(new Date(this.currentDate));
    this.restartRealTime();
  }

  resetToNow(): void {
    this.currentDate = new Date();
    this.timeMachineService.setDate(this.currentDate);
    this.restartRealTime();
  }

  formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  private startRealTime(): void {
    this.stopRealTime();
    this.intervalId = setInterval(() => {
      this.currentDate = new Date(this.currentDate.getTime() + 1000);
      this.timeMachineService.setDate(this.currentDate);
    }, 1000);
  }

  private stopRealTime(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private restartRealTime(): void {
    this.startRealTime();
  }
}
