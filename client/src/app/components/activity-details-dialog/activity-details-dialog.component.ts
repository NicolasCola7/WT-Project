import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { TimeMachineService } from '../../services/time-machine.service';
import { Subscription } from 'rxjs';

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
  timeMachineService = inject(TimeMachineService);
  data = inject(MAT_DIALOG_DATA);

  dueDate = new Date(this.data.dueDate).toLocaleDateString('it-IT', { 
    hour12: false, 
    hour: '2-digit',
    minute: '2-digit'
  });

  overdue = false;
  private subscription: Subscription;

  constructor() {
    this.subscription = this.timeMachineService.currentDate$.subscribe(currentDate => {
      const dueDateTime = this.data.dueDate.getTime();
      this.overdue = dueDateTime <= currentDate.getTime();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


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
