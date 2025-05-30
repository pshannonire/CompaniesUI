import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't intercept the login request itself
    if (req.url.endsWith('/api/auth/login')) {
      return next.handle(req);
    }
    return from(this.authService.authenticate()).pipe(
      switchMap(() => {
        const token = this.authService.getToken();
        const tokenType = this.authService.getTokenType();
        if (token) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `${tokenType} ${token}`
            }
          });
          return next.handle(cloned);
        }
        return next.handle(req);
      })
    );
  }
}
