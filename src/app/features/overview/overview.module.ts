import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './pages/overview/overview.component';
import { CardMetricComponent } from './components/card-metric/card-metric.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { TodaysAppointmentsComponent } from './components/todays-appointments/todays-appointments.component';
import { SharedModule } from "../../shared/shared.module";
import { GenderChartComponent } from './components/gender-chart/gender-chart.component';
import { PatientsChartComponent } from './components/patients-chart/patients-chart.component';
import { EarningChartComponent } from './components/earning-chart/earning-chart.component';


@NgModule({
  declarations: [
    OverviewComponent,
    CardMetricComponent,
    TodaysAppointmentsComponent,
    GenderChartComponent,
    PatientsChartComponent,
    EarningChartComponent
  ],
  imports: [
    CommonModule,
    OverviewRoutingModule,
    MaterialModule,
    SharedModule
]
})
export class OverviewModule { }
