import { Specialty } from "./Specialty";

export interface SpecialistResponseDTO {
    names: string,
    lastNames: string,
    birthDate: Date,
    medicalInstitution: string,
    yearsOfExperience: number,
    specialty: Specialty,
    email: string
}