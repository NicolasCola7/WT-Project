import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeMachineService } from '../../services/time-machine.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-time-machine',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './time-machine.component.html',
  styleUrls: ['./time-machine.component.css', '../../../assets/css/button.css']
})
export class TimeMachineComponent implements OnInit, OnDestroy {
  currentDate!: Date;
  private subscription!: Subscription;
  @Input() isPreviewMode = false;

  constructor(private timeMachineService: TimeMachineService) {}

  ngOnInit(): void {
    this.subscription = this.timeMachineService.currentDate$.subscribe(date => {
      this.currentDate = date;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goBack(): void {
    this.timeMachineService.goBack();
  }

  goForward(): void {
    this.timeMachineService.goForward();
  }

  onDateChange(event: any): void {
    const [year, month, day] = event.target.value.split('-').map(Number);
    const newDate = new Date(year, month - 1, day);
    this.timeMachineService.updateDateOnly(newDate);
  }

  onTimeChange(event: any): void {
    const [hours, minutes] = event.target.value.split(':').map(Number);
    this.timeMachineService.updateTimeOnly(hours, minutes);
  }

  resetToNow(): void {
    this.timeMachineService.resetToNow();
  }

  formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
