export const EXPENSE_CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Shopping',
    'Education',
    'Travel',
    'Insurance',
    'Rent/Mortgage',
    'Groceries',
    'Gas/Fuel',
    'Internet/Phone',
    'Subscriptions',
    'Fitness/Gym',
    'Personal Care',
    'Gifts',
    'Charity',
    'Investment',
    'Other'
  ];
  
  export const EXPENSE_STATUSES = [
    { value: 'paid', label: 'Paid', color: 'primary', icon: 'check_circle' },
    { value: 'pending', label: 'Pending', color: 'warn', icon: 'schedule' },
    { value: 'upcoming', label: 'Upcoming', color: 'accent', icon: 'event' }
  ];
  
  export const DATE_FORMATS = {
    SHORT: 'MM/dd/yyyy',
    MEDIUM: 'MMM dd, yyyy',
    LONG: 'MMMM dd, yyyy',
    ISO: 'yyyy-MM-dd'
  };
  
  export const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' }
  ];
  
  export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh-token',
      VALIDATE: '/auth/validate-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password'
    },
    EXPENSES: {
      BASE: '/expenses',
      BY_ID: (id: number) => `/expenses/${id}`,
      BY_STATUS: (status: string) => `/expenses?status=${status}`,
      BY_CATEGORY: (category: string) => `/expenses?category=${category}`,
      SEARCH: '/expenses/search',
      STATS: '/expenses/stats',
      EXPORT: '/expenses/export',
      BULK_DELETE: '/expenses/bulk-delete'
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      CHANGE_PASSWORD: '/user/change-password',
      PREFERENCES: '/user/preferences',
      STATS: '/user/stats',
      UPLOAD_AVATAR: '/user/avatar',
      NOTIFICATIONS: '/user/notifications'
    },
    CATEGORIES: {
      BASE: '/categories',
      BY_ID: (id: number) => `/categories/${id}`,
      USER_CATEGORIES: '/categories/user'
    }
  };
  
  export const THEMES = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'auto', label: 'Auto', icon: 'brightness_auto' }
  ];
  
  export const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];
  
  export const CATEGORY_ICONS = {
    'Food & Dining': 'restaurant',
    'Transportation': 'directions_car',
    'Entertainment': 'movie',
    'Utilities': 'electrical_services',
    'Healthcare': 'local_hospital',
    'Shopping': 'shopping_cart',
    'Education': 'school',
    'Travel': 'flight',
    'Insurance': 'security',
    'Rent/Mortgage': 'home',
    'Groceries': 'local_grocery_store',
    'Gas/Fuel': 'local_gas_station',
    'Internet/Phone': 'wifi',
    'Subscriptions': 'subscriptions',
    'Fitness/Gym': 'fitness_center',
    'Personal Care': 'spa',
    'Gifts': 'card_giftcard',
    'Charity': 'volunteer_activism',
    'Investment': 'trending_up',
    'Other': 'category'
  };
  
  export const APP_CONFIG = {
    APP_NAME: 'TrackIt',
    VERSION: '1.0.0',
    AUTHOR: 'TrackIt Team',
    DESCRIPTION: 'Personal Expense Tracker',
    SUPPORT_EMAIL: 'support@trackit.com',
    PRIVACY_POLICY_URL: '/privacy-policy',
    TERMS_OF_SERVICE_URL: '/terms-of-service'
  };
  
  export const VALIDATION_PATTERNS = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE: /^\+?[\d\s\-$$$$]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    AMOUNT: /^\d+(\.\d{1,2})?$/
  };
  
  export const LOCAL_STORAGE_KEYS = {
    TOKEN: 'trackit_token',
    REFRESH_TOKEN: 'trackit_refresh_token',
    USER: 'trackit_user',
    PREFERENCES: 'trackit_preferences',
    THEME: 'trackit_theme',
    LANGUAGE: 'trackit_language'
  };