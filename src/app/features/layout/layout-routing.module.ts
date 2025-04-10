import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  { path:'',
    component: LayoutComponent,
    canActivate: [AuthGuard],
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
      },
      {
        path: 'profile',
        loadChildren: () => import('../specialist/specialist.module').then(m => m.SpecialistModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
