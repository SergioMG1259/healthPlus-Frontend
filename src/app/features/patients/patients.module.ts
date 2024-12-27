import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { PatientListComponent } from './pages/patient-list/patient-list.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { CustomPaginatorDirective } from './directives/custom-paginator.directive';


@NgModule({
  declarations: [
    PatientListComponent,
    CustomPaginatorDirective
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    MaterialModule
  ]
})
export class PatientsModule { }
