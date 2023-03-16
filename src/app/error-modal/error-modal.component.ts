import { Component, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
})
export class ErrorModalComponent {
  @Input() errorMessage = '';

  constructor(private dialogRef: MatDialogRef<ErrorModalComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
