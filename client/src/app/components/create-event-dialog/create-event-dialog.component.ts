import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select'; 
import { FormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './create-event-dialog.component.html',
  styleUrl: './create-event-dialog.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule
  ]
})
export class CreateEventDialogComponent {
  originalData = inject(MAT_DIALOG_DATA);
  data = {...this.originalData};
  title: string;
  startDate: Date;
  endDate?: Date;
  allDay: boolean = false;
  location?: string;
  frequency: string = 'NONE';
  repetitionEndType?: 'NEVER' | 'COUNT' | 'UNTIL';
  repetitions?: number | Date;
  isReadOnly: boolean = false;
  constructor(
      public dialogRef: MatDialogRef<CreateEventDialogComponent>,  //riferimento alla fialog
      private dateAdapter: DateAdapter<any>,
      private authService: AuthService,
      private alertService: AlertService,
     ) {
    this.title = this.data.title || '';           
    this.startDate = this.data.startDate || null; 
    this.endDate = this.data.endDate || null;     
    this.allDay = this.data.allday || false;      
    this.location = this.data.location || '';
    this.frequency = this.data.frequency;
    this.repetitionEndType = this.data.repetitionEndType;
    this.repetitions = this.data.repetitions || null;
    this.isReadOnly = this.data.updating;
    this.dateAdapter.setLocale('it');
    this.data.creatorId = this.authService.currentUser._id!;
  }

  onSave(): void {
    //controllo sui campi obbligatori
    if(!this.data.title){
        this.alertService.showError('Titolo obbligatoro');
        return;
    }

    if(!this.data.startDate){
      this.alertService.showError('Data di inizio obbligatoria');
      return;
    }
    
    if(!this.data.endDate && !this.allDay){
      this.alertService.showError('Data di fine obbligatoria');
      return;
    }
    
    if(this.data.frequency !== 'NONE' && !this.data.repetitionEndType) {
      this.alertService.showError('Tipo di ripetizione obbligatoria');
      return;
    }
    
    if(this.data.startDate > this.data.endDate) {
      this.alertService.showError('Data di inizio maggiore di data di fine');
      return;
    }

    if(!this.data.frequency) {
      this.alertService.showError('Ripetizione obbligatoria');
      return;
    }

    if(this.data.frequency !== 'NONE' && this.data.repetitionEndType !== 'NEVER' && !this.data.repetitions) {
      this.alertService.showError('Fine ripetizione obbligatoria');
      return;
    }

    if (this.allDay) {
        this.data.endDate = this.data.startDate;
    }

    this.dialogRef.close(this.data);
  }

  public allDayChange(): void{
    this.allDay = !this.allDay;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}