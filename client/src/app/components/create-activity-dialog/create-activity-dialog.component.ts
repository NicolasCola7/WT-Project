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
  title: string;
  endDate?: Date;
  isReadOnly: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateActivityDialogComponent>,  //riferimento alla fialog
    private dateAdapter: DateAdapter<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.title = data.title;           
    this.endDate = data.endDate;     
    this.isReadOnly = data.updating;
    this.dateAdapter.setLocale('it');
    this.data.creatorId = this.authService.currentUser._id!;
  }


  onSave(): void {
   
    if(!this.data.title){
      this.alertService.showError('Titolo obbligatoro');
      return;
    }

    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}