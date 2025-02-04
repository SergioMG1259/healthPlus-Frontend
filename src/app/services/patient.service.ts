import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PatientResponseDTO } from '../features/patients/models/PatientResponseDTO';
import { PatientDetailsDTO } from '../features/patients/models/PatientDetailsDTO';
import { MedicalInformationUpdateDTO } from '../features/patients/models/MedicalInformationUpdateDTO';
import { MedicalInformationResponseDTO } from '../features/patients/models/MedicalInformationResponseDTO ';
import { PatientUpdateDTO } from '../features/patients/models/PatientUpdateDTO';
import { NotesUpdateDTO } from '../features/patients/models/NotesUpdateDTO';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl: string = environment.API_BASE_URL

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwicm9sZSI6IlJPTEVfU1BFQ0lBTElTVCIsImV4cCI6MTczODY2MDgzMH0.dsC1zQyTAYtp0nIZkHe_IePi4JIWzrmIDpLXJounSf5j2VZj8viDxPqfDLPQlNbZ51Z0VdwKTCTQHrBj8g5FJA'
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

  // getPatients(specialistId: number){
  //   return this.http.get<PatientResponseDTO[]>(`${this.apiUrl}/patients/specialist/${specialistId}`, this.httpOptions)
  //     .pipe(
  //       retry(2),
  //       catchError(this.handleError))
  // }

  getPatientsWithFilters(
    specialistId: number,
    filters: {
      searchByNameAndLastName: string|null,
      female: boolean,
      male: boolean,
      minAge: number|null,
      maxAge: number|null,
      sortBy: string|null,
    }
  ) {
    let params = new HttpParams()

    // Agregar los parámetros solo si existen
    if (filters.searchByNameAndLastName) {
      params = params.set('searchByNameAndLastName', filters.searchByNameAndLastName)
    }
    if (filters.female != undefined) {
      params = params.set('female', filters.female.toString())
    }
    if (filters.male != undefined) {
      params = params.set('male', filters.male.toString())
    }
    if (filters.minAge != undefined) {
      params = params.set('minAge', filters.minAge.toString())
    }
    if (filters.maxAge != undefined) {
      params = params.set('maxAge', filters.maxAge.toString())
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy)
    }

    return this.http.get<PatientResponseDTO[]>(`${this.apiUrl}/patients/filter/specialist/${specialistId}`,{
        ...this.httpOptions,
        params,
      })
        .pipe(retry(2), catchError(this.handleError))
  }

  getPatientDetails(patientId:number) {
    return this.http.get<PatientDetailsDTO>(`${this.apiUrl}/patients/${patientId}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  updateMedicalInformation(patientId:number, medicalInformation:MedicalInformationUpdateDTO) {
    return this.http.put<MedicalInformationResponseDTO>(`${this.apiUrl}/patients/${patientId}/updateMedicalInfo`, 
      medicalInformation, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  updatePatientById(patientId:number, patientUpdateDTO: PatientUpdateDTO) {
    return this.http.put<PatientResponseDTO>(`${this.apiUrl}/patients/${patientId}`, 
      patientUpdateDTO, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  updateNotes(patientId:number, notesUpdateDTO: NotesUpdateDTO) {
    return this.http.put<PatientResponseDTO>(`${this.apiUrl}/patients/${patientId}/updateNotes`, 
      notesUpdateDTO, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }
}
