import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-patients-chart',
  templateUrl: './patients-chart.component.html',
  styleUrls: ['./patients-chart.component.css']
})
export class PatientsChartComponent implements OnInit {

  patientsChart: Chart | null = null
  @Input() labels: string[] = []
  @Input() patients: number[] = [] 

  constructor() { }

  ngOnInit(): void {

    Chart.defaults.font.family = '"Poppins", serif'
    Chart.defaults.font.size = 13

    this.patientsChart = new Chart("patientsChart", {
      type: 'bar',
      data : {
        labels: this.labels,
        datasets: [{
          label: 'New patients',
          data: this.patients,
          borderColor: 'rgb(113, 82, 236)',
          backgroundColor: 'rgba(113, 82, 236, 0.68)',
          borderRadius: 5
        }]
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            labels: {
              color: '#616161',
              // font: {
              //   family: '"Poppins", serif',
              //   size: 13
              // }
            },
            onClick: () => {},
          }
        }
      }
    })
  }
}
