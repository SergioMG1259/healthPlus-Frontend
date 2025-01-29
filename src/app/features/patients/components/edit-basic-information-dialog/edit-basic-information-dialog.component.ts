import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientDetailsDTO } from '../../models/PatientDetailsDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { onlyNumbersValidator } from '../../functions/onlyNumberValidator';

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

  constructor(public dialogRef: MatDialogRef<EditBasicInformationDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data:BasicInformation, private _formBuilder: FormBuilder) { 

    this.basicInformation = this._formBuilder.group({
      names: [data.basicInformation.names, Validators.required],
      lastNames: [data.basicInformation.lastNames, Validators.required],
      dateOfBirth: [data.basicInformation.birthDate, Validators.required],
      gender: [data.basicInformation.gender, Validators.required],
      dni: [data.basicInformation.dni, [Validators.required,  Validators.maxLength(8), 
            Validators.minLength(8) ,onlyNumbersValidator()]],
      phone: [data.basicInformation.phoneNumber, [Validators.required, Validators.maxLength(9), 
            Validators.minLength(9), onlyNumbersValidator()]],
      email: [data.basicInformation.email, [Validators.required, Validators.email]],
      address: [data.basicInformation.address, Validators.required]
    })
    // Guardar una copia de los valores originales
    this.originalValues = this.basicInformation.getRawValue()
  }

  onCloseClick(): void {
    this.dialogRef.close({value: true})
  }
  onCloseClickEdit(): void {
    this.dialogRef.close({value: false})
  }

  isSaveDisabled(): boolean {
    return this.basicInformation.invalid || this.isUnchanged()
  }

  // Verificar si el formulario sigue igual que al inicio
  isUnchanged(): boolean {
    return JSON.stringify(this.basicInformation.getRawValue()) === JSON.stringify(this.originalValues)
  }

  ngOnInit(): void {
  }

}
