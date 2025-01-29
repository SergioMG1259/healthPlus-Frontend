import { MedicalIssue } from "./MedicalIssue";

export interface AppointmentForPatientDTO {
    id: number,
    price: number,
    startDate: Date,
    endDate: Date,
    issue: MedicalIssue,
    createdDate: Date
}