import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PatientResponseDTO } from '../features/patients/models/PatientResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl: string = environment.API_BASE_URL

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwicm9sZSI6IlJPTEVfU1BFQ0lBTElTVCIsImV4cCI6MTczNzUzOTgyNX0.ZLHB5f4jBL2tE0b8VpaRyXf1KQVicz-bwOJW6X9FxoYapP_ItCk6yenR3rBZoommZREU4jnxxo6gJIenh27-0w'
    })
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

  getPatients(specialistId: number){
    return this.http.get<PatientResponseDTO[]>(`${this.apiUrl}/patients/specialist/${specialistId}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }
}
