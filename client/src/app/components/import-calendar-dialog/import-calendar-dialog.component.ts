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
  fileName?: string;
  private selectedFile?: File;

  constructor(
    public dialogRef: MatDialogRef<ImportCalendarDialogComponent>,
    private alertService: AlertService,
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onImport(): void {
    this.data.isGoogle = this.data.calendarId;

    if(!this.data.calendarId && this.data.isGoogle) {
        this.alertService.showError('Id obbligatoro');
        return;
    }

    if(!this.fileName && !this.data.isGoogle) {
      this.alertService.showError('Devi selezionare almeno un file');
      return;
    }

    if (this.selectedFile) {
      this.data.file = this.selectedFile;
      this.data.fileName = this.fileName;
    }

    this.dialogRef.close(this.data);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
      
      this.data.calendarId = undefined;
    }
  }

}
