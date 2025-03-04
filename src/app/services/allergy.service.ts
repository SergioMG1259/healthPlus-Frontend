import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AllergyGroupCreateDTO } from '../features/patients/models/AllergyGroupCreateDTO';
import { AllergyGroupResponseDTO } from '../features/patients/models/AllergyGroupResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class AllergyService {

  private apiUrl: string = environment.API_BASE_URL

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwicm9sZSI6IlJPTEVfU1BFQ0lBTElTVCIsImV4cCI6MTc0MDE4Mjc1NH0.44uzCiG6d6QnG9eoUK5tX2_FGdC4BRiXwcEzXhcAfD3vpnxoUNvNiLLx4IBoehpngXb57RT56dQOP81S1wNM6g'
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

  updateAllergiesInPatient(patientId:number, allergyGroupCreateDTO: AllergyGroupCreateDTO) {
    return this.http.put<AllergyGroupResponseDTO>(`${this.apiUrl}/allergies/patient/${patientId}`, 
      allergyGroupCreateDTO, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }
}
