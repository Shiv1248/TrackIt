import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, SignupRequest } from '../models/auth-response.model';
import { User } from '../models/user.model';
import { API_ENDPOINTS } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'trackit_token';
  private userKey = 'trackit_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is already logged in on service initialization
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    const userData = localStorage.getItem(this.userKey);
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        // Optionally validate token with backend
        this.validateToken(token).subscribe({
          error: () => this.logout()
        });
      } catch (error) {
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const loginData: LoginRequest = { email, password };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`, loginData)
      .pipe(
        tap((response: AuthResponse) => {
          this.setAuthData(response);
        }),
        catchError(this.handleError)
      );
  }

  signup(userData: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.SIGNUP}`, userData)
      .pipe(
        tap((response: AuthResponse) => {
          this.setAuthData(response);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Call logout endpoint if needed
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}${API_ENDPOINTS.AUTH.LOGOUT}`, {})
        .subscribe({
          complete: () => this.clearAuthData()
        });
    } else {
      this.clearAuthData();
    }
  }

  refreshToken(): Observable<AuthResponse> {
    const token = this.getToken();
    return this.http.post<AuthResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`, { token })
      .pipe(
        tap((response: AuthResponse) => {
          this.setAuthData(response);
        }),
        catchError(this.handleError)
      );
  }

  validateToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.AUTH.VALIDATE}`, { token })
      .pipe(
        tap((response: any) => {
          if (response.user) {
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(this.handleError)
      );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user as User);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Utility method to check if user has specific role (for future use)
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  // Method to update current user data
  updateCurrentUser(userData: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }
}