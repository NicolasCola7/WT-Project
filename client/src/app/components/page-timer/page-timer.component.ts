import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsTimerComponent } from '../settings-timer/settings-timer.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Settings, SETTINGS_KEY, TimerMode } from '../../models/settings.model';
import { TimerComponent } from '../timer/timer.component';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../services/alert.service';
import { PomodoroState, POMODORO_STATE_KEY } from '../../models/pomodoro-state.model';
import { CanComponentDeactivate } from '../../models/can-component-deactivate.model';

@Component({
  selector: 'app-page-timer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TimerComponent, MatIconModule],
  templateUrl: './page-timer.component.html',
  styleUrls: ['./page-timer.component.css','../../../assets/css/button.css']
})
export class PageTimerComponent implements OnInit , OnDestroy, CanComponentDeactivate{
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;
  cicles: boolean[] = [false, false, false, false, false];
  settings: Settings = { work: 30, break: 5 , cicle: 5};
  currentIntervalDuration: number = this.settings.work;
  currentTimerMode: TimerMode = 'Focus';
  isSessionActive: boolean = false;
  showAnimation = false;
  isForcedEndSession!: boolean;
  @Input() isPreviewMode = false;

  constructor(private dialog: MatDialog, private alertService: AlertService) {}

  //quando il componente viene inizializzato carico i settings iniziali
  ngOnInit(): void {
    this.loadSettings();
    this.currentIntervalDuration = this.settings.work;
    this.cicles = Array(this.settings.cicle).fill(false);
    
    const savedState = localStorage.getItem(POMODORO_STATE_KEY);
    
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.currentTimerMode = state.sessionType || 'Focus';
        this.cicles = state.cicles || this.cicles;
        this.isSessionActive = state.isSessionActive || false;

        // Determina la durata corretta basata sulla modalità
        this.currentIntervalDuration = this.currentTimerMode === 'Focus' 
          ? this.settings.work 
          : this.settings.break;

        // Valida il tempo rimanente per evitare valori inconsistenti
        let remaining = state.remainingTime;
        const maxTime = this.currentIntervalDuration * 60;
        
        // Se il tempo rimanente è superiore alla durata massima, resetta
        if (remaining > maxTime || remaining < 0) {
          remaining = maxTime;
        }

        setTimeout(() => {
          this.timerComponent.setRemainingTime(remaining);
        }, 0);
        
      } catch (error) {
        console.error('Errore nel caricamento dello stato salvato:', error);
        // In caso di errore, inizializza con valori di default
        this.initializeDefaultTimer();
      }
    } else {
      this.initializeDefaultTimer();
    }
  }

  //metodo per inizializzare il timer con valori di default
  private initializeDefaultTimer(): void {
    this.currentIntervalDuration = this.settings.work;
    this.currentTimerMode = 'Focus';
    this.isSessionActive = false;
    
    setTimeout(() => {
      this.timerComponent.setRemainingTime(this.currentIntervalDuration * 60);
    }, 0);
  }

  //metodo che ritorna true 
  get isNotFinishedSession(){
    return this.cicles.includes(false);
  }

  get cicleFinished(): Number{
    return this.cicles.filter(c => c).length;
  }

  ngOnDestroy(): void {
    if (this.timerComponent) {
      this.timerComponent.pauseTimer();
      
      // Assicurati che il tempo rimanente sia valido
      let remainingTime = this.timerComponent.remainingTime;
      const maxTime = this.currentIntervalDuration * 60;
      
      // Valida il tempo rimanente
      if (remainingTime > maxTime || remainingTime < 0) {
        remainingTime = maxTime;
      }

      const state: PomodoroState = {
        remainingTime: remainingTime,
        sessionType: this.currentTimerMode,
        timestamp: Date.now(),
        cicles: this.cicles,
        isCounting: this.timerComponent.isCounting,
        isSessionActive: this.isSessionActive
      };

      localStorage.setItem(POMODORO_STATE_KEY, JSON.stringify(state));
    }
  }

  canDeactivate(): Promise<boolean> | boolean {
    //chiedo conferma di chiusura soltanto se il timer è attivo
    if(!this.timerComponent.isCounting){
      return true;
    }
    this.timerComponent.pauseTimer();
    return new Promise((resolve) => {
      this.alertService.showQuestion(
        "Vuoi davvero uscire? Il timer verrà messo in pausa",
        () => resolve(true),  
        () => resolve(false)
      );
    });
  }

  
  EndSession(): void {
    // Ripristina completamente i cicli a "false"
    this.cicles = Array(this.settings.cicle).fill(false);

    if (this.timerComponent) {
      this.timerComponent.resetTimer();
    }

    // Resetta il timer e la modalità
    this.currentIntervalDuration = this.settings.work || 30;
    this.currentTimerMode = 'Focus';
    this.isSessionActive = false;
    
    // Rimuovi lo stato salvato
    localStorage.removeItem(POMODORO_STATE_KEY);
    
    // Assicurati che il timer sia inizializzato correttamente
    setTimeout(() => {
      if (this.timerComponent) {
        this.timerComponent.setRemainingTime(this.currentIntervalDuration * 60);
      }
    }, 0);
  }

  forcedEndSession(){
    this.isForcedEndSession = true;
    this.timerComponent.pauseTimer();
    this.alertService.showQuestion("Sei sicuro di voler annullare i progressi svolti in questa sessione di studio?", () => this.EndSession(), () =>{
      this.timerComponent.startTimer();
    });
    this.isForcedEndSession = false;
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
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      // Controllo anche se il valore è la stringa "undefined"
      if (!raw || raw === 'undefined') {
        this.settings = { work: 30, break: 5, cicle: 5 };
      } else {
        this.settings = JSON.parse(raw);
      }
    } catch (error) {
      console.error("Errore nel parsing delle impostazioni:", error);
      this.settings = { work: 30, break: 5, cicle: 5 };
    }
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
