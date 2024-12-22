import { Component, OnInit } from '@angular/core';
import { CardMetric } from '../../models/cardMatric';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  cardMetrics: CardMetric[] = [
    {
      category: "appointments",
      amount :  38,
      percentage: 17
    },
    {
      category: "patients",
      amount :  35,
      percentage: 17
    },
    {
      category: "predicts",
      amount :  27,
      percentage: 17
    },
    {
      category: "earning",
      amount :  9205,
      percentage: 17
    }
  ]

  displayedColumns: string[] = ['patientName', 'gender', 'age', 'phone', 'createdAt'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
const ELEMENT_DATA: any[] = [
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  // {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'}
];