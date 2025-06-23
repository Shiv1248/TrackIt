import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ExpenseListComponent } from '../expense-list/expense-list.component';
import { ExpenseService } from '../../services/expense.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, MatSidenavContainer, MatSidenav, NavbarComponent, SidebarComponent, MatSidenavContent, ExpenseListComponent, MatCardModule, MatIcon, MatSpinner]
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  sidenavOpened = true;
  isMobile = false;
  isLoading = false;
  expenses: any[] = [];
  stats: any = null;

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private expenseService: ExpenseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        this.sidenavOpened = !this.isMobile;
      });
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Test backend connection by loading expenses
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.isLoading = false;
        this.snackBar.open('Backend connection successful!', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(`Backend connection failed: ${error.message}`, 'Close', {
          duration: 5000
        });
        console.error('Backend connection error:', error);
      }
    });

    // Load expense statistics
    this.expenseService.getExpenseStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Failed to load stats:', error);
      }
    });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  closeSidenavOnMobile() {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }
}