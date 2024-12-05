import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-assignment-details-modal',
  standalone: true,
  imports: [],
  templateUrl: './assignment-details-modal.component.html',
  styleUrl: './assignment-details-modal.component.css',
  encapsulation: ViewEncapsulation.None, // Desactiva la encapsulació
})
export class AssignmentDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AssignmentDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}