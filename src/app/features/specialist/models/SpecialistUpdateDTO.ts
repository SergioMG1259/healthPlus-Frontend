import { Specialty } from "./Specialty";

export interface SpecialistUpdateDTO {
    names: string,
    lastNames: string,
    birthDate: string,
    medicalInstitution: string,
    yearsOfExperience: number,
    specialty: Specialty,
    email: string
}