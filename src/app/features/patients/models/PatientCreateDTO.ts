import { AllergyGroupCreateDTO } from "./AllergyGroupCreateDTO";
import { Gender } from "./Gender";

export interface PatientCreateDTO {
    names: string,
    lastNames: string,
    gender: Gender,
    birthDate: Date,
    dni: string,
    phoneNumber: string,
    email: string,
    address: string,
    notes: string,
    allergiesGroup: AllergyGroupCreateDTO
}