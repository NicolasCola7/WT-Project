import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsTimerComponent } from '../settings-timer/settings-timer.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Settings, SETTINGS_KEY, TimerMode } from '../../models/settings.model';
import { TimerComponent } from '../timer/timer.component';

@Component({
  selector: 'app-page-timer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TimerComponent],
  templateUrl: './page-timer.component.html',
  styleUrls: ['./page-timer.component.css','../../../assets/css/button.css']
})
export class PageTimerComponent implements OnInit {
  sessions: boolean[] = [false, false, false, false, false];
  settings!: Settings;
  currentIntervalDuration!: number;
  currentTimerMode: TimerMode = 'Focus';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadSettings();
    this.currentIntervalDuration = this.settings?.work || 25;
  }

  onSessionFinish(): void {
    if (this.currentTimerMode === 'Focus') {
      this.sessions[this.sessions.indexOf(false)] = true;
      this.currentIntervalDuration = this.settings?.break || 25;
    } else {
      this.currentIntervalDuration = this.settings?.work || 5;
    }
    this.toggleTimerMode();
  }

  toggleTimerMode(): void {
    this.currentTimerMode = this.currentTimerMode === 'Focus' ? 'Riposo' : 'Focus';
  }

  loadSettings(): void {
    const raw = localStorage.getItem(SETTINGS_KEY);
    this.settings = raw ? JSON.parse(raw) : { work: 25, break: 5 };
  }
  

  openSettings(): void {
    const dialogRef = this.dialog.open(SettingsTimerComponent, {
      panelClass: 'no-padding',
      data: this.settings,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSettings();
        this.currentIntervalDuration = this.settings?.work || 25;
      }
    });
  }
}
