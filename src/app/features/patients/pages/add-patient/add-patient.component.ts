import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PatientCreateDTO } from '../../models/PatientCreateDTO';
import { AllergyRequestDTO } from '../../models/AllergyRequestDTO';
import { AllergyGroupCreateDTO } from '../../models/AllergyGroupCreateDTO';
import { PatientService } from 'src/app/services/patient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

 showOtherInput:boolean = false

 firstStep = this._formBuilder.group({
    names: ['', Validators.required],
    lastNames: ['', Validators.required],
    birthDate: [null, Validators.required],
    gender: [null, Validators.required],
    dni: ['', [Validators.required,  Validators.min(10000000), Validators.max(99999999)]],
    notes: [null]
  })

  secondStep = this._formBuilder.group({
    phone: ['', [Validators.required, Validators.min(100000000), Validators.max(999999999)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required]
  })

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

  private _resizeSub!:Subscription
  orientation:StepperOrientation ="horizontal"
  errorMessage:string|null = null

  constructor(private _formBuilder: FormBuilder, private _breakpointObserver: BreakpointObserver,
    private _patientService: PatientService, private _router:Router) { }

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

  // Método para eliminar un control de alergia adicional por índice
  removeAdditionalAllergy(index: number): void {
    this.additionalAllergies.removeAt(index)
  }

  onClickAddPatient() {

    const allergiesMapToId = Array.from(this.allergyMap.entries())
    .filter(([id, name]) => this.allergiesForm.get('allergies')?.get(name)?.value)
    .map(([id]) => id)

    const customAllergiesMap: AllergyRequestDTO[] = (this.allergiesForm.getRawValue().additionalAllergies as string[])
    .map((name) => ({ name }))
    
    const allergyGroupCreateDTO: AllergyGroupCreateDTO = {
      allergiesId: allergiesMapToId,
      customAllergiesNames: customAllergiesMap
    }

    const patientCreateDTO: PatientCreateDTO = {
      names: this.firstStep.get('names')!.value!,
      lastNames: this.firstStep.get('lastNames')!.value!,
      gender: this.firstStep.get('gender')!.value!,
      birthDate: this.firstStep.get('birthDate')!.value!,
      dni: this.firstStep.get('dni')!.value!,
      notes: this.firstStep.get('notes')!.value!,
      email: this.secondStep.get('email')!.value!,
      phoneNumber: this.secondStep.get('phone')!.value!,
      address: this.secondStep.get('address')!.value!,
      allergiesGroup: allergyGroupCreateDTO
    }
    this._patientService.addPatient(1, patientCreateDTO).subscribe(e => {
      this.errorMessage = null
      this._router.navigate(['/patients'])
    }, error => {this.errorMessage = error})
  }

  ngOnInit(): void {
    this._resizeSub = this._breakpointObserver.observe(['(max-width: 768px)']).subscribe((state: BreakpointState) => {
      if(state.matches) {
        this.orientation = "vertical"
      } else {
        this.orientation = "horizontal"
      }
    })
  }

  ngOnDestroy():void {
    if (this._resizeSub) {
      this._resizeSub.unsubscribe()
    }
  }

}
