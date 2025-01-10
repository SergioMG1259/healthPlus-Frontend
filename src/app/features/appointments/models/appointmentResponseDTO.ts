import { PatientShortDTO } from "../../patients/models/PatientShortDTO";

export interface AppointmentResponseDTO {
    price: number,
    startDate: Date,
    endDate: Date,
    issue: string,
    patient: PatientShortDTO
}