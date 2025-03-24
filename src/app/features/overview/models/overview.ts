import { AppointmentResponseDTO } from "../../appointments/models/AppointmentResponseDTO";
import { PatientResponseDTO } from "../../patients/models/PatientResponseDTO";

export interface Overview {
    totalPatients: number,
    totalAppointments: number,
    totalEarning: number,
    patientName: string, 
    patients: PatientResponseDTO[],
    appointments: AppointmentResponseDTO[],
    patientChart: ChartDTO,
    earningChart: EarningChartDTO,
    genderChart: ChartDTO
}

interface ChartDTO {
    labels: string[],
    counts: number[]
}

interface EarningChartDTO {
    labels: string[],
    counts: number[]
}