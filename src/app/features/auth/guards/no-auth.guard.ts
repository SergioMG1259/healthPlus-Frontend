import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): boolean {

    // Verificar si el usuario ya está autenticado
    const isLoggedIn =
      sessionStorage.getItem('isLoggedInHealthPlus') == 'true' ||
      localStorage.getItem('isLoggedInHealthPlus') == 'true'

    if (isLoggedIn) {
      this.router.navigate(['/overview'])
      return false
    }

    return true
  }
  
}
