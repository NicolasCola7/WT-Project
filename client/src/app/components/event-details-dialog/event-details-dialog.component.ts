import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-event-details-dialog',
  imports: [
    MatIconModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './event-details-dialog.component.html',
  styleUrl: './event-details-dialog.component.css'
})
export class EventDetailsDialogComponent {
  dialogRef = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  startDate = this.data.start.toLocaleDateString('it-IT', { 
    hour12: false, 
    hour: '2-digit',
    minute: '2-digit'
  });
  endDate = this.data.end ? this.data.end.toLocaleDateString('it-IT', { 
    hour12: false, 
    hour: '2-digit',
    minute: '2-digit'
  }) : undefined;

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


