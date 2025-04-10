import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './pages/layout/layout.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [
    LayoutComponent,
    SidenavComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MaterialModule
  ]
})
export class LayoutModule { }
