import { Component, OnInit } from '@angular/core';
import { CardMetric } from '../../models/cardMatric';
import { SpecialistService } from 'src/app/services/specialist.service';
import { delay } from 'rxjs';
import { AppointmentResponseDTO } from 'src/app/features/appointments/models/AppointmentResponseDTO';
import { PatientResponseDTO } from 'src/app/features/patients/models/PatientResponseDTO';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  isLoading: boolean = true

  cardMetrics: CardMetric[] = [
    {
      category: "patients",
      amount :  null
    },
    {
      category: "appointments",
      amount :  null
    },
    {
      category: "earning",
      amount :  null
    }
  ]
  earningChartLabel: string[] = []
  earningChartCounts: number[] = []
  patientChartLabel: string[] = []
  patientChartCounts: number[] = []
  genderChartLabel: string[] = []
  genderChartCounts: number[] = []
  appointmentsToday: AppointmentResponseDTO[] = []
  patients: PatientResponseDTO[] = []
  patientName: string = ''

  displayedColumns: string[] = ['patientName', 'gender', 'age', 'phone', 'createdAt']
  dataSource = [{},{},{},{},{}]

  constructor(private specialistService: SpecialistService) { }

  calculateAge(date: Date): number {
    const birthDate = new Date(date)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff == 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  ngOnInit(): void {
    this.specialistService.getOverview().pipe(delay(2000)).subscribe( e => {
      
      this.cardMetrics = [
        {
          category: "patients",
          amount :  e.totalPatients
        },
        {
          category: "appointments",
          amount :  e.totalAppointments
        },
        // {
        //   category: "predicts",
        //   amount :  27,
        //   percentage: 17
        // },
        {
          category: "earning",
          amount :  e.totalEarning
        }
      ]
      this.earningChartLabel = e.earningChart.labels
      this.earningChartCounts = e.earningChart.counts
      this.patientChartLabel = e.patientChart.labels
      this.patientChartCounts = e.patientChart.counts
      this.genderChartLabel = e.genderChart.labels
      this.genderChartCounts = e.genderChart.counts
      this.appointmentsToday = e.appointments
      this.dataSource = e.patients
      this.patientName = e.patientName
      this.isLoading = false
    })
  }

}