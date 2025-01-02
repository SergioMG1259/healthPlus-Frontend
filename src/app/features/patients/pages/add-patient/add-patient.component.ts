import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

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
    dateOfBirth: [null, Validators.required],
    gender: ['', Validators.required],
    dni: ['', [Validators.required,  Validators.min(10000000), Validators.max(99999999)]],
    notes: ['']
  })

  secondStep = this._formBuilder.group({
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    adress: ['', Validators.required]
  })

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

  constructor(private _formBuilder: FormBuilder) { }

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

  ngOnInit(): void {
  }

}
