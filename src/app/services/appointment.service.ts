import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppointmentResponseDTO } from '../features/appointments/models/AppointmentResponseDTO';
import { AppointmentCreateDTO } from '../features/appointments/models/AppointmentCreateDTO';
import { AppointmentDateRequestDTO } from '../features/appointments/models/AppointmentDateRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl: string = environment.API_BASE_URL

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwicm9sZSI6IlJPTEVfU1BFQ0lBTElTVCIsImV4cCI6MTczODQ4ODAwMH0.uWqXSzKmGQGW9mcKH_R-kD4i_eEtVXw7Ddfx7ZPAZEm4uwTOsI3E7m5YxnVoW73vNTmemv3dur3OvECKAVAbUQ'
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

  createAppointment(specialistId: number, patientId: number, appointmentCreateDTO: AppointmentCreateDTO) {
    return this.http.post<AppointmentResponseDTO>(`${this.apiUrl}/appointments/specialist/${specialistId}/patient/${patientId}`, 
      appointmentCreateDTO, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  findAppointmentsWeeklyBySpecialistId(specialistId: number, appointmentDateRequestDTO: AppointmentDateRequestDTO) {
    return this.http.post<AppointmentResponseDTO[]>(`${this.apiUrl}/appointments/specialist/${specialistId}/weekly`, 
      appointmentDateRequestDTO, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }
}
