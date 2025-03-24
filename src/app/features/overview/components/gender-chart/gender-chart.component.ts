import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-gender-chart',
  templateUrl: './gender-chart.component.html',
  styleUrls: ['./gender-chart.component.css']
})
export class GenderChartComponent implements OnInit {

  genderChart: Chart | null = null
  @Input() labels: string[] = []
  @Input() gender: number[] = []

  constructor() { }

  ngOnInit(): void {

    Chart.defaults.font.family = '"Poppins", serif'
    Chart.defaults.font.size = 13

    this.genderChart = new Chart("genderChart", {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.gender,
          backgroundColor: [
            'rgb(22, 144, 238)',
            'rgb(252, 132, 34)'
          ],
          borderColor: [
            '#f5f5f5',
            '#f5f5f5'
          ]
        }]
      },
      options: {
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context:any) {

                let data: number[] = context.dataset.data
                let total: number = data.reduce((sum, value) => sum + value, 0) // Suma todos los valores
                let percentage: number = (context.parsed / total) * 100 // Calcula el porcentaje
                
                return `${context.parsed} (${percentage.toFixed(2)}%)` // Formatea el resultado
              }
            }
          },
          legend: {
            display: true,
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
