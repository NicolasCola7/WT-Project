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
    work: new FormControl(30, [Validators.min(1), Validators.max(999)]),
    break: new FormControl(5, [Validators.min(1), Validators.max(999)]),
    cicle: new FormControl(1, [Validators.min(1), Validators.max(10)])
  });

  constructor(private dialogRef: MatDialogRef<SettingsTimerComponent>) { }

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
    const settings: Settings = raw ? JSON.parse(raw) : { work: 30, break: 5, cicle: 5};

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
  
    if (!this.totalMinutes || this.totalMinutes < 40) return; 
  
    const total = this.totalMinutes;
    const scenariTrovati: StudioScenario[] = [];
  
    // Definizione dei limiti
    const maxFocus = 50;
    const maxBreak = 15;
    const minFocus = 15;
    const minBreak = 3;
  
    //loop per generare combinazioni
    for (let work = minFocus; work <= maxFocus; work += 5) {
      for (let pause = minBreak; pause <= maxBreak; pause += 2) {
        // Regola: pause deve essere < focus
        if (pause >= work) continue;
  
        //Calcola quanti cicli completi entrano nel tempo totale. Se ne entra meno di uno, scarta lo scenario.
        const cicloTime = work + pause;
        const cicli = Math.floor(total / cicloTime);
        if (cicli < 1) continue;
  
        const tempoUsato = cicli * cicloTime;
        const efficienza = tempoUsato / total;
  
        // Se utilizza meno del 50% del tempo o il ciclo singolo è troppo vicino al totale, lo scartiamo
        if (efficienza < 0.5) continue;
  
        scenariTrovati.push({
          work,
          break: pause,
          cicle: cicli,
          total: tempoUsato
        });
      }
    }
  
    //Filtra gli scenari validi e li tipizza come Required
    const scenariValidi = scenariTrovati.filter(s => s.total !== undefined) as Required<StudioScenario>[];

    scenariValidi.sort((a, b) => {
    const effA = a.total / total;
    const effB = b.total / total;
    if (effB !== effA) return effB - effA;           // Priorità: efficienza
    if (b.cicle !== a.cicle) return b.cicle - a.cicle; // Secondo criterio: più cicli
    return b.total - a.total;                        // Terzo: più tempo usato
  });

    this.scenari = scenariValidi.slice(0, 3);
  }  
}
