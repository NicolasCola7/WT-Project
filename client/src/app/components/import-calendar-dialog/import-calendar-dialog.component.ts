import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertService } from '../../services/alert.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-import-calendar-dialog',
  imports: [
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './import-calendar-dialog.component.html',
  styleUrl: './import-calendar-dialog.component.css'
})
export class ImportCalendarDialogComponent {
  data = inject(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<ImportCalendarDialogComponent>,
    private alertService: AlertService,
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onImport(): void {
    if(!this.data.calendarId) {
        this.alertService.showError('Id obbligatoro');
        return;
    }

    this.dialogRef.close(this.data);
  }

}
