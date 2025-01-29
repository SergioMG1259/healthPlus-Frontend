import { AppointmentResponseDTO } from "../../appointments/models/AppointmentResponseDTO";
import { PatientResponseDTO } from "../../patients/models/PatientResponseDTO";

export interface Overview {
    totalPatients: number,
    totalAppointments: number,
    totalEarning: number,
    patients: PatientResponseDTO[],
    appointments: AppointmentResponseDTO[]
}