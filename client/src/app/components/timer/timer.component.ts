import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerMode } from '../../models/settings.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-timer',
  imports: [CommonModule, MatIconModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css','../../../assets/css/button.css']
})
export class TimerComponent implements OnInit, OnChanges{
  //Durata dell'intervallo di tempo 'focus' passato dal componente padre: PageTimerComponent
  @Input() intervalDuration = 30;
  //Modalità del timer passata dal componente padre: PageTimerComponent
  @Input() timerMode: TimerMode = 'Focus';
  @Input() size = 350;
  //informazione sul fatto che è stato premuto il bottone reset sessione
  @Input() isForcedEndSession!: boolean;

  //evento emesso quando finisce un ciclo 'focus'
  @Output() sessionFinish = new EventEmitter<void>();
  //evento emesso quando cambia lo stato del timer
  @Output() countingStatusChanged = new EventEmitter<boolean>();
  @Input() isPreviewMode = false;
  @Input() isWidgetMode = false;

  //flag che mi dice se il timer è accesso
  isCounting = false;
  currentValueMinutes = this.intervalDuration;
  
  //secondi mostrati a schermo nel timer
  currentValueSeconds = 0;
  //numero di intervalli presi dalla funzion setInterval
  countingInterval!: number;
  //lunghezza della parte 'avanzata' del cerchio del timer
  circleFillLength = 0; 

  
  audio!: HTMLAudioElement;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.circleBaseLength;
    this.fractionsInOneSecond;
    this.loadNotificationSound();
  }

  //metodo richiamato ogni qualvolta che il componente timer subisce un cambiamento
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['intervalDuration']) {
      this.currentValueMinutes = changes['intervalDuration'].currentValue;
      // Sincronizza la progress bar dopo il cambio di durata
      this.syncProgressBar();
    }
    
    if (changes['size']) {
      // Ricalcola la progress bar quando cambia la dimensione
      this.syncProgressBar();
    }
    
    if (changes['timerMode'] && !changes['timerMode'].firstChange && !this.isForcedEndSession) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }

  //metodo invocato quando l'utente clicca play
  startTimer(): void {
    this.isCounting = true;
    //notifico PageTimerComponent che lo stato del timer è cambiato
    this.countingStatusChanged.emit(this.isCounting);

    this.countingInterval = window.setInterval(() => {
      this.subtractSecond();
    }, 1000);
  }

  //metodo invocato quando l'utente mette in pausa il timer
  pauseTimer(): void {
    this.isCounting = false;
    clearInterval(this.countingInterval);
    
    // Sincronizza la progress bar quando si mette in pausa
    this.syncProgressBar();
  }

  //metodo invoca quando l'utente clicca il bottone per resettare il ciclo di quel timer
  resetTimer(): void {
    this.pauseTimer();
    this.currentValueMinutes = this.intervalDuration;
    this.currentValueSeconds = 0;
    this.circleFillLength = 0; // Assicurati che sia esattamente 0
    
    // Forza il change detection
    this.cdRef.detectChanges();
  }

  //metodo invocato quando l'utente forza il passaggio successivo alla fase successiva
  next(): void {
    this.finishSession();
  }

  //metodo che sottrae un secondo al timer
  subtractSecond(): void {
    if (this.currentValueMinutes === 0 && this.currentValueSeconds === 1) {
      this.finishSession();
      return;
    }

    if (this.currentValueSeconds === 0) {
      this.currentValueMinutes--;
      this.currentValueSeconds = 59;
    } else {
      this.currentValueSeconds--;
    }
    this.circleFillLength += this.fractionsInOneSecond;
  }

  //metodo invocato quando finisce una fase del ciclo
  finishSession(): void {
    this.playNotificationSound();
    this.resetTimer();
    //notifico il PageTimerComponent degli eventi accaduti
    this.countingStatusChanged.emit(this.isCounting);
    this.sessionFinish.emit();
  }
  
  loadNotificationSound(): void {
    this.audio = new Audio('assets/goes-without-saying-608.mp3');
    this.audio.load();
  }
  
  playNotificationSound(): void {
    this.audio?.play().catch(() => {
      console.warn('Impossibile riprodurre il suono.');
    });
  }

  //Cambia lo stato del contatore nell'opposto: avvio/pausa
  toggleCounter(): void {
    this.isCounting ? this.pauseTimer() : this.startTimer();
  }

  /**
   * Espone il tempo rimanente totale in secondi
   */
  get remainingTime(): number {
    return this.currentValueMinutes * 60 + this.currentValueSeconds;
  }

  //circonferenza del cerchio del timer
  get circleBaseLength(): number {
    return this.sizeCircle * Math.PI;
  }

  //parte del circonferenza riempita in un secondo
  get fractionsInOneSecond(): number {
    return this.circleBaseLength / (this.intervalDuration * 60);
  }


  get sizeCircle(): number {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

    if (this.isPreviewMode) {
      // Modalità widget -> dimensioni più contenute
      if (isMobile) {
        return 180;
      } else {
        return 300;
      }
    } else {
      // Modalità schermo intero
      if (isMobile) {
        return 260;
      } else if (isTablet) {
        return 300;
      } else {
        return 350;
      }
    }
  }




  /**
   * Imposta il tempo rimanente (in secondi) e aggiorna il timer e la barra di avanzamento
   * @param seconds - tempo rimanente in secondi
   */
  setRemainingTime(seconds: number): void {
    this.pauseTimer();
    this.currentValueMinutes = Math.floor(seconds / 60);
    this.currentValueSeconds = seconds % 60;
    
    // Calcolo più preciso della progress bar
    const totalSeconds = this.intervalDuration * 60;
    const elapsedSeconds = Math.max(0, totalSeconds - seconds);
    
    // Assicurati che la progress bar non superi mai il 100%
    this.circleFillLength = Math.min(
      this.fractionsInOneSecond * elapsedSeconds,
      this.circleBaseLength
    );
    
    // Forza il change detection per aggiornare la UI
    this.cdRef.detectChanges();
  }

  // metodo per sincronizzare la progress bar
  private syncProgressBar(): void {
    const totalSeconds = this.intervalDuration * 60;
    const currentTotalSeconds = this.currentValueMinutes * 60 + this.currentValueSeconds;
    const elapsedSeconds = Math.max(0, totalSeconds - currentTotalSeconds);
    
    this.circleFillLength = Math.min(
      this.fractionsInOneSecond * elapsedSeconds,
      this.circleBaseLength
    );
  }

  //metodo che ascolta la tastiera che serve per stoppare/avviare il timer con il stato 'spazio'
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      this.toggleCounter();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.isCounting && this.currentValueSeconds > 0) {
      this.setRemainingTime(this.currentValueSeconds);
      this.cdRef.detectChanges();
    }
  }
}
