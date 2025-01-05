import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';

const routes: Routes = [
  { path:'',
    component: LayoutComponent,
    children: [
      {
        path: 'overview',
        loadChildren: () => import('../overview/overview.module').then(m => m.OverviewModule)
      },
      {
        path: 'patients',
        loadChildren: () => import('../patients/patients.module').then(m => m.PatientsModule)
      },
      {
        path: 'appointments',
        loadChildren: () => import('../appointments/appointments.module').then(m => m.AppointmentsModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
