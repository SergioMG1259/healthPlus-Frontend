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

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor(private _authService: AuthService, private _router: Router) {}
//   private logout() {
//     sessionStorage.removeItem('accessTokenHealthPlus');
//     sessionStorage.removeItem('refreshTokenHealthPlus');
//   }
//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     if(request.url.includes('/auth/refresh')) {
//       console.log("asdasdads")
//       // only for this route skip interceptor logic
//       return next.handle(request)
//    }
//     const accessToken = sessionStorage.getItem('accessTokenHealthPlus')

//     // Si no hay token en sessionStorage, significa que el usuario no ha iniciado sesión
//     // y la petición no necesita ser interceptada (ejemplo: login, register)
//     if (!accessToken) {
//       return next.handle(request)
//     }

//     const authRequest = request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${accessToken}`
//       }
//     })
    
//     return next.handle(authRequest).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.log(error)
//         if (error.status == 401) {
//           // Intentar refrescar el token
//           console.log("refresca")
//           const refreshToken = sessionStorage.getItem('refreshTokenHealthPlus')

//           // if (!refreshToken) {
//           //   console.log("⚠️ No hay refresh token, cerrando sesión...");
//           //   this.logout();
//           //   return throwError(() => error);
//           // }

//           const refreshTokenRequestDTO: RefreshTokenRequestDTO = {
//             refreshToken: refreshToken!
//           }

//           return this._authService.refreshToken(refreshTokenRequestDTO).pipe(
//             switchMap((accessTokenResponseDTO: AccessTokenResponseDTO) => {
//               sessionStorage.setItem('accessTokenHealthPlus', accessTokenResponseDTO.accessToken)

//               // Reintentar la solicitud original con el nuevo token
//               const clonedRequest = request.clone({
//                 setHeaders: {
//                   Authorization: `Bearer ${accessTokenResponseDTO.accessToken}`
//                 }
//               })
//               console.log("si lo hizo")
//               return next.handle(clonedRequest)
//             }),
//             catchError(refreshError => {
//               console.log("entra aqui", refreshError)
//               // Si el refresh token también es inválido, cerrar sesión
//               if (refreshError.status == 401) {
//                 // this.authService.logout();
//                 console.log("abw")
//                 return throwError(() => new Error("Refresh token inválido, sesión cerrada."))
//               }
              
//               console.log("Error")
//               return throwError(() => refreshError)
//             })
//           )
//         }
//         console.log("as")
//         // Si el error no es por token caducado, devolverlo sin modificar
//         return throwError(() => error)
//       })
//     )
//   }
// }


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private _authService: AuthService, private _router: Router) {}

  private logout(): void {
    sessionStorage.removeItem('accessTokenHealthPlus')
    sessionStorage.removeItem('isLoggedInHealthPlus')
    // sessionStorage.removeItem('refreshTokenHealthPlus')
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
        sessionStorage.setItem('accessTokenHealthPlus', response.accessToken)
        return next.handle(this.cloneRequestWithToken(request, response.accessToken))
      }),
      catchError(refreshError => {
        // Cuando el refresh token es invalido
        if (refreshError.status == 401) {
          this.logout()
        }
        return throwError(() => refreshError)
      })
    );
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.includes('/auth/refresh')) {
      return next.handle(request)
    }

    const accessToken = sessionStorage.getItem('accessTokenHealthPlus')
    // const refreshToken = sessionStorage.getItem('refreshTokenHealthPlus')

    // if (!accessToken || !refreshToken) {
    //   this._router.navigate(['/login'])
    //   return next.handle(request)
    // }

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