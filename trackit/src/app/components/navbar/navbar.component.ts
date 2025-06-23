import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [MatToolbar, MatIcon, MatMenuTrigger, MatMenu, MatDivider]
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() toggleSidenav = new EventEmitter<void>();
  
  currentUser: User | null = null;
  isMobile = false;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    // Subscribe to current user changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    // Check if mobile device
    this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToSettings(): void {
    // Navigate to settings page (to be implemented)
    this.snackBar.open('Settings page coming soon!', 'Close', {
      duration: 2000
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    if (this.isLoading) return;

    const confirmLogout = confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    this.isLoading = true;
    
    try {
      this.authService.logout();
      this.snackBar.open('Logged out successfully', 'Close', {
        duration: 3000
      });
      this.router.navigate(['/']);
    } catch (error) {
      this.snackBar.open('Error during logout', 'Close', {
        duration: 3000
      });
    } finally {
      this.isLoading = false;
    }
  }

  getUserInitials(): string {
    if (this.currentUser) {
      const firstInitial = this.currentUser.firstName?.charAt(0)?.toUpperCase() || '';
      const lastInitial = this.currentUser.lastName?.charAt(0)?.toUpperCase() || '';
      return `${firstInitial}${lastInitial}` || 'U';
    }
    return 'U';
  }

  getUserFullName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim();
    }
    return 'User';
  }

  getUserEmail(): string {
    return this.currentUser?.email || 'user@example.com';
  }

  getWelcomeMessage(): string {
    if (this.currentUser?.firstName) {
      const hour = new Date().getHours();
      let greeting = 'Hello';
      
      if (hour < 12) {
        greeting = 'Good morning';
      } else if (hour < 17) {
        greeting = 'Good afternoon';
      } else {
        greeting = 'Good evening';
      }
      
      return `${greeting}, ${this.currentUser.firstName}!`;
    }
    return 'Welcome!';
  }

  // Method to handle profile menu item clicks
  onProfileMenuClick(action: string): void {
    switch (action) {
      case 'profile':
        this.navigateToProfile();
        break;
      case 'settings':
        this.navigateToSettings();
        break;
      case 'logout':
        this.logout();
        break;
      default:
        console.warn('Unknown profile menu action:', action);
    }
  }

  // Method to check if user has profile picture
  hasProfilePicture(): boolean {
    return !!(this.currentUser?.profilePicture);
  }

  // Method to get profile picture URL
  getProfilePictureUrl(): string {
    return this.currentUser?.profilePicture || '';
  }

  // Method to handle keyboard navigation
  onKeyDown(event: KeyboardEvent, action: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onProfileMenuClick(action);
    }
  }

  // Method to get user role display text (for future use)
  getUserRole(): string {
    if (this.currentUser?.roles && this.currentUser.roles.length > 0) {
      return this.currentUser.roles[0].charAt(0).toUpperCase() + 
             this.currentUser.roles[0].slice(1).toLowerCase();
    }
    return 'User';
  }

  // Method to check if user is admin (for future use)
  isAdmin(): boolean {
    return this.currentUser?.roles?.includes('ADMIN') || false;
  }

  // Method to format last login date (for future use)
  getLastLoginText(): string {
    if (this.currentUser?.lastLoginAt) {
      const lastLogin = new Date(this.currentUser.lastLoginAt);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Active now';
      } else if (diffInHours < 24) {
        return `Active ${diffInHours}h ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `Active ${diffInDays}d ago`;
      }
    }
    return 'Recently active';
  }

  // Method to handle notification icon click (for future use)
  onNotificationClick(): void {
    this.snackBar.open('Notifications feature coming soon!', 'Close', {
      duration: 2000
    });
  }

  // Method to get notification count (for future use)
  getNotificationCount(): number {
    // This would typically come from a notifications service
    return 0;
  }

  // Method to check if there are unread notifications (for future use)
  hasUnreadNotifications(): boolean {
    return this.getNotificationCount() > 0;
  }
}