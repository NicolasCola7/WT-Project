import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
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
  //proprietà della classe
  title: string;
  dateStart: Date;
  dateEnd?: Date;
  allDay: boolean = false;
  place?: string;
  recurrence: string = 'NONE';
  recurrenceEnd?: 'INF' | number | Date;
  isReadOnly: boolean = false;

  constructor(
      public dialogRef: MatDialogRef<CreateEventDialogComponent>,  //riferimento alla fialog
      private dateAdapter: DateAdapter<any>,
      private authService: AuthService,
      private alertService: AlertService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = this.data.title || '';           
    this.dateStart = this.data.dateStart || null; 
    this.dateEnd =this. data.dateEnd || null;     
    this.allDay = this.data.allday || false;      
    this.place = this.data.place || '';
    this.recurrence = this.data.recurrence;
    this.recurrenceEnd = this.data.recurrenceEnd || null;
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

    if(!this.data.dateStart){
      this.alertService.showError('Data di inizio obbligatoria');
      return;
    }

    if(!this.data.dateEnd && !this.allDay){
      this.alertService.showError('Data di fine obbligatoria');
      return;
    }
    
    if(this.data.dateStart > this.data.dateEnd) {
      this.alertService.showError('Data di inizio magiore di data di fine');
      return;
    }

    if(!this.data.recurrence) {
      this.alertService.showError('Ripetizione obbligatoria');
      return;
    }

    if(this.data.recurrence !== 'NONE' && !this.data.recurrenceEnd) {
      this.alertService.showError('Fine ripetizione obbligatoria');
      return;
    }
  
    if (this.allDay) {
        this.data.dateEnd = this.data.dateStart;
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