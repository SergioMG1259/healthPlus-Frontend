import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-appointment-dialog',
  templateUrl: './add-appointment-dialog.component.html',
  styleUrls: ['./add-appointment-dialog.component.css']
})
export class AddAppointmentDialogComponent implements OnInit {

  options: string[] = ['One', 'Two', 'Three']
  
  constructor(public dialogRef: MatDialogRef<AddAppointmentDialogComponent>) { }

  onCloseClick(): void {
    this.dialogRef.close()
  }

  ngOnInit(): void {
  }

}
