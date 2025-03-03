import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { onlyNumbersValidator } from 'src/app/features/patients/functions/onlyNumberValidator';
import { SpecialistService } from 'src/app/services/specialist.service';
import { SpecialistUpdateDTO } from '../../models/SpecialistUpdateDTO';
import { AuthService } from 'src/app/services/auth.service';
import { ChangePasswordDTO } from '../../models/ChangePasswordDTO';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  changingPassword: boolean = false
  hideCurrentPassword: boolean = true
  hideNewPassword: boolean = true
  isLoading: boolean = true
  specialistInformation: FormGroup = this._formBuilder.group({})
  changePasswordForm: FormGroup = this._formBuilder.group({})
  originalValues: any = null
  errorMessage: string | null = null
  errorMessagePassword: string | null = null

  constructor(private _specialistService: SpecialistService, private _formBuilder: FormBuilder,
    private authService: AuthService) {

    this.specialistInformation = this._formBuilder.group({
      names: ['', Validators.required],
      lastNames: ['', Validators.required],
      birthDate: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      medicalInstitution: ['', Validators.required],
      yearsOfExperience: [0, [Validators.required, onlyNumbersValidator()]],
      specialty: [null, Validators.required]
    })

    this.changePasswordForm = this._formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.maxLength(30)]],
      newPassword: ['', [Validators.required, Validators.maxLength(30)]]
    })
  }

  onClickShowChangePassword(): void {
    this.changingPassword = !this.changingPassword
  }

  isSaveDisabled(): boolean {
    return this.specialistInformation.invalid || this.isUnchanged()
  }

  isUnchanged(): boolean {
    const normalizeDate = (date: any) => {
      const d = new Date(date)
      return d.toISOString().split('T')[0] // Solo la parte YYYY-MM-DD
    }

    return JSON.stringify({
      ...this.originalValues,
      birthDate: normalizeDate(this.originalValues.birthDate)
    }) == JSON.stringify({
      ...this.specialistInformation.getRawValue(),
      birthDate: normalizeDate(this.specialistInformation.getRawValue().birthDate)
    })
  }

  onClickUpdateSpecialist(): void {
    const specialistUpdateDTO: SpecialistUpdateDTO = this.specialistInformation.getRawValue() as SpecialistUpdateDTO
    this._specialistService.updateSpecialist(1, specialistUpdateDTO).subscribe( specialist => {
      this.originalValues = this.specialistInformation.getRawValue()
      this.errorMessage = null
    }, error => this.errorMessage = error)
  }

  onClickChangePassword(): void {
    const changePasswordDTO: ChangePasswordDTO = this.changePasswordForm.getRawValue() as ChangePasswordDTO
    this.authService.changePassword(1, changePasswordDTO).subscribe( e => {
      this.changePasswordForm.reset()
      this.changingPassword = false
      this.errorMessagePassword = null
    }, error => {
      this.errorMessagePassword = error
      this.changePasswordForm.reset()
    })
  }

  ngOnInit(): void {
    this._specialistService.findSpecialistById(1).subscribe( specialist => {
      this.specialistInformation.patchValue({
        names: specialist.names,
        lastNames: specialist.lastNames,
        birthDate: specialist.birthDate,
        email: specialist.email,
        medicalInstitution: specialist.medicalInstitution,
        yearsOfExperience: specialist.yearsOfExperience,
        specialty: specialist.specialty
      })
      this.isLoading = false
      // Guardar una copia de los valores originales
      this.originalValues = this.specialistInformation.getRawValue()
    })
  }

}
