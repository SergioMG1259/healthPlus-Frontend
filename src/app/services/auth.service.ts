import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangePasswordDTO } from '../features/specialist/models/ChangePasswordDTO';
import { LoginDTO } from '../features/auth/models/LoginDTO';
import { UserCreateDTO } from '../features/auth/models/UserCreateDTO';
import { AuthResponseDTO } from '../features/auth/models/AuthResponseDTO';
import { AccessTokenResponseDTO } from '../features/auth/models/AccessTokenResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = environment.API_BASE_URL

  private getHttpOptions(withAuth: boolean = true) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' })

    if (withAuth) {
      const token = localStorage.getItem('accessTokenHealthPlus')
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`)
      }
    }

    return { headers }
  }

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {

    let errorMessage = 'Something happened with request, please try again later';

    if (error.error instanceof ErrorEvent) {
      // Default error handling
      console.log(`An error occurred: ${error.error.message} `)
    } else {
      // Unsuccessful Response Error Code returned from Backend
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error.message}`
      )

      // Si el backend envía un mensaje específico
      if (error.error && error.error.message) {
        errorMessage = error.error.message // Captura el mensaje personalizado
      } else if (typeof error.error === 'string') {
        errorMessage = error.error // Captura el mensaje de error si es un string
      }
    }
    return throwError(errorMessage)
  }

  login(loginDTO: LoginDTO) {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/auth/login`, loginDTO, 
      {withCredentials: true, ...this.getHttpOptions(false)})
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  registerSpecialist(userCreateDTO: UserCreateDTO) {
    return this.http.post<boolean>(`${this.apiUrl}/auth/register/specialist`, userCreateDTO, 
      this.getHttpOptions())
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  refreshToken() {
    return this.http.post<AccessTokenResponseDTO>(`${this.apiUrl}/auth/refresh`, {},
      {withCredentials: true, ...this.getHttpOptions(false)})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error)
        }))
  }

  logout() {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {},
      {withCredentials: true, ...this.getHttpOptions()})
      .pipe(
        catchError(this.handleError)
      )
  }

  changePassword(specialistId: number, changePasswordDTO: ChangePasswordDTO) {
    return this.http.post<boolean>(`${this.apiUrl}/auth/changePassword/specialist/${specialistId}`, changePasswordDTO, 
      this.getHttpOptions())
      .pipe(
        retry(2),
        catchError(this.handleError))
  }
}
