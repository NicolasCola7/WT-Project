import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Settings, SETTINGS_KEY } from '../../models/settings.model';

@Component({
  selector: 'app-settings-timer',
  imports: [ReactiveFormsModule],
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

  ngOnInit(): void {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const settings: Settings = raw ? JSON.parse(raw) : { work: 30, break: 5, cicle: 5 };

    if (settings) {
      this.settingsForm.setValue(settings);
    }
  }

  /**
   * Close the settings dialog. Save changes if called from the 'Save' button
   * @param saveChanges flag telling if changes must be saved
   */
  close(saveChanges = false): void {
    if (saveChanges) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settingsForm.value));
    }
    this.dialogRef.close(saveChanges);
  }
}
