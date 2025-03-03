import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import { PatientDetailsDTO } from '../../models/PatientDetailsDTO';
import { AppointmentForPatientDTO } from 'src/app/features/appointments/models/AppointmentForPatientDTO';
import { MatDialog } from '@angular/material/dialog';
import { EditBasicInformationDialogComponent } from '../../components/edit-basic-information-dialog/edit-basic-information-dialog.component';
import { EditMedicalInformationDialogComponent } from '../../components/edit-medical-information-dialog/edit-medical-information-dialog.component';
import { NotesUpdateDTO } from '../../models/NotesUpdateDTO';
import { AllergyService } from 'src/app/services/allergy.service';
import { AllergyGroupCreateDTO } from '../../models/AllergyGroupCreateDTO';
import { AllergyRequestDTO } from '../../models/AllergyRequestDTO';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  
  isLoading: boolean = true
  patientId: number = 0
  showOtherInput:boolean = false
  patient!:PatientDetailsDTO

  readonly allergyMap = new Map<number, string>([
    [1, 'penicillin'],
    [2, 'aspirin'],
    [3, 'sulfonamides'],
    [4, 'nsaids'],
    [5, 'opioids'],
    [6, 'cephalosporins'],
    [7, 'tetracyclines']
  ])

  allergiesForm = this._formBuilder.group({
    allergies: this._formBuilder.group({
      penicillin: false,
      aspirin: false,
      sulfonamides: false,
      nsaids: false,
      opioids: false,
      cephalosporins: false,
      tetracyclines: false,
      other: false
    }),
    additionalAllergies: this._formBuilder.array([])  // Aquí se almacenarán las alergias adicionales
  })
  appointments:AppointmentForPatientDTO[] = []
  notes:string | null = null
  originalFormValue: any
  originalValueNotes: string | null = this.notes

  constructor(private _formBuilder: FormBuilder, private _patientService: PatientService, private route: ActivatedRoute, 
    private _dialogService: MatDialog, private _allergyService: AllergyService) { }

  // Getter para el FormArray
  get additionalAllergies(): FormArray {
    return this.allergiesForm.get('additionalAllergies') as FormArray
  }

  // Método para manejar el cambio del checkbox "Other"
  onOtherCheckboxChange(): void {
    // Verifica si el checkbox "other" está marcado antes de agregar el input
    const isOtherChecked = this.allergiesForm.get('allergies')!.get('other')?.value
    this.showOtherInput = isOtherChecked!

    if (isOtherChecked) {
      this.addAdditionalAllergy()
    } else {
      this.additionalAllergies.clear()
    }
  }
  
  // Método para agregar un nuevo control de alergia adicional
  addAdditionalAllergy(): void {
    this.additionalAllergies.push(this._formBuilder.control('', Validators.required) )
  }

  // Método para eliminar un control de alergia adicional
  removeAdditionalAllergy(index: number): void {
    this.additionalAllergies.removeAt(index)
  }

  onClickOpenEditBasicInformationDialog(): void {
    const dialogRef = this._dialogService.open(EditBasicInformationDialogComponent, {
      backdropClass: 'dialog-bg',
      width: '400px',
      data: {basicInformation: this.patient}
    })
    dialogRef.afterClosed().subscribe((e) => {
      if(e) {
        this.patient.names = e.patient.names
        this.patient.lastNames = e.patient.lastNames
        this.patient.birthDate = e.patient.birthDate
        this.patient.gender = e.patient.gender
        this.patient.dni = e.patient.dni
        this.patient.phoneNumber = e.patient.phoneNumber
        this.patient.email = e.patient.email
        this.patient.address = e.patient.address
      }
    })
  }

  onClickOpenEditMedicalInformationDialog(): void {
    const dialogRef = this._dialogService.open(EditMedicalInformationDialogComponent, {
      backdropClass: 'dialog-bg',
      width: '400px',
      data: {basicInformation: this.patient}
    })
    dialogRef.afterClosed().subscribe((e) => {
      if(e) {
        this.patient.medicalInformation.weight = e.medicalInformation.weight
        this.patient.medicalInformation.height = e.medicalInformation.height
        this.patient.medicalInformation.bmi = e.medicalInformation.bmi
        this.patient.medicalInformation.cholesterol = e.medicalInformation.cholesterol
        this.patient.medicalInformation.bloodSugar = e.medicalInformation.bloodSugar
        this.patient.medicalInformation.systolicPressure = e.medicalInformation.systolicPressure
        this.patient.medicalInformation.diastolicPressure = e.medicalInformation.diastolicPressure
        this.patient.medicalInformation.heartRate = e.medicalInformation.heartRate
      }
    })
  }

  isNotesUnchanged():boolean {
    const normalizedNotes = this.notes?.trim() || null
    const normalizedOriginalNotes = this.originalValueNotes?.trim() || null
    
    return normalizedNotes == normalizedOriginalNotes
  }

  updateNotes(): void {
    const notesUpdateDTO:NotesUpdateDTO = {notes: this.notes}
    this._patientService.updateNotes(this.patientId, notesUpdateDTO).subscribe(e => {
      this.originalValueNotes = e.notes
    })
  }

  isSaveDisabled(): boolean {
    return this.allergiesForm.invalid || this.isUnchanged()
  }

  // Verificar si el formulario sigue igual que al inicio
  isUnchanged(): boolean {
    return JSON.stringify(this.allergiesForm.getRawValue()) === JSON.stringify(this.originalFormValue)
  }

  updateAllergies() {
    const allergiesMapToId = Array.from(this.allergyMap.entries())
    .filter(([id, name]) => this.allergiesForm.get('allergies')?.get(name)?.value)
    .map(([id]) => id)

    const customAllergiesMap: AllergyRequestDTO[] = (this.allergiesForm.getRawValue().additionalAllergies as string[])
    .map((name) => ({ name }))
    
    const allergyGroupCreateDTO: AllergyGroupCreateDTO = {
      allergiesId: allergiesMapToId,
      customAllergiesNames: customAllergiesMap
    }

    this._allergyService.updateAllergiesInPatient(this.patientId, allergyGroupCreateDTO).subscribe(e => {
      this.originalFormValue = this.allergiesForm.getRawValue()
    })
  }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'))
    this._patientService.findPatientDetails(this.patientId).subscribe(e => {
      this.patient = e
      this.appointments = e.appointments
      this.notes = e.notes
      this.originalValueNotes = this.notes

      const allergies = e.allergies
      allergies.forEach(element => {
        const allergy = this.allergyMap.get(element.allergy.id)
        this.allergiesForm.get('allergies')?.get(allergy!)?.setValue(true)
      })
      
      const customAllergies = e.customAllergies
      if (customAllergies.length > 0) {
        this.allergiesForm.get('allergies')?.get('other')?.setValue(true)
        this.showOtherInput = true
      }
      customAllergies.forEach(element => {
        this.additionalAllergies.push(this._formBuilder.control(element.name, Validators.required) )
      })

      this.originalFormValue = this.allergiesForm.getRawValue()
      this.isLoading = false
    })
  }

}
