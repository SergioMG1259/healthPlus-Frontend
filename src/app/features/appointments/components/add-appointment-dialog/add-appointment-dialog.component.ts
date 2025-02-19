import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { PatientShortResponseDTO } from 'src/app/features/patients/models/PatientShortResponseDTO';
import { timeRangeValidator } from '../../functions/timeRangeValidator';
import { AppointmentCreateDTO } from '../../models/AppointmentCreateDTO';
import { PatientService } from 'src/app/services/patient.service';
import { PatientResponseDTO } from 'src/app/features/patients/models/PatientResponseDTO';
import { AppointmentResponseDTO } from '../../models/AppointmentResponseDTO';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-add-appointment-dialog',
  templateUrl: './add-appointment-dialog.component.html',
  styleUrls: ['./add-appointment-dialog.component.css']
})
export class AddAppointmentDialogComponent implements OnInit {

  patients: PatientResponseDTO[] =[]

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
  filteredPatients$: Observable<PatientResponseDTO[]> = new Observable<PatientResponseDTO[]>()
  
  hoursSub!: Subscription
  today:Date = new Date()
  errorMessage:string|null = null

  constructor(public dialogRef: MatDialogRef<AddAppointmentDialogComponent>, private _fb: FormBuilder,
    private _patientService: PatientService, private _appointmentService: AppointmentService) { }

  onCloseClick(): void {
    this.dialogRef.close()
  }

  onCloseClickAdd(appointment: AppointmentResponseDTO): void {
    this.dialogRef.close({appointment: appointment})
  }

  selectPatient(patient: PatientResponseDTO): void {
    // this.form.controls['patientField'].setValue(patient.id)
    this.form.get('patientField')?.setValue(patient.id)
  }

  displayPatient = (patient: PatientShortResponseDTO): string => {
    return patient ? `${patient.names} ${patient.lastNames}` : ''
  }

  // private filterPatients(value: string): PatientShortResponseDTO[] {
  //   if (!value || typeof value != 'string') {
  //     return this.patients  // Si no es una cadena, devolver todos los pacientes
  //   }

  //   const filterValue = value.toLowerCase()
  //   return this.patients.filter(patient =>
  //     (`${patient.names} ${patient.lastNames}`).toLowerCase().includes(filterValue)
  //   )
  // }
  private filterPatients(value: string|null): Observable<PatientResponseDTO[]> {
    if (value == '')
      value = null
    return this._patientService.getPatientsWithFilters(1, {searchByNameAndLastName: value, female: true,
      male: true, minAge: null, maxAge: null, sortBy: null})
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

  createAppointment(): void {

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

    const appointment: AppointmentCreateDTO = {
      price: this.form.get('priceField')?.value,
      startDate: startDate,
      endDate: endDate,
      issue: this.form.get('issueField')?.value
    }
    const patientId:number = this.form.get('patientField')?.value

    this._appointmentService.addAppointment(1, patientId, appointment).subscribe(e => {
      this.errorMessage = null
      this.onCloseClickAdd(e)
    }, error => {this.errorMessage = error})
  }

  ngOnInit(): void {
    
    // this._patientService.getPatientsWithFilters(1,{searchByNameAndLastName: null, female: true,
    //   male: true, minAge: null, maxAge: null, sortBy: null}).subscribe(e=> {
    //     this.patients = e
    // })
    
    this.filteredPatients$ = this.patientControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000), // Espera 1 segundo
      switchMap(value => this.filterPatients(value))
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
