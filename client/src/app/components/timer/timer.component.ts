import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerMode } from '../../models/settings.model';

@Component({
  selector: 'app-timer',
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css','../../../assets/css/button.css']
})
export class TimerComponent implements OnInit, OnChanges {
  /** Current interval duration passed from the parent component */
  @Input() intervalDuration = 25;
  /** Current timer mode passed from the parent component */
  @Input() timerMode: TimerMode = 'Focus';
  /** Size of the timer itself. Based on this value styles of the circle are calculated */
  @Input() size = 350;

  /** Event emitted when a session if finished */
  @Output() sessionFinish = new EventEmitter<void>();

  /** Flag if the counter is on or off at the moment */
  isCounting = false;
  /** Value of minutes displayed in the timer at the moment */
  currentValueMinutes = this.intervalDuration;
  /** Value of seconds displayed in the timer at the moment */
  currentValueSeconds = 0;

  /** Counting interval got from setInterval() function */
  countingInterval!: number;

  /** Length of the timer circle */
  circleBaseLength!: number;
  /** Length of the filled part of the timer circle. Needed for styles */
  circleFillLength = 0;
  /** Part of the circle filled in one second. Value is based on the current interval duration */
  fractionsInOneSecond!: number;

  /** Notification sound */
  audio!: HTMLAudioElement;

  constructor() { }

  ngOnInit(): void {
    this.calculateCircleLength();
    this.calculateFractionsInOneSecond();
    this.loadNotificationSound();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['intervalDuration']) {
      this.currentValueMinutes = changes['intervalDuration'].currentValue;
      this.calculateFractionsInOneSecond();
    }
    if (changes['timerMode'] && !changes['timerMode'].firstChange) {
      this.startTimer();
    }
  }

  calculateCircleLength(): void {
    this.circleBaseLength = this.size * Math.PI;
  }

  calculateFractionsInOneSecond(): void {
    this.fractionsInOneSecond = this.circleBaseLength / (this.intervalDuration * 60);
  }

  /**
   * Start time counting. Change isCounting flag
   */
  startTimer(): void {
    this.isCounting = true;
    this.countingInterval = window.setInterval(() => {
      this.subtractSecond();
    }, 1000);
  }

  /**
   * Pause the counting
   */
  pauseTimer(): void {
    this.isCounting = false;
    this.circleFillLength -= this.fractionsInOneSecond;
    clearInterval(this.countingInterval);
  }

  /**
   * Stop and reset the timer
   */
  resetTimer(): void {
    this.pauseTimer();
    this.currentValueMinutes = this.intervalDuration;
    this.currentValueSeconds = 0;
    this.circleFillLength = 0;
  }

  /**
   * Subtract a second from the current timer value
   */
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

  /**
   * Finish session when timer came to 0
   */
  finishSession(): void {
    this.playNotificationSound();
    this.resetTimer();
    this.sessionFinish.emit();
  }

  /**
   * Load the audio of the notification sound played always at the session finish
   */
  loadNotificationSound(): void {
    this.audio = new Audio();
    this.audio.src = '../../../assets/goes-without-saying-608.mp3';
    this.audio.load();
  }

  /**
   * Play notification sound
   */
  playNotificationSound(): void {
    this.audio.play();
  }

  /**
   * Change state of the counter to the opposite: start/pause
   */
  toggleCounter(): void {
    this.isCounting ? this.pauseTimer() : this.startTimer();
  }

  /**
   * Listen for the Space key press to start/pause the counter
   */
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      this.toggleCounter();
    }
  }
}
