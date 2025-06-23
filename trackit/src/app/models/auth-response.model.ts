export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      profilePicture?: string;
      roles?: string[];
    };
    expiresIn: number;
    tokenType: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  
  export interface SignupRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    acceptTerms: boolean;
  }
  
  export interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  export interface ForgotPasswordRequest {
    email: string;
  }
  
  export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }