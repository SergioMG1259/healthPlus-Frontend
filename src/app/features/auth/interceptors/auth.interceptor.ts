import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, retry, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AccessTokenResponseDTO } from '../models/AccessTokenResponseDTO';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private _authService: AuthService, private _router: Router) {}

  private logout(): void {
    localStorage.removeItem('userRolIdHealthPlus')
    localStorage.removeItem('roleHealthPlus')
    localStorage.removeItem('accessTokenHealthPlus')
    localStorage.removeItem('isLoggedInHealthPlus')
    // if(localStorage.getItem('rememberMeHealthPlus'))
    //   localStorage.removeItem('rememberMeHealthPlus')

    this._router.navigate(['/login'])
  }

  private cloneRequestWithToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  private handleUnauthorizedError(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // const refreshToken = sessionStorage.getItem('refreshTokenHealthPlus')

    // Solicita un nuevo access token
    return this._authService.refreshToken().pipe(
      switchMap((response: AccessTokenResponseDTO) => {

        localStorage.setItem('accessTokenHealthPlus', response.accessToken)

        return next.handle(this.cloneRequestWithToken(request, response.accessToken))
      }),
      catchError(refreshError => {
        // Cuando el refresh token es invalido
        if (refreshError.status == 401) {
          this.logout()
        }
        return throwError(() => refreshError)
      })
    )
  }

  // private getAccessToken(): string | null {
  //   return sessionStorage.getItem('accessTokenHealthPlus') || localStorage.getItem('accessTokenHealthPlus')
  // }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.includes('/auth/refresh') || request.url.includes('/auth/login')) {
      return next.handle(request)
    }

    // const accessToken = this._sessionService.getToken()
    const accessToken = localStorage.getItem('accessTokenHealthPlus')

    return next.handle(this.cloneRequestWithToken(request, accessToken!)).pipe(
      catchError((error: HttpErrorResponse) => {
        // Cuando el access token no es valido
        if (error.status == 401) {
          return this.handleUnauthorizedError(request, next)
        }
        return throwError(() => error)
      })
    )
  }
}