import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { ExpenseService } from '../../services/expense.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Expense } from '../../models/expense.model';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { CustomValidators } from '../../utils/validators';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.css'],
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
    MatDialogContent,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatError,
    MatOption,
    MatDatepickerModule,
    MatCardModule,
    MatSpinner
  ]
})
export class CreateExpenseComponent implements OnInit {
  expenseForm: FormGroup;
  categories = EXPENSE_CATEGORIES;
  statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'upcoming', label: 'Upcoming' }
  ];
  isLoading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateExpenseComponent>,
    private expenseService: ExpenseService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Expense // Fixed undeclared variable
  ) {
    this.isEditMode = !!data;
    this.expenseForm = this.fb.group({
      title: [data?.title || '', [Validators.required, Validators.minLength(3)]],
      amount: [data?.amount || '', [Validators.required, CustomValidators.positiveNumber()]],
      category: [data?.category || '', Validators.required],
      date: [data?.date ? new Date(data.date) : new Date(), Validators.required],
      status: [data?.status || 'pending', Validators.required],
      description: [data?.description || '']
    });
  }

  ngOnInit(): void {
    // Additional initialization if needed
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.isLoading = true;
      const expenseData = this.expenseForm.value;

      const operation = this.isEditMode 
        ? this.expenseService.updateExpense(this.data.id!, expenseData)
        : this.expenseService.createExpense(expenseData);

      operation.subscribe({
        next: (response) => {
          this.isLoading = false;
          const message = this.isEditMode 
            ? 'Expense updated successfully!' 
            : 'Expense created successfully!';
          
          this.snackBar.open(message, 'Close', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          const message = this.isEditMode 
            ? 'Failed to update expense. Please try again.' 
            : 'Failed to create expense. Please try again.';
          
          this.snackBar.open(message, 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'food & dining': return 'restaurant';
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

  getStatusIcon(status: string): string {
    switch (status) {
      case 'paid': return 'check_circle';
      case 'pending': return 'schedule';
      case 'upcoming': return 'event';
      default: return 'help';
    }
  }
}
