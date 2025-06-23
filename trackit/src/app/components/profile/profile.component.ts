import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User, UserProfile } from '../../models/user.model';
import { CustomValidators } from '../../utils/validators';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, MatCardModule, MatIcon, ReactiveFormsModule, MatFormFieldModule, MatLabel, MatIcon, MatError, MatSpinner]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  isUpdatingPassword = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6), CustomValidators.passwordStrength()]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  onUpdateProfile() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const profileData = this.profileForm.value;

      this.userService.updateProfile(profileData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      this.isUpdatingPassword = true;
      const { currentPassword, newPassword } = this.passwordForm.value;

      this.userService.changePassword(currentPassword, newPassword).subscribe({
        next: (response) => {
          this.isUpdatingPassword = false;
          this.passwordForm.reset();
          this.snackBar.open('Password changed successfully!', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          this.isUpdatingPassword = false;
          this.snackBar.open('Failed to change password. Please check your current password.', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  getUserInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  }

  getJoinDate(): string {
    if (this.currentUser?.createdAt) {
      return new Date(this.currentUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Unknown';
  }
}