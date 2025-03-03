import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppointmentResponseDTO } from '../features/appointments/models/AppointmentResponseDTO';
import { AppointmentCreateDTO } from '../features/appointments/models/AppointmentCreateDTO';
import { AppointmentDateRequestDTO } from '../features/appointments/models/AppointmentDateRequestDTO';
import { AppointmentUpdateDTO } from '../features/appointments/models/AppointmentUpdateDTO';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl: string = environment.API_BASE_URL

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwicm9sZSI6IlJPTEVfU1BFQ0lBTElTVCIsImV4cCI6MTc0MDk4NTQ5OX0.YJAOr8YVqyrJtc5wZFwU-4_sbMIt3VmPCOrh5kolBN8uvZr0OW5clqtzMk82Y__tpBXNEjeADzNqEGWYRCISAw'
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

  findAppointmentsWeeklyBySpecialistId(specialistId: number, appointmentDateRequestDTO: AppointmentDateRequestDTO) {
    return this.http.post<AppointmentResponseDTO[]>(`${this.apiUrl}/appointments/specialist/${specialistId}/weekly`, 
      appointmentDateRequestDTO, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  findAppointmentsMonthlyBySpecialistId(specialistId: number, appointmentDateRequestDTO: AppointmentDateRequestDTO) {
    return this.http.post<AppointmentResponseDTO[]>(`${this.apiUrl}/appointments/specialist/${specialistId}/monthly`, 
      appointmentDateRequestDTO, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  addAppointment(specialistId: number, patientId: number, appointmentCreateDTO: AppointmentCreateDTO) {
    return this.http.post<AppointmentResponseDTO>(`${this.apiUrl}/appointments/specialist/${specialistId}/patient/${patientId}`, 
      appointmentCreateDTO, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  updateAppointment(appointmentId: number, appointmentUpdateDTO: AppointmentUpdateDTO) {
    return this.http.put<AppointmentResponseDTO>(`${this.apiUrl}/appointments/${appointmentId}`, 
      appointmentUpdateDTO, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  deleteAppointment(appointmentId: number) {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${appointmentId}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }
}
