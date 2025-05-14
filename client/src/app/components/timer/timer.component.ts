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

  //circonferenza del cerchio del timer
  circleBaseLength!: number;
  //lunghezza della parte 'avanzata' del cerchio del timer
  circleFillLength = 0; 
  //parte del circonferenza riempita in un secondo
  fractionsInOneSecond!: number;

  
  audio!: HTMLAudioElement;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.calculateCircleLength();
    this.calculateFractionsInOneSecond();
    this.loadNotificationSound();
  }

  //metodo richiamato ogni qualvolta che il componente timer subisce un cambiamento
  ngOnChanges(changes: SimpleChanges): void {
    //controllo se esiste un cambiamento per la variabile intervalDuration
    if (!!changes['intervalDuration']) {
      this.currentValueMinutes = changes['intervalDuration'].currentValue;
      this.calculateFractionsInOneSecond();
    }
    //se ci sono stati cambiamenti, ma non è il primo cambiamento 
    //(ovvero quello che avviene all'inizializzazione) e non è stato premuto il tasto di reset di sessione
    //facciamo partire il timer
    if (changes['timerMode'] && !changes['timerMode'].firstChange && !this.isForcedEndSession) {
      this.startTimer();
    }
  }
  calculateCircleLength(): void {
    this.circleBaseLength = this.size * Math.PI;
  }

  calculateFractionsInOneSecond(): void {
    this.fractionsInOneSecond = this.circleBaseLength / (this.intervalDuration * 60);
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
    //stoppo il timer
    clearInterval(this.countingInterval);
  }

  //metodo invoca quando l'utente clicca il bottone per resettare il ciclo di quel timer
  resetTimer(): void {
    this.pauseTimer();
    this.currentValueMinutes = this.intervalDuration;
    this.currentValueSeconds = 0;
    this.circleFillLength = 0;
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
    this.audio = new Audio();
    this.audio.src = 'assets/goes-without-saying-608.mp3';
    this.audio.load();
  }
  
  playNotificationSound(): void {
    this.audio.play();
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
    const totalSeconds = this.intervalDuration * 60;
    const elapsedSeconds = totalSeconds - seconds;
    this.circleFillLength = this.fractionsInOneSecond * elapsedSeconds;
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
    this.cdRef.detectChanges(); // forza il ricalcolo dei getter
  }
}
