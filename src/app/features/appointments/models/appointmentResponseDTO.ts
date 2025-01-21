import { PatientShortResponseDTO } from "../../patients/models/PatientShortResponseDTO";
import { MedicalIssue } from "./MedicalIssue";

export interface AppointmentResponseDTO {
    id: number,
    price: number,
    startDate: Date,
    endDate: Date,
    issue: MedicalIssue,
    patient: PatientShortResponseDTO
}