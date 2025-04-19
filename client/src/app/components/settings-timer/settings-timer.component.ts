import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Settings, SETTINGS_KEY } from '../../models/settings.model';
import { StudioScenario } from '../../models/studio-scenario.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings-timer',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatIconModule],
  templateUrl: './settings-timer.component.html',
  styleUrls: ['./settings-timer.component.css','../../../assets/css/button.css']
})
export class SettingsTimerComponent implements OnInit{
  settingsForm = new FormGroup({
    work: new FormControl(30, Validators.min(1)),
    break: new FormControl(5, Validators.min(1)),
    cicle: new FormControl(1, [Validators.min(1), Validators.max(10)])
  });

  constructor(private dialogRef: MatDialogRef<SettingsTimerComponent>,) { }

  mode: 'manuale' | 'automatica' = 'manuale';
  totalMinutes: number | null = null;
  selectedScenario!: StudioScenario;

  scenari: StudioScenario[] = [];
  /*
    quando viene inzializzato il componente carico i settings di default oppure quelli impostati
    dall'utente in precedenza
  */
  ngOnInit(): void {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const settings: Settings = raw ? JSON.parse(raw) : { work: 30, break: 5, cicle: 5 };

    if (settings) {
      this.settingsForm.setValue(settings);
    }
  }

  /**
  * Chiude la finestra di dialogo delle impostazioni. Salva le modifiche se richiamate dal pulsante "Salva".
  * @param saveChanges è che indica se le modifiche devono essere salvate.
  */
  close(saveChanges = false): void {
    if(saveChanges){
      if (this.mode == 'manuale') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settingsForm.value));
      }else{
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.selectedScenario));
      }
    }
    this.dialogRef.close(saveChanges);
  }

  generateScenarios(): void {
    this.scenari = [];
  
    //se il tempo è minore di 20 minuti non ha senso creare uno scenario
    if (!this.totalMinutes || this.totalMinutes < 20) return;
  
    const total = this.totalMinutes;
    const scenariTrovati: any[] = [];
  
    /*
      viene esplorata una griglia di combinazioni possibili:
        . work: da 15 a 60 minuti, a step di 5
        . pause: da 3 a 20 minuti, a step di 2
    */
    for (let work = 15; work <= 60; work += 5) {
      for (let pause = 3; pause <= 20; pause += 2) {
        // scarto pause più lunghe del focus
        if (pause >= work) continue; 
  
        //calcolo della durata di un ciclo e del numero di cicli da fare
        const cicloTime = work + pause;
        const cicli = Math.floor(total / cicloTime);
  
        //se il numero di cicli è minore di 1 non ha senso proporlo
        if (cicli < 1) continue;
  
        const tempoUsato = cicli * cicloTime;
  
        scenariTrovati.push({
          work: work,
          break: pause,
          cicle: cicli,
          total: tempoUsato
        });
      }
    }
  
    // ordina per tempoUsato decrescente (più utilizza il tempo disponibile = meglio)
    scenariTrovati.sort((a, b) => b.total - a.total);
  
    // seleziona i primi 3 scenari più "efficienti"
    this.scenari = scenariTrovati.slice(0, 3);
  }
}
