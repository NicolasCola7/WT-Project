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
  selector: 'app-create-activity-dialog',
  templateUrl: './create-activity-dialog.component.html',
  styleUrl: './create-activity-dialog.component.css',
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
export class CreateActivityDialogComponent {
  //proprietà della classe
  title: string = '';
  dateEnd: null = null;
  creatorId: string | null = null;
  isReadOnly: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateActivityDialogComponent>,  //riferimento alla fialog
    private dateAdapter: DateAdapter<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // imposta i valori iniziali in base ai dati passati
    this.title = data.title || '';           
    this.dateEnd = data.dateEnd || null;     
    this.isReadOnly = data.updating;
    this.dateAdapter.setLocale('it');
  }

  ngOnInit(): void {

    //this.authorUsername = this.localStorageService.getItem('username');
   
  }

  onSave(): void {
    const inputError = document.getElementById('inputError');

    //controllo sui campi obbligatori
    if(!this.data.title || !this.data.dateEnd){
      if(inputError){
        inputError.textContent = 'Titolo  e data obbligatori!';
      }
     //controllo date 
    }else if(Date.now > this.data.dateEnd) {
      if(inputError){
        inputError.textContent = 'Non può finire prima di iniziare!';
      }
    }

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void{
    this.dialogRef.close(false);
  }

}