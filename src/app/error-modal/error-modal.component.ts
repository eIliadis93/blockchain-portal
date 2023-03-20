import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
})
export class ErrorModalComponent {
  message: string = '';

  constructor(
    public dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      message: string,
    })
  { }

  close() {
    this.dialogRef.close();
  }
}
