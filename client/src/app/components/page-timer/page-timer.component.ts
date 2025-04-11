import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsTimerComponent } from '../settings-timer/settings-timer.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Settings, SETTINGS_KEY, TimerMode } from '../../models/settings.model';
import { TimerComponent } from '../timer/timer.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-timer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TimerComponent, MatIconModule],
  templateUrl: './page-timer.component.html',
  styleUrls: ['./page-timer.component.css','../../../assets/css/button.css']
})
export class PageTimerComponent implements OnInit {
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;
  cicles: boolean[] = [false, false, false, false, false];
  settings: Settings = { work: 30, break: 5 , cicle: 5};
  currentIntervalDuration: number = this.settings.work;
  currentTimerMode: TimerMode = 'Focus';
  isSessionActive: boolean = false;


  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {

    this.loadSettings();
    this.currentIntervalDuration = this.settings.work;
    this.cicles = Array(this.settings.cicle).fill(false);
  }
  
  forcedEndSession() {
    // Ripristina completamente i cicli a "false"
    this.cicles = Array(this.settings.cicle).fill(false);

    if (this.timerComponent) {
      this.timerComponent.resetTimer();
    }

    // Resetta il timer e la modalità
    this.currentIntervalDuration = this.settings?.work || 30;
    this.currentTimerMode = 'Focus';  // Imposta la modalità iniziale a 'Focus'
    this.isSessionActive = false;
  }

  onCicleFinish(): void {
    if (this.currentTimerMode === 'Focus') {
      this.cicles[this.cicles.indexOf(false)] = true;

      // Verifica se tutti gli elementi nell'array cicles sono true
      if (this.cicles.every(cicle => cicle === true)) {
        console.log('Tutti i cicli sono completi. Esecuzione terminata.');
        this.isSessionActive = false;
        this.forcedEndSession();
        return;
      }
      
      this.currentIntervalDuration = this.settings?.break || 30;
    } else {
      this.currentIntervalDuration = this.settings?.work || 5;
    }
    this.toggleTimerMode();
  }

  toggleTimerMode(): void {
    if (!this.isSessionActive) {
      this.isSessionActive = true;
    }
    this.currentTimerMode = this.currentTimerMode === 'Focus' ? 'Riposo' : 'Focus';
  }

  loadSettings(): void {
    const raw = localStorage.getItem(SETTINGS_KEY);
    this.settings = raw ? JSON.parse(raw) : { work: 30, break: 5 , cicle : 5};
  }
  

  openSettings(): void {
    const dialogRef = this.dialog.open(SettingsTimerComponent, {
      panelClass: 'no-padding',
      data: this.settings,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //aggiorno il controller con gli ultimi dati inseriti nella dialog
        this.loadSettings();
        this.currentIntervalDuration = this.settings?.work || 30;
        this.cicles = Array(this.settings.cicle).fill(false);
      }
    });
  }
}
