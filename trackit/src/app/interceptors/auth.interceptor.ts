import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth header if token exists
    const authReq = this.addTokenHeader(req);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !authReq.url.includes('/auth/')) {
          return this.handle401Error(authReq, next);
        }
        
        return this.handleOtherErrors(error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();
    
    if (token && !request.url.includes('/auth/login') && !request.url.includes('/auth/signup')) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.authService.getToken();
      
      if (token) {
        return this.authService.refreshToken().pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(response.token);
            
            return next.handle(this.addTokenHeader(request));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.handleAuthError();
            return throwError(() => error);
          })
        );
      } else {
        this.handleAuthError();
        return throwError(() => new Error('No token available'));
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next.handle(this.addTokenHeader(request)))
    );
  }

  private handleAuthError(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.snackBar.open('Session expired. Please login again.', 'Close', {
      duration: 3000
    });
  }

  private handleOtherErrors(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    switch (error.status) {
      case 0:
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
        break;
      case 400:
        errorMessage = error.error?.message || 'Bad request';
        break;
      case 403:
        errorMessage = 'Access denied. You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 409:
        errorMessage = error.error?.message || 'Conflict occurred';
        break;
      case 422:
        errorMessage = error.error?.message || 'Validation failed';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'Internal server error. Please try again later.';
        break;
      case 503:
        errorMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }

    // Show error message for non-auth related errors
    if (error.status !== 401) {
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000
      });
    }

    console.error('HTTP Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}