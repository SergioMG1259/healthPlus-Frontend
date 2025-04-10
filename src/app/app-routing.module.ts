import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { NoAuthGuard } from './features/auth/guards/no-auth.guard';
import { NotFoundComponent } from './features/layout/pages/not-found/not-found.component';

const routes: Routes = [
  {
    path:'',
    loadChildren: () => import('./features/layout/layout.module').then(m => m.LayoutModule)
  }, {
    path:'login',
    component: LoginComponent,
    canActivate: [NoAuthGuard]
  }, {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NoAuthGuard]
  }, {
    path:'**',
    component:NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
