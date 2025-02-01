import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientDetailsDTO } from '../../models/PatientDetailsDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from 'src/app/services/patient.service';
import { MedicalInformationUpdateDTO } from '../../models/MedicalInformationUpdateDTO';
import { MedicalInformationResponseDTO } from '../../models/MedicalInformationResponseDTO ';

interface BasicInformation {
  basicInformation: PatientDetailsDTO
}

@Component({
  selector: 'app-edit-medical-information-dialog',
  templateUrl: './edit-medical-information-dialog.component.html',
  styleUrls: ['./edit-medical-information-dialog.component.css']
})
export class EditMedicalInformationDialogComponent implements OnInit {

  medicalInformation: FormGroup = this._formBuilder.group({})
  originalValues: any

  constructor(public dialogRef: MatDialogRef<EditMedicalInformationDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data:BasicInformation, private _formBuilder: FormBuilder, 
      private _patientService: PatientService) {

    this.medicalInformation = this._formBuilder.group({
      height: [data.basicInformation.medicalInformation.height, [Validators.required, Validators.max(3)]],
      weight: [data.basicInformation.medicalInformation.weight, [Validators.required, Validators.max(999)]],
      cholesterol: [data.basicInformation.medicalInformation.cholesterol, [Validators.required, Validators.max(999)]],
      bloodSugar: [data.basicInformation.medicalInformation.bloodSugar, [Validators.required, Validators.max(999)]],
      systolicPressure: [data.basicInformation.medicalInformation.systolicPressure, [Validators.required, Validators.max(999)]],
      diastolicPressure: [data.basicInformation.medicalInformation.diastolicPressure, [Validators.required, Validators.max(999)]],
      heartRate: [data.basicInformation.medicalInformation.heartRate, [Validators.required, Validators.max(999)]]
    })
    // Guardar una copia de los valores originales
    this.originalValues = this.medicalInformation.getRawValue()
  }

  onCloseClick(): void {
    this.dialogRef.close()
  }
  onCloseClickEdit(medicalInformation: MedicalInformationResponseDTO): void {
    this.dialogRef.close({medicalInformation: medicalInformation})
  }

  isSaveDisabled(): boolean {
    return this.medicalInformation.invalid || this.isUnchanged()
  }

  // Verificar si el formulario sigue igual que al inicio
  isUnchanged(): boolean {
    return JSON.stringify(this.medicalInformation.getRawValue()) === JSON.stringify(this.originalValues)
  }

  updateMedicalInformation():void {
    const medicalInfo: MedicalInformationUpdateDTO = this.medicalInformation.getRawValue() as MedicalInformationUpdateDTO
    this._patientService.updateMedicalInformation(this.data.basicInformation.id, medicalInfo).subscribe(e => {
      this.onCloseClickEdit(e)
    })
    // console.log(medicalInfo)
  }

  ngOnInit(): void {
  }

}
