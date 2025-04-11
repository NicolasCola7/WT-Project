import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
  data = inject(DIALOG_DATA);
  startDate = this.data.start.toLocaleDateString();
  startTime = this.data.start.getHours() + ':' + this.data.start.getMinutes();
  endDate = this.data.end ? this.data.end.toLocaleDateString() : undefined;
  endTime = this.data.end ? this.data.end.getHours() + ':' + this.data.end.getMinutes() : undefined;

  onDelete() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close();
  }
}


