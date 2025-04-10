import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { Overview } from '../features/overview/models/overview';
import { environment } from 'src/environments/environment';
import { SpecialistResponseDTO } from '../features/specialist/models/SpecialistResponseDTO';
import { SpecialistUpdateDTO } from '../features/specialist/models/SpecialistUpdateDTO';

@Injectable({
  providedIn: 'root'
})
export class SpecialistService {

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

  getOverview() {
    return this.http.get<Overview>(`${this.apiUrl}/specialists/overview/${localStorage.getItem('userRolIdHealthPlus')}`, this.getHttpOptions())
      .pipe(
        retry(1),
        catchError(this.handleError))
  }

  findSpecialistById() {
    return this.http.get<SpecialistResponseDTO>(`${this.apiUrl}/specialists/${localStorage.getItem('userRolIdHealthPlus')}`, this.getHttpOptions())
      .pipe(
        retry(1),
        catchError(this.handleError))
  }

  updateSpecialist(specialistUpdateDTO: SpecialistUpdateDTO) {
    return this.http.put<SpecialistResponseDTO>(`${this.apiUrl}/specialists/${localStorage.getItem('userRolIdHealthPlus')}`,
      specialistUpdateDTO, this.getHttpOptions())
    .pipe(
      retry(1),
      catchError(this.handleError))
  }
}
