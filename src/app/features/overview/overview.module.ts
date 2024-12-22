import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './pages/overview/overview.component';
import { CardMetricComponent } from './components/card-metric/card-metric.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { TodaysAppointmentsComponent } from './components/todays-appointments/todays-appointments.component';


@NgModule({
  declarations: [
    OverviewComponent,
    CardMetricComponent,
    TodaysAppointmentsComponent
  ],
  imports: [
    CommonModule,
    OverviewRoutingModule,
    MaterialModule
  ]
})
export class OverviewModule { }
