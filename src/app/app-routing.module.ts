import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { NoAuthGuard } from './features/auth/guards/no-auth.guard';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
