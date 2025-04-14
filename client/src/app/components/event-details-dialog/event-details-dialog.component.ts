import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
  startDate = this.data.startDate.toLocaleDateString('it-IT', { 
    hour12: false, 
    hour: '2-digit',
    minute: '2-digit'
  });
  endDate = this.data.endDate ? this.data.endDate.toLocaleDateString('it-IT', { 
    hour12: false, 
    hour: '2-digit',
    minute: '2-digit'
  }) : undefined;
  recurrent = this.data.frequency !== 'NONE';
  count = typeof this.data.repetitions === 'number';
  until = typeof this.data.repetitions === 'string';
  repetitions = this.until ? new Date(this.data.repetitions).toLocaleDateString() : this.data.repetitions;

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


