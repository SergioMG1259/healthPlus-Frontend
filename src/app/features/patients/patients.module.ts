import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { PatientListComponent } from './pages/patient-list/patient-list.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { CustomPaginatorDirective } from './directives/custom-paginator.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPatientComponent } from './components/filter-patient/filter-patient.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { FilterPatientService } from './services/filter-patient.service';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  providers:[FilterPatientService],
  declarations: [
    PatientListComponent,
    CustomPaginatorDirective,
    FilterPatientComponent
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    A11yModule
  ]
})
export class PatientsModule { }
