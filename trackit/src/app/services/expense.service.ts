import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../models/expense.model';
import { API_ENDPOINTS } from '../utils/constants';

export interface ExpenseFilters {
  status?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  monthlyTotal: number;
  categoryBreakdown: { [key: string]: number };
  statusBreakdown: { [key: string]: number };
  monthlyTrend: { month: string; amount: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get all expenses with optional filters
  getExpenses(filters?: ExpenseFilters): Observable<Expense[]> {
    // For testing backend connectivity, use the test endpoint
    return this.http.get<Expense[]>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BASE}/test`)
      .pipe(
        map(expenses => expenses.map(expense => ({
          ...expense,
          date: new Date(expense.date)
        }))),
        catchError(this.handleError)
      );
  }

  // Get expense by ID
  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BY_ID(id)}`)
      .pipe(
        map(expense => ({
          ...expense,
          date: new Date(expense.date)
        })),
        catchError(this.handleError)
      );
  }

  // Create new expense
  createExpense(expense: CreateExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BASE}`, expense)
      .pipe(
        map(expense => ({
          ...expense,
          date: new Date(expense.date)
        })),
        catchError(this.handleError)
      );
  }

  // Update existing expense
  updateExpense(id: number, expense: UpdateExpenseRequest): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BY_ID(id)}`, expense)
      .pipe(
        map(expense => ({
          ...expense,
          date: new Date(expense.date)
        })),
        catchError(this.handleError)
      );
  }

  // Delete expense
  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BY_ID(id)}`)
      .pipe(catchError(this.handleError));
  }

  // Get expenses by status
  getExpensesByStatus(status: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BY_STATUS(status)}`)
      .pipe(
        map(expenses => expenses.map(expense => ({
          ...expense,
          date: new Date(expense.date)
        }))),
        catchError(this.handleError)
      );
  }

  // Get expenses by category
  getExpensesByCategory(category: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BY_CATEGORY(category)}`)
      .pipe(
        map(expenses => expenses.map(expense => ({
          ...expense,
          date: new Date(expense.date)
        }))),
        catchError(this.handleError)
      );
  }

  // Get expense statistics
  getExpenseStats(): Observable<ExpenseStats> {
    return this.http.get<ExpenseStats>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BASE}/stats`)
      .pipe(catchError(this.handleError));
  }

  // Get monthly expense summary
  getMonthlyExpenses(year: number, month: number): Observable<Expense[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.http.get<Expense[]>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BASE}/monthly`, { params })
      .pipe(
        map(expenses => expenses.map(expense => ({
          ...expense,
          date: new Date(expense.date)
        }))),
        catchError(this.handleError)
      );
  }

  // Bulk delete expenses
  bulkDeleteExpenses(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BASE}/bulk-delete`, { ids })
      .pipe(catchError(this.handleError));
  }

  // Export expenses to CSV
  exportExpenses(filters?: ExpenseFilters): Observable<Blob> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom.toISOString());
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo.toISOString());
    }

    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BASE}/export`, {
      params,
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  // Search expenses
  searchExpenses(query: string): Observable<Expense[]> {
    const params = new HttpParams().set('q', query);
    
    return this.http.get<Expense[]>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BASE}/search`, { params })
      .pipe(
        map(expenses => expenses.map(expense => ({
          ...expense,
          date: new Date(expense.date)
        }))),
        catchError(this.handleError)
      );
  }

  // Get expense categories with counts
  getExpenseCategories(): Observable<{ category: string; count: number; total: number }[]> {
    return this.http.get<{ category: string; count: number; total: number }[]>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BASE}/categories`)
      .pipe(catchError(this.handleError));
  }

  // Update expense status
  updateExpenseStatus(id: number, status: string): Observable<Expense> {
    return this.http.patch<Expense>(`${this.apiUrl}${API_ENDPOINTS.EXPENSES.BY_ID(id)}/status`, { status })
      .pipe(
        map(expense => ({
          ...expense,
          date: new Date(expense.date)
        })),
        catchError(this.handleError)
      );
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
          errorMessage = 'Expense not found';
          break;
        case 500:
          errorMessage = 'Server error occurred';
          break;
      }
    }
    
    console.error('Expense Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}