import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentResponseDTO } from '../../models/AppointmentResponseDTO';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { timeRangeValidator } from '../../functions/timeRangeValidator';
import { PatientShortResponseDTO } from 'src/app/features/patients/models/PatientShortResponseDTO';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PatientResponseDTO } from 'src/app/features/patients/models/PatientResponseDTO';
import { AppointmentUpdateDTO } from '../../models/AppointmentUpdateDTO';

interface AppointemntDetails {
  appointment: AppointmentResponseDTO
}

@Component({
  selector: 'app-edit-appointemnt-dialog',
  templateUrl: './edit-appointemnt-dialog.component.html',
  styleUrls: ['./edit-appointemnt-dialog.component.css']
})
export class EditAppointemntDialogComponent implements OnInit {
  
  patients: PatientShortResponseDTO[] = []
  form!: FormGroup
  today:Date = new Date()
  originalValues: any
  errorMessage:string|null = null

  constructor(public dialogRef: MatDialogRef<EditAppointemntDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: AppointemntDetails, private _fb: FormBuilder,
    private _appointmentService: AppointmentService) {
    
    this.form = this._fb.group({
        issueField: [data.appointment.issue, Validators.required],
        priceField: [data.appointment.price, [Validators.required, Validators.min(1)]],
        dateField: [data.appointment.startDate, Validators.required],
        startField: [data.appointment.startDate.getHours(), Validators.required],
        endField: [data.appointment.endDate.getHours(), Validators.required],
        patientField: [data.appointment.patient.id, Validators.required]
      }, { validators: timeRangeValidator() }
    )
    this.originalValues = this.form.getRawValue()
  }

  onCloseClick(): void {
    this.dialogRef.close()
  }

  onCloseClickUpdate(appointment: AppointmentResponseDTO): void {
    this.dialogRef.close({appointmentResponse: appointment, delete: false})
  }

  onCloseClickDelete() {
    this.dialogRef.close({appointmentResponse: this.data.appointment, delete: true})
  }

  updateAppointment(): void {
    
    const date = this.form.get('dateField')?.value
    const startHour = this.form.get('startField')?.value
    const endHour = this.form.get('endField')?.value
    
    // Crear startDate en UTC sin zona horaria local
    const startDate = new Date(Date.UTC(
      new Date(date).getUTCFullYear(), 
      new Date(date).getUTCMonth(), 
      new Date(date).getUTCDate(),
      startHour, 0, 0, 0  // Establece la hora en UTC (hora de inicio)
    ))

    // Crear endDate en UTC sin zona horaria local
    const endDate = new Date(Date.UTC(
      new Date(date).getUTCFullYear(),
      new Date(date).getUTCMonth(),
      new Date(date).getUTCDate(),
      endHour, 0, 0, 0  // Establece la hora en UTC (hora de fin)
    ))

    const appointment: AppointmentUpdateDTO = {
      price: this.form.get('priceField')?.value,
      startDate: startDate,
      endDate: endDate,
      issue: this.form.get('issueField')?.value
    }

    this._appointmentService.updateAppointment(this.data.appointment.id, appointment).subscribe(e => {
      this.errorMessage = null
      this.onCloseClickUpdate(e)
    }, error => {this.errorMessage = error})
  }

  deleteAppointmet() {
    this._appointmentService.deleteAppointment(this.data.appointment.id).subscribe(e => {
      this.errorMessage = null
      this.onCloseClickDelete()
    }, error => {this.errorMessage = error})
  }

  isSaveDisabled(): boolean {
    return this.form.invalid || this.isUnchanged()
  }

  // Verificar si el formulario sigue igual que al inicio
  isUnchanged(): boolean {
    const normalizeDate = (date: any) => {
      const d = new Date(date)
      return d.toISOString().split('T')[0] // Solo la parte YYYY-MM-DD
    }

    return JSON.stringify({
      ...this.originalValues,
      dateField: normalizeDate(this.originalValues.dateField)
    }) == JSON.stringify({
      ...this.form.getRawValue(),
      dateField: normalizeDate(this.form.getRawValue().dateField)
    })
  }

  areDatesEqual(date1: Date, date2: Date = new Date()): boolean {
    if (date1 == null)
      return false
    
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    )
  }

  ngOnInit(): void {
    
  }

}
