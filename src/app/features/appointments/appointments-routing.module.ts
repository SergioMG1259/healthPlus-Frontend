import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsCalendarComponent } from './pages/appointments-calendar/appointments-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsCalendarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
