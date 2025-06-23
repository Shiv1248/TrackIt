export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    roles?: string[];
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    lastLoginAt?: Date;
  }
  
  export interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    preferences?: UserPreferences;
    stats?: UserStats;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserPreferences {
    currency: string;
    dateFormat: string;
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: NotificationSettings;
  }
  
  export interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
    expenseReminders: boolean;
    budgetAlerts: boolean;
  }
  
  export interface UserStats {
    totalExpenses: number;
    monthlyAverage: number;
    categoriesUsed: number;
    accountAge: number;
    lastExpenseDate?: Date;
    mostUsedCategory?: string;
  }