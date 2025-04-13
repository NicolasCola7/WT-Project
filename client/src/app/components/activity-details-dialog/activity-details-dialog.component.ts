import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-activity-details-dialog',
  imports: [
    MatIconModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './activity-details-dialog.component.html',
  styleUrl: './activity-details-dialog.component.css'
})
export class ActivityDetailsDialogComponent {
  dialogRef = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  dueDate =  new Date(this.data.dueDate).toLocaleDateString('it-IT', { 
    hour12: false, 
    hour: '2-digit',
    minute: '2-digit'
  });
  overdue =  new Date(this.data.dueDate).getTime() < Date.now();


  onDelete() {
    this.dialogRef.close('delete');
  }

  onCancel() {
    this.dialogRef.close();
  }

  onEdit() {
    this.dialogRef.close('edit');
  }
}
