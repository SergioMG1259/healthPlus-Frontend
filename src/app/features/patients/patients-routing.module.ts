import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './pages/patient-list/patient-list.component';
import { AddPatientComponent } from './pages/add-patient/add-patient.component';

const routes: Routes = [
  {
    path: '',
    component: PatientListComponent
  },
  {
    path:'add',
    component: AddPatientComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
