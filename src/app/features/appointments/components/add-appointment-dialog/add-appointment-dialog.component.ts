import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, Observable, startWith, Subscription } from 'rxjs';
import { PatientShortDTO } from 'src/app/features/patients/models/PatientShortDTO';
import { timeRangeValidator } from '../../functions/timeRangeValidator';

@Component({
  selector: 'app-add-appointment-dialog',
  templateUrl: './add-appointment-dialog.component.html',
  styleUrls: ['./add-appointment-dialog.component.css']
})
export class AddAppointmentDialogComponent implements OnInit {

  patients: PatientShortDTO[] = [
    {id: 1, names: 'Sergio Martin', lastNames: 'Guanilo Gonzales'},
    {id: 2, names: 'Luis Martin', lastNames: 'Gonzales Gonzales'},
    {id: 3, names: 'Martin Diego', lastNames: 'Sanchez'},
    {id: 4, names: 'Daniela', lastNames: 'Flores Gutierrez'}
  ]

  form: FormGroup = this._fb.group({
    issueField: ['', Validators.required],
    priceField: [null, [Validators.required, Validators.min(1)]],
    dateField: [null, Validators.required],
    startField: [null, Validators.required],
    endField: [{ value: null, disabled: true }, Validators.required],
    patientField: [null, Validators.required]
  }, { validators: timeRangeValidator() }
  )

  patientControl = new FormControl()
  filteredPatients$: Observable<PatientShortDTO[]> = new Observable<PatientShortDTO[]>()
  
  hoursSub!: Subscription
  constructor(public dialogRef: MatDialogRef<AddAppointmentDialogComponent>, private _fb: FormBuilder) { }

  onCloseClick(): void {
    this.dialogRef.close({value: true})
  }

  selectPatient(patient:number):void {
    this.form.controls['patientField'].setValue(patient)
    console.log(this.form.value)
  }

  displayPatient = (patientId: number): string => {
    const patient = this.patients.find(patient => patient.id == patientId)
    return patient ? `${patient.names} ${patient.lastNames}` : ''
  }

  private filterPatients(value: string): PatientShortDTO[] {
    if (!value || typeof value != 'string') {
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

    this.hoursSub = this.form.get('startField')!.valueChanges.subscribe((value:number) => {
      if(value)
        this.form.get('endField')?.enable()
      else
        this.form.get('endField')?.disable()
    })
  }

  ngOnDestroy(): void {
    if (this.hoursSub) {
      this.hoursSub.unsubscribe()
    }
  }

}
