import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import { PatientDetailsDTO } from '../../models/PatientDetailsDTO';
import { AppointmentForPatientDTO } from 'src/app/features/appointments/models/AppointmentForPatientDTO';
import { MatDialog } from '@angular/material/dialog';
import { EditBasicInformationDialogComponent } from '../../components/edit-basic-information-dialog/edit-basic-information-dialog.component';
import { EditMedicalInformationDialogComponent } from '../../components/edit-medical-information-dialog/edit-medical-information-dialog.component';

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
  originalValueNotes: string | null = this.notes

  constructor(private _formBuilder: FormBuilder, private _patientService: PatientService, private route: ActivatedRoute, 
    private _dialogService: MatDialog
  ) { }

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
    dialogRef.afterClosed().subscribe( (e) => {
      console.log(e)
    })
  }

  onClickOpenEditMedicalInformationDialog(): void {
    const dialogRef = this._dialogService.open(EditMedicalInformationDialogComponent, {
      backdropClass: 'dialog-bg',
      width: '400px',
      data: {basicInformation: this.patient}
    })
    dialogRef.afterClosed().subscribe( (e) => {
      console.log(e)
    })
  }

  isNotesUnchanged():boolean {
    const normalizedNotes = this.notes?.trim() || null
    const normalizedOriginalNotes = this.originalValueNotes?.trim() || null
    
    return normalizedNotes == normalizedOriginalNotes
  }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'))
    this._patientService.getPatientDetails(this.patientId).subscribe(e => {
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

      this.isLoading = false
    })
  }

}
