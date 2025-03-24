import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-earning-chart',
  templateUrl: './earning-chart.component.html',
  styleUrls: ['./earning-chart.component.css']
})
export class EarningChartComponent implements OnInit {

  earningChart: Chart | null = null
  @Input() labels: string[] = []
  @Input() earnings: number[] = [] 

  constructor() { }

  ngOnInit(): void {

    Chart.defaults.font.family = '"Poppins", serif'
    Chart.defaults.font.size = 13

    this.earningChart = new Chart("earningChart", {
      type: 'line',
      data : {
        labels: this.labels,
        datasets: [{
          label: 'Earning',
          data: this.earnings,
          fill: 'start',
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx
            const gradient = ctx.createLinearGradient(0, 0, 0, 230)
            gradient.addColorStop(0, "rgba(75, 192, 192, 0.29)")
            gradient.addColorStop(1, "rgba(75, 192, 192, 0)")
            return gradient
          },
          tension: 0.2
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
