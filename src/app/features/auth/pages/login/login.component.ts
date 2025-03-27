import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginDTO } from '../../models/LoginDTO';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hidePassword: boolean = true
  loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.maxLength(30)]],
    // rememberMe: [false]
  })
  errorMessage: string | null = null
  waitingResponseApi: boolean = false

  constructor(private _formBuilder: FormBuilder, private _router: Router, private _authService: AuthService) { }

  onClickLogin(): void {

    this.waitingResponseApi = true
    const loginDTO: LoginDTO = this.loginForm.getRawValue() as LoginDTO

    this._authService.login(loginDTO).subscribe( response => {

      localStorage.setItem('userRolIdHealthPlus', response.userRoleId.toString())
      localStorage.setItem('roleHealthPlus', response.role)
      localStorage.setItem('accessTokenHealthPlus', response.accessToken)
      localStorage.setItem('isLoggedInHealthPlus', 'true')
      
      // if (loginDTO.rememberMe) {
      //   localStorage.setItem('rememberMeHealthPlus', 'true')
      // }

      this._router.navigate(['/overview'])
      this.errorMessage = null
      this.waitingResponseApi = false
    }, error => {this.errorMessage = error, this.waitingResponseApi = false})
  }

  ngOnInit(): void {
  }

}
