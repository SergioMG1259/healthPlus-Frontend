import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientDetailsDTO } from '../../models/PatientDetailsDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { onlyNumbersValidator } from '../../functions/onlyNumberValidator';
import { PatientService } from 'src/app/services/patient.service';
import { PatientUpdateDTO } from '../../models/PatientUpdateDTO';
import { PatientResponseDTO } from '../../models/PatientResponseDTO';
import { ActivatedRoute } from '@angular/router';

interface BasicInformation {
  basicInformation: PatientDetailsDTO
}

@Component({
  selector: 'app-edit-basic-information-dialog',
  templateUrl: './edit-basic-information-dialog.component.html',
  styleUrls: ['./edit-basic-information-dialog.component.css']
})
export class EditBasicInformationDialogComponent implements OnInit {

  basicInformation: FormGroup = this._formBuilder.group({})
  originalValues: any
  today: Date = new Date()
  waitingResponseApi = false
  errorMessage: string | null = null

  constructor(public dialogRef: MatDialogRef<EditBasicInformationDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data:BasicInformation, private _formBuilder: FormBuilder,
    private _patientService: PatientService) { 

    this.basicInformation = this._formBuilder.group({
      names: [data.basicInformation.names, Validators.required],
      lastNames: [data.basicInformation.lastNames, Validators.required],
      birthDate: [data.basicInformation.birthDate, Validators.required],
      gender: [data.basicInformation.gender, Validators.required],
      dni: [data.basicInformation.dni, [Validators.required,  Validators.maxLength(8), 
            Validators.minLength(8) ,onlyNumbersValidator()]],
      phoneNumber: [data.basicInformation.phoneNumber, [Validators.required, Validators.maxLength(9), 
            Validators.minLength(9), onlyNumbersValidator()]],
      email: [data.basicInformation.email, [Validators.required, Validators.email]],
      address: [data.basicInformation.address, Validators.required]
    })
    // Guardar una copia de los valores originales
    this.originalValues = this.basicInformation.getRawValue()
  }

  onCloseClick(): void {
    this.dialogRef.close()
  }

  updatePatient(patientResponseDTO: PatientResponseDTO): void {
    this.dialogRef.close({patient: patientResponseDTO})
  }

  isSaveDisabled(): boolean {
    return this.basicInformation.invalid || this.isUnchanged() || this.waitingResponseApi
  }

  // Verificar si el formulario sigue igual que al inicio
  isUnchanged(): boolean {
    const normalizeDate = (date: any) => {
      const d = new Date(date)
      return d.toISOString().split('T')[0] // Solo la parte YYYY-MM-DD
    }

    return JSON.stringify({
      ...this.originalValues,
      birthDate: normalizeDate(this.originalValues.birthDate)
    }) == JSON.stringify({
      ...this.basicInformation.getRawValue(),
      birthDate: normalizeDate(this.basicInformation.getRawValue().birthDate)
    })
  }

  onCloseClickEdit(): void {

    this.waitingResponseApi = true
    const patientUpdateDTO: PatientUpdateDTO = this.basicInformation.getRawValue() as PatientUpdateDTO
    this._patientService.updatePatientById(this.data.basicInformation.id, patientUpdateDTO).subscribe(e=> {
      this.errorMessage = null
      this.updatePatient(e)
      this.waitingResponseApi = false
    }, error => {this.errorMessage = error, this.waitingResponseApi = false})
  }

  ngOnInit(): void {
  }

}
