import { MedicalIssue } from "./MedicalIssue";

export interface AppointmentCreateDTO {
    price: number,
    startDate: Date,
    endDate: Date,
    issue: MedicalIssue
}