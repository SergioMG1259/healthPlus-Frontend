import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentResponseDTO } from '../../models/AppointmentResponseDTO';

interface AppointemntDetails {
  appointment: AppointmentResponseDTO
}

@Component({
  selector: 'app-details-appointment-dialog',
  templateUrl: './details-appointment-dialog.component.html',
  styleUrls: ['./details-appointment-dialog.component.css']
})
export class DetailsAppointmentDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DetailsAppointmentDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: AppointemntDetails) { }

  onCloseClick(): void {
    this.dialogRef.close()
  }

  ngOnInit(): void {
  }

}
