import { Gender } from "./Gender";

export interface PatientUpdateDTO {
    names: string,
    lastNames: string,
    gender: Gender,
    birthDate: Date,
    dni: string,
    phoneNumber: string,
    email: string,
    address: string
}