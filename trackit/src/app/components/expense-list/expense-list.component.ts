import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExpenseService } from '../../services/expense.service';
import { CreateExpenseComponent } from '../create-expense/create-expense.component';
import { Expense } from '../../models/expense.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatCell, MatHeaderCell, MatRow, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
  imports: [CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
    MatBadgeModule,
    MatSnackBarModule,
    FlexLayoutModule,
    MatCardModule,
    MatTabGroup,
    MatSpinner,
    MatTableModule,
    MatHeaderCell,
    MatCell,
    MatRow,
    MatTab
  ]
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  displayedColumns: string[] = ['title', 'amount', 'category', 'date', 'status', 'actions'];
  selectedTab = 0;
  isLoading = false;
  totalExpenses = 0;
  monthlyTotal = 0;

  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.isLoading = true;
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.calculateTotals();
        this.filterExpenses();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load expenses', 'Close', {
          duration: 3000
        });
      }
    });
  }

  calculateTotals() {
    this.totalExpenses = this.expenses
      .filter(e => e.status === 'paid')
      .reduce((sum, expense) => sum + expense.amount, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    this.monthlyTotal = this.expenses
      .filter(e => {
        const expenseDate = new Date(e.date);
        return e.status === 'paid' && 
               expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }

  onTabChange(index: number) {
    this.selectedTab = index;
    this.filterExpenses();
  }

  filterExpenses() {
    switch (this.selectedTab) {
      case 0: // All
        this.filteredExpenses = this.expenses;
        break;
      case 1: // Pending
        this.filteredExpenses = this.expenses.filter(e => e.status === 'pending');
        break;
      case 2: // Paid
        this.filteredExpenses = this.expenses.filter(e => e.status === 'paid');
        break;
      case 3: // Upcoming
        this.filteredExpenses = this.expenses.filter(e => e.status === 'upcoming');
        break;
    }
  }

  openCreateExpenseDialog() {
    const dialogRef = this.dialog.open(CreateExpenseComponent, {
      width: '500px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExpenses();
      }
    });
  }

  editExpense(expense: Expense) {
    const dialogRef = this.dialog.open(CreateExpenseComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: expense
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExpenses();
      }
    });
  }

  deleteExpense(expense: Expense) {
    if (confirm(`Are you sure you want to delete "${expense.title}"?`)) {
      this.expenseService.deleteExpense(expense.id!).subscribe({
        next: () => {
          this.snackBar.open('Expense deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadExpenses();
        },
        error: () => {
          this.snackBar.open('Failed to delete expense', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'paid': return 'primary';
      case 'pending': return 'warn';
      case 'upcoming': return 'accent';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'paid': return 'check_circle';
      case 'pending': return 'schedule';
      case 'upcoming': return 'event';
      default: return 'help';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'food': case 'food & dining': return 'restaurant';
      case 'transportation': return 'directions_car';
      case 'entertainment': return 'movie';
      case 'utilities': return 'electrical_services';
      case 'healthcare': return 'local_hospital';
      case 'shopping': return 'shopping_cart';
      case 'education': return 'school';
      case 'travel': return 'flight';
      case 'insurance': return 'security';
      default: return 'category';
    }
  }
}