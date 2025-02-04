import { MedicalIssue } from "./MedicalIssue";

export interface AppointmentUpdateDTO {
    price: number,
    startDate: Date,
    endDate: Date,
    issue: MedicalIssue
}