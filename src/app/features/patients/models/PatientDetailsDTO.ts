import { AppointmentForPatientDTO } from "../../appointments/models/AppointmentForPatientDTO";
import { Allergy } from "./Allergy";
import { CustomAllergy } from "./CustomAllergy";
import { Gender } from "./Gender";
import { MedicalInformationResponseDTO } from "./MedicalInformationResponseDTO ";

export interface PatientDetailsDTO {
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
    medicalInformation: MedicalInformationResponseDTO,
    allergies: PatientAllergyResponseDTO[],
    customAllergies: CustomAllergy[],
    appointments: AppointmentForPatientDTO[]
}
interface PatientAllergyResponseDTO {
    allergy: Allergy
}