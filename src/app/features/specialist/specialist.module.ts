import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialistRoutingModule } from './specialist-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpecialistRoutingModule,
    MaterialModule
  ]
})
export class SpecialistModule { }
