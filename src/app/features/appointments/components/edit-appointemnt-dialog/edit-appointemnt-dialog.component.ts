import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentResponseDTO } from '../../models/appointmentResponseDTO';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { timeRangeValidator } from '../../functions/timeRangeValidator';
import { PatientShortDTO } from 'src/app/features/patients/models/PatientShortDTO';
import { debounceTime, map, Observable, startWith } from 'rxjs';

interface AppointemntDetails {
  appointment: AppointmentResponseDTO
}

@Component({
  selector: 'app-edit-appointemnt-dialog',
  templateUrl: './edit-appointemnt-dialog.component.html',
  styleUrls: ['./edit-appointemnt-dialog.component.css']
})
export class EditAppointemntDialogComponent implements OnInit {

  patients: PatientShortDTO[] = [
    {id: 1, names: 'Sergio Martin', lastNames: 'Guanilo Gonzales'},
    {id: 2, names: 'Luis Martin', lastNames: 'Gonzales Gonzales'},
    {id: 3, names: 'Martin Diego', lastNames: 'Sanchez'},
    {id: 4, names: 'Daniela', lastNames: 'Flores Gutierrez'}
  ]
  form!: FormGroup
  patientControl = new FormControl()
  filteredPatients$: Observable<PatientShortDTO[]> = new Observable<PatientShortDTO[]>()
  today:Date = new Date()

  constructor(public dialogRef: MatDialogRef<EditAppointemntDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: AppointemntDetails, private _fb: FormBuilder) {
    
    this.form = this._fb.group({
        issueField: [data.appointment.issue, Validators.required],
        priceField: [data.appointment.price, [Validators.required, Validators.min(1)]],
        dateField: [data.appointment.startDate, Validators.required],
        startField: [data.appointment.startDate.getHours(), Validators.required],
        endField: [data.appointment.endDate.getHours(), Validators.required],
        patientField: [data.appointment.patient.id, Validators.required]
      }, { validators: timeRangeValidator() }
    )
    this.patientControl.setValue(data.appointment.patient.id)
  }

  onCloseClick(): void {
    this.dialogRef.close({value: true})
  }

  selectPatient(patient:number): void {
    this.form.controls['patientField'].setValue(patient)
  }

  displayPatient = (patientId: number): string => {
    const patient = this.patients.find(patient => patient.id == patientId)
    return patient ? `${patient.names} ${patient.lastNames}` : ''
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

  private filterPatients(value: string): PatientShortDTO[] {
    if (typeof value != 'string') {
      return this.patients  // Si no es una cadena, devolver todos los pacientes
    }

    const filterValue = value.toLowerCase()
    return this.patients.filter(patient =>
      (`${patient.names} ${patient.lastNames}`).toLowerCase().includes(filterValue)
    )
  }

  ngOnInit(): void {
    this.filteredPatients$ = this.patientControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000), // Espera 1 segundo
      map(value => this.filterPatients(value))
    )
  }

}
