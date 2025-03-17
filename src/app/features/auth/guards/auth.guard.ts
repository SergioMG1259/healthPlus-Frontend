import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Buscar el estado de autenticación en sessionStorage y localStorage
    const isLoggedIn =
      sessionStorage.getItem('isLoggedInHealthPlus') == 'true' ||
      localStorage.getItem('isLoggedInHealthPlus') == 'true'

    if (isLoggedIn) {
      return true
    } else {
      this.router.navigate(['/login'])
      return false
    }
  }
  
}
