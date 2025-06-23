import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export class CustomValidators {
  
  // Validate positive numbers
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value !== null && (isNaN(value) || value <= 0)) {
        return { positiveNumber: true };
      }
      return null;
    };
  }

  // Validate future dates
  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && new Date(value) <= new Date()) {
        return { futureDate: true };
      }
      return null;
    };
  }

  // Validate past or present dates
  static pastOrPresentDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && new Date(value) > new Date()) {
        return { pastOrPresentDate: true };
      }
      return null;
    };
  }

  // Validate date range
  static dateRange(startDateField: string, endDateField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const startDate = formGroup.get(startDateField)?.value;
      const endDate = formGroup.get(endDateField)?.value;

      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return { dateRange: true };
      }
      return null;
    };
  }

  // Validate password strength
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[#?!@$%^&*-]/.test(value);
      const isValidLength = value.length >= 8;

      const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isValidLength;

      if (!passwordValid) {
        return { 
          passwordStrength: {
            hasNumber,
            hasUpper,
            hasLower,
            hasSpecial,
            isValidLength
          }
        };
      }
      return null;
    };
  }

  // Validate password match
  static passwordMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get(passwordField)?.value;
      const confirmPassword = formGroup.get(confirmPasswordField)?.value;

      if (password && confirmPassword && password !== confirmPassword) {
        return { passwordMatch: true };
      }
      return null;
    };
  }

  // Validate email format
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(value)) {
        return { email: true };
      }
      return null;
    };
  }

  // Validate phone number
  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const phonePattern = /^\+?[\d\s\-$$$$]+$/;
      if (!phonePattern.test(value) || value.replace(/\D/g, '').length < 10) {
        return { phoneNumber: true };
      }
      return null;
    };
  }

  // Validate amount format (up to 2 decimal places)
  static amount(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const amountPattern = /^\d+(\.\d{1,2})?$/;
      if (!amountPattern.test(value.toString())) {
        return { amount: true };
      }
      return null;
    };
  }

  // Validate minimum amount
  static minAmount(minValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value !== null && value < minValue) {
        return { minAmount: { requiredAmount: minValue, actualAmount: value } };
      }
      return null;
    };
  }

  // Validate maximum amount
  static maxAmount(maxValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value !== null && value > maxValue) {
        return { maxAmount: { requiredAmount: maxValue, actualAmount: value } };
      }
      return null;
    };
  }

  // Validate file size
  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (file && file.size) {
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
          return { fileSize: { maxSize: maxSizeInMB, actualSize: Math.round(file.size / 1024 / 1024 * 100) / 100 } };
        }
      }
      return null;
    };
  }

  // Validate file type
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (file && file.type) {
        if (!allowedTypes.includes(file.type)) {
          return { fileType: { allowedTypes, actualType: file.type } };
        }
      }
      return null;
    };
  }

  // Validate URL format
  static url(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      try {
        new URL(value);
        return null;
      } catch {
        return { url: true };
      }
    };
  }

  // Validate whitespace (no only whitespace)
  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && typeof value === 'string' && value.trim().length === 0) {
        return { noWhitespace: true };
      }
      return null;
    };
  }

  // Validate array minimum length
  static minArrayLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (Array.isArray(value) && value.length < minLength) {
        return { minArrayLength: { requiredLength: minLength, actualLength: value.length } };
      }
      return null;
    };
  }

  // Validate array maximum length
  static maxArrayLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (Array.isArray(value) && value.length > maxLength) {
        return { maxArrayLength: { requiredLength: maxLength, actualLength: value.length } };
      }
      return null;
    };
  }
}

// Helper function to get error messages
export function getErrorMessage(control: AbstractControl, fieldName: string = 'Field'): string {
  if (control.errors) {
    const errors = control.errors;
    
    if (errors['required']) {
      return `${fieldName} is required`;
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['minlength']) {
      return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['positiveNumber']) {
      return `${fieldName} must be a positive number`;
    }
    if (errors['futureDate']) {
      return `${fieldName} must be a future date`;
    }
    if (errors['pastOrPresentDate']) {
      return `${fieldName} cannot be a future date`;
    }
    if (errors['passwordStrength']) {
      return 'Password must contain uppercase, lowercase, number and special character';
    }
    if (errors['passwordMatch']) {
      return 'Passwords do not match';
    }
    if (errors['phoneNumber']) {
      return 'Please enter a valid phone number';
    }
    if (errors['amount']) {
      return 'Please enter a valid amount (up to 2 decimal places)';
    }
    if (errors['minAmount']) {
      return `Amount must be at least ${errors['minAmount'].requiredAmount}`;
    }
    if (errors['maxAmount']) {
      return `Amount cannot exceed ${errors['maxAmount'].requiredAmount}`;
    }
    if (errors['fileSize']) {
      return `File size cannot exceed ${errors['fileSize'].maxSize}MB`;
    }
    if (errors['fileType']) {
      return `File type must be one of: ${errors['fileType'].allowedTypes.join(', ')}`;
    }
    if (errors['url']) {
      return 'Please enter a valid URL';
    }
    if (errors['noWhitespace']) {
      return `${fieldName} cannot be empty or contain only whitespace`;
    }
  }
  
  return `${fieldName} is invalid`;
}