import { AppointmentResponseDTO } from "../../appointments/models/appointmentResponseDTO";
import { PatientResponseDTO } from "../../patients/models/PatientResponseDTO";

export interface Overview {
    totalPatients: number,
    totalAppointments: number,
    totalEarning: number,
    patients: PatientResponseDTO[],
    appointments: AppointmentResponseDTO[]
}