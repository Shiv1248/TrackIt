export interface Expense {
    id?: number;
    title: string;
    amount: number;
    category: string;
    date: Date;
    status: 'paid' | 'pending' | 'upcoming';
    description?: string;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface CreateExpenseRequest {
    title: string;
    amount: number;
    category: string;
    date: Date;
    status: 'paid' | 'pending' | 'upcoming';
    description?: string;
  }
  
  export interface UpdateExpenseRequest extends CreateExpenseRequest {
    id: number;
  }
  
  export interface ExpenseCategory {
    id: number;
    name: string;
    icon: string;
    color: string;
    isDefault: boolean;
    userId?: number;
  }
  
  export interface ExpenseSummary {
    totalAmount: number;
    count: number;
    averageAmount: number;
    categoryBreakdown: { [category: string]: number };
    statusBreakdown: { [status: string]: number };
    monthlyTrend: { month: string; amount: number }[];
  }