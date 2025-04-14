import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsTimerComponent } from '../settings-timer/settings-timer.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Settings, SETTINGS_KEY, TimerMode } from '../../models/settings.model';
import { TimerComponent } from '../timer/timer.component';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../services/alert.service';

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
  showAnimation = false;
  isForcedEndSession!: boolean;

  constructor(private dialog: MatDialog, private alertService: AlertService) {}

  //quando il componente viene inizializzato carico i settings iniziali
  ngOnInit(): void {
    this.loadSettings();
    this.currentIntervalDuration = this.settings.work;
    this.cicles = Array(this.settings.cicle).fill(false);
  }
  
  EndSession() {
    // Ripristina completamente i cicli a "false"
    this.cicles = Array(this.settings.cicle).fill(false);

    if (this.timerComponent) {
      this.timerComponent.resetTimer();
    }

    // Resetta il timer e la modalità
    this.currentIntervalDuration = this.settings.work || 30;
    this.currentTimerMode = 'Focus';
    this.isSessionActive = false;
  }
  forcedEndSession(){
    this.isForcedEndSession = true;
    this.timerComponent.pauseTimer();
    this.alertService.showQuestion("Sei sicuro di voler annullare i progressi svolti in questa sessione di studio?", () => this.EndSession(), () =>{
      this.timerComponent.startTimer();
    });
  }

  //metodo richiamato ogni volta che scade un timer
  onCicleFinish(): void {
    if (this.currentTimerMode === 'Focus') {
      //aggiorno il flag a true per il ciclo corrente che è appena stato completato
      this.cicles[this.cicles.indexOf(false)] = true;
  
      //se la condizione è vera significa che la sessione è finita
      if (this.cicles.every(cicle => cicle === true)) {
        this.isSessionActive = false;
        this.showAnimation = true;
  
        // Nascondi l'animazione dopo 5 secondi
        setTimeout(() => {
          this.showAnimation = false;
        }, 5000);
  
        this.EndSession();
        return;
      }
  
      this.currentIntervalDuration = this.settings.break || 30;
    } else {
      this.currentIntervalDuration = this.settings.work || 5;
    }
  
    //inverto la modalità del timer
    this.toggleTimerMode();
  }

  toggleTimerMode(): void {
    if (!this.isSessionActive) {
      this.isSessionActive = true;
    }
    this.currentTimerMode = this.currentTimerMode === 'Focus' ? 'Riposo' : 'Focus';
  }

  loadSettings(): void {
    //carico gli ultimi settings impostati dall'utente altrimenti imposto quelli di default
    const raw = localStorage.getItem(SETTINGS_KEY);
    this.settings = raw ? JSON.parse(raw) : { work: 30, break: 5 , cicle : 5};
  }
  

  openSettings(): void {
    //apro il componente
    const dialogRef = this.dialog.open(SettingsTimerComponent, {
      panelClass: 'no-padding',
      data: this.settings,
    });

    //callback richiamata dopo la chiusura della dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //aggiorno il componente con gli ultimi dati inseriti nella dialog
        this.loadSettings();
        this.currentIntervalDuration = this.settings?.work || 30;
        this.cicles = Array(this.settings.cicle).fill(false);
      }
    });
  }
}
