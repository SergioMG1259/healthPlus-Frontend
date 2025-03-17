import { Specialty } from "./Specialty";

export interface SpecialistCreateDTO {
    names: string;
    lastNames: string;
    birthDate: Date;
    medicalInstitution: string;
    yearsOfExperience: number;
    specialty: Specialty;
}