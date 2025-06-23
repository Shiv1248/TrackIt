import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, UserProfile, UserPreferences } from '../models/user.model';
import { AuthService } from './auth.service';
import { API_ENDPOINTS } from '../utils/constants';

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Get user profile
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}${API_ENDPOINTS.USER.PROFILE}`)
      .pipe(catchError(this.handleError));
  }

  // Update user profile
  updateProfile(profileData: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}${API_ENDPOINTS.USER.UPDATE_PROFILE}`, profileData)
      .pipe(
        tap((updatedUser: User) => {
          // Update the current user in AuthService
          this.authService.updateCurrentUser(updatedUser);
        }),
        catchError(this.handleError)
      );
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const changePasswordData: ChangePasswordRequest = {
      currentPassword,
      newPassword
    };

    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.USER.CHANGE_PASSWORD}`, changePasswordData)
      .pipe(catchError(this.handleError));
  }

  // Update user preferences
  updatePreferences(preferences: UserPreferences): Observable<UserPreferences> {
    return this.http.put<UserPreferences>(`${this.apiUrl}/user/preferences`, preferences)
      .pipe(catchError(this.handleError));
  }

  // Get user preferences
  getPreferences(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(`${this.apiUrl}/user/preferences`)
      .pipe(catchError(this.handleError));
  }

  // Upload profile picture
  uploadProfilePicture(file: File): Observable<{ profilePictureUrl: string }> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.post<{ profilePictureUrl: string }>(`${this.apiUrl}/user/profile-picture`, formData)
      .pipe(
        tap((response) => {
          // Update current user with new profile picture URL
          this.authService.updateCurrentUser({ profilePicture: response.profilePictureUrl });
        }),
        catchError(this.handleError)
      );
  }

  // Delete profile picture
  deleteProfilePicture(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/profile-picture`)
      .pipe(
        tap(() => {
          // Remove profile picture from current user
          this.authService.updateCurrentUser({ profilePicture: undefined });
        }),
        catchError(this.handleError)
      );
  }

  // Get user statistics
  getUserStats(): Observable<{
    totalExpenses: number;
    monthlyAverage: number;
    categoriesUsed: number;
    accountAge: number;
  }> {
    return this.http.get<{
      totalExpenses: number;
      monthlyAverage: number;
      categoriesUsed: number;
      accountAge: number;
    }>(`${this.apiUrl}/user/stats`)
      .pipe(catchError(this.handleError));
  }

  // Deactivate account
  deactivateAccount(password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/user/deactivate`, { password })
      .pipe(catchError(this.handleError));
  }

  // Request account deletion
  requestAccountDeletion(password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/user/request-deletion`, { password })
      .pipe(catchError(this.handleError));
  }

  // Cancel account deletion request
  cancelAccountDeletion(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/user/cancel-deletion`, {})
      .pipe(catchError(this.handleError));
  }

  // Export user data
  exportUserData(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/user/export-data`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  // Update notification settings
  updateNotificationSettings(settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/notification-settings`, settings)
      .pipe(catchError(this.handleError));
  }

  // Get notification settings
  getNotificationSettings(): Observable<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
  }> {
    return this.http.get<{
      emailNotifications: boolean;
      pushNotifications: boolean;
      weeklyReports: boolean;
      monthlyReports: boolean;
    }>(`${this.apiUrl}/user/notification-settings`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while processing your request';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request data';
          break;
        case 401:
          errorMessage = 'Unauthorized access';
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'User not found';
          break;
        case 409:
          errorMessage = 'Email already exists';
          break;
        case 422:
          errorMessage = 'Validation failed';
          break;
        case 500:
          errorMessage = 'Server error occurred';
          break;
      }
    }
    
    console.error('User Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}