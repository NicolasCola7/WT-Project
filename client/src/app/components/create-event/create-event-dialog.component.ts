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
  title: string = '';
  dateStart: null = null;
  dateEnd: null = null;
  allDay: boolean = false;
  place: string = '';
  notes: string = '';
  recurrence: string = '';
  recurrenceEnd: null = null;
  authorUsername: string | null = null;
  isReadOnly: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateEventDialogComponent>,  //riferimento alla fialog
    private dateAdapter: DateAdapter<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // imposta i valori iniziali in base ai dati passati
    this.title = data.title || '';           
    this.dateStart = data.dateStart || null; 
    this.dateEnd = data.dateEnd || null;     
    this.allDay = data.allday || false;      
    this.place = data.place || '';
    this.notes = data.notes || '';
    this.recurrence = data.recurrence || '';
    this.recurrenceEnd = data.recurrenceEnd || null;
    this.isReadOnly = data.updating;
    this.dateAdapter.setLocale('it');
  }

  ngOnInit(): void {

    //this.authorUsername = this.localStorageService.getItem('username');
   
  }

  onSave(): void {
    const inputError = document.getElementById('inputError');

    //controllo sui campi obbligatori
    if(!this.data.title || !this.data.dateStart || (!this.data.dateEnd && !this.allDay) || !this.data.recurrence){
      if(inputError){
        inputError.textContent = 'Titolo, data e ripetizione sono obbligatori!';
      }
     //controllo date 
    }else if(this.data.dateStart > this.data.dateEnd) {
      if(inputError){
        inputError.textContent = 'Non può finire prima di iniziare!';
      }
    } else {
      if (this.allDay) {
        this.data.dateEnd = this.data.dateStart;
      }
      
      this.dialogRef.close(this.data);
    }

  }

  public allDayChange(): void{

    this.allDay = !this.allDay;
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void{
    this.dialogRef.close(false);
  }

}