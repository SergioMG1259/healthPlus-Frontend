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
import { AddPatientComponent } from './pages/add-patient/add-patient.component';
import { PatientDetailsComponent } from './pages/patient-details/patient-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditBasicInformationDialogComponent } from './components/edit-basic-information-dialog/edit-basic-information-dialog.component';
import { EditMedicalInformationDialogComponent } from './components/edit-medical-information-dialog/edit-medical-information-dialog.component';
import { DeletePatientDialogComponent } from './components/delete-patient-dialog/delete-patient-dialog.component';

@NgModule({
  providers:[FilterPatientService],
  declarations: [
    PatientListComponent,
    CustomPaginatorDirective,
    FilterPatientComponent,
    AddPatientComponent,
    PatientDetailsComponent,
    EditBasicInformationDialogComponent,
    EditMedicalInformationDialogComponent,
    DeletePatientDialogComponent
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    A11yModule,
    OverlayModule,
    SharedModule
  ]
})
export class PatientsModule { }
