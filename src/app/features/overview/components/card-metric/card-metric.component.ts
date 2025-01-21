import { Component, Input, OnInit } from '@angular/core';
import { CardMetric } from '../../models/cardMatric';

@Component({
  selector: 'app-card-metric',
  templateUrl: './card-metric.component.html',
  styleUrls: ['./card-metric.component.css']
})
export class CardMetricComponent implements OnInit {

  @Input() metric!:CardMetric
  
  iconsDictionary: Record<string, string> = {
    appointments: "calendar_month",
    patients: "accessible",
    predicts: "show_chart",
    earning: "attach_money"
  }

  constructor() { }

  ngOnInit(): void {
  }

}
