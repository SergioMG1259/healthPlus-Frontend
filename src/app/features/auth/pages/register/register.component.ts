import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { onlyNumbersValidator } from 'src/app/features/patients/functions/onlyNumberValidator';
import { AuthService } from 'src/app/services/auth.service';
import { UserCreateDTO } from '../../models/UserCreateDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hidePassword: boolean = true
  registerForm = this._formBuilder.group({
    names: ['', Validators.required],
    lastNames: ['', Validators.required],
    birthDate: [null, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.maxLength(30)]],
    medicalInstitution: ['', Validators.required],
    yearsOfExperience: [null, [Validators.required, onlyNumbersValidator()]],
    specialty: [null, Validators.required]
  })
  errorMessage: string | null = null
  waitingResponseApi = false

  constructor(private _formBuilder: FormBuilder, private _authService: AuthService, private _router: Router) { }

  onClickRegister(): void {

    this.waitingResponseApi = true

    const userCreateDTO: UserCreateDTO = {
      email: this.registerForm.get('email')?.value!,
      password: this.registerForm.get('password')?.value!,
      specialistCreateDTO: {
        names: this.registerForm.get('names')?.value!,
        lastNames: this.registerForm.get('lastNames')?.value!,
        birthDate: this.registerForm.get('birthDate')?.value!,
        medicalInstitution: this.registerForm.get('medicalInstitution')?.value!,
        yearsOfExperience: this.registerForm.get('yearsOfExperience')?.value!,
        specialty: this.registerForm.get('specialty')?.value!
      }
    }

    this._authService.registerSpecialist(userCreateDTO).subscribe( response => {

      localStorage.setItem('userRolIdHealthPlus', response.userRoleId.toString())
      localStorage.setItem('roleHealthPlus', response.role)
      localStorage.setItem('accessTokenHealthPlus', response.accessToken)
      localStorage.setItem('isLoggedInHealthPlus', 'true')
      
      this._router.navigate(['/overview'])
      this.errorMessage = null
      this.waitingResponseApi = false
    }, error => {this.errorMessage = error, this.waitingResponseApi = false})
  }

  ngOnInit(): void {
  }

}
