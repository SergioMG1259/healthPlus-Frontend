import { Gender } from "./Gender";

export interface PatientResponseDTO {
    id: number,
    names: string,
    lastNames: string,
    gender: Gender,
    birthDate: Date,
    dni: string,
    phoneNumber: string,
    email: string,
    address: string,
    notes: string,
    createdAt: Date,
}