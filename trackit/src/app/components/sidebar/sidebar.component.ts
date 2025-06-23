import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  route: string;
  active: boolean;
  comingSoon: boolean;
  badge?: number;
  description?: string;
  requiredRole?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
    MatBadgeModule,
    MatSnackBarModule,
    FlexLayoutModule]
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  currentRoute = '';
  private destroy$ = new Subject<void>();

  menuSections: MenuSection[] = [
    {
      title: 'Main',
      items: [
        {
          id: 'dashboard',
          icon: 'dashboard',
          label: 'Dashboard',
          route: '/dashboard',
          active: false,
          comingSoon: false,
          description: 'Overview of your expenses'
        },
        {
          id: 'expenses',
          icon: 'receipt_long',
          label: 'Expenses',
          route: '/dashboard',
          active: true,
          comingSoon: false,
          description: 'Manage your expenses'
        }
      ]
    },
    {
      title: 'Analytics',
      items: [
        {
          id: 'analytics',
          icon: 'analytics',
          label: 'Analytics',
          route: '/analytics',
          active: false,
          comingSoon: true,
          description: 'Expense insights and trends'
        },
        {
          id: 'reports',
          icon: 'assessment',
          label: 'Reports',
          route: '/reports',
          active: false,
          comingSoon: true,
          description: 'Generate detailed reports'
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          id: 'categories',
          icon: 'category',
          label: 'Categories',
          route: '/categories',
          active: false,
          comingSoon: true,
          description: 'Manage expense categories'
        },
        {
          id: 'budget',
          icon: 'account_balance',
          label: 'Budget',
          route: '/budget',
          active: false,
          comingSoon: true,
          description: 'Set and track budgets'
        },
        {
          id: 'goals',
          icon: 'flag',
          label: 'Goals',
          route: '/goals',
          active: false,
          comingSoon: true,
          description: 'Financial goals tracking'
        }
      ]
    },
    {
      title: 'Tools',
      items: [
        {
          id: 'calculator',
          icon: 'calculate',
          label: 'Calculator',
          route: '/calculator',
          active: false,
          comingSoon: true,
          description: 'Financial calculator'
        },
        {
          id: 'export',
          icon: 'file_download',
          label: 'Export Data',
          route: '/export',
          active: false,
          comingSoon: true,
          description: 'Export your data'
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'profile',
          icon: 'person',
          label: 'Profile',
          route: '/profile',
          active: false,
          comingSoon: false,
          description: 'Manage your profile'
        },
        {
          id: 'settings',
          icon: 'settings',
          label: 'Settings',
          route: '/settings',
          active: false,
          comingSoon: true,
          description: 'App preferences'
        },
        {
          id: 'help',
          icon: 'help',
          label: 'Help & Support',
          route: '/help',
          active: false,
          comingSoon: true,
          description: 'Get help and support'
        }
      ]
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.updateMenuBasedOnUser();
      });

    // Subscribe to route changes to update active menu item
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.updateActiveMenuItem();
      });

    // Set initial active menu item
    this.currentRoute = this.router.url;
    this.updateActiveMenuItem();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateTo(item: MenuItem): void {
    if (item.comingSoon) {
      this.showComingSoonMessage(item.label);
      return;
    }

    if (item.requiredRole && !this.hasRequiredRole(item.requiredRole)) {
      this.showAccessDeniedMessage();
      return;
    }

    if (item.route) {
      this.setActiveItem(item);
      this.router.navigate([item.route]);
    }
  }

  private updateActiveMenuItem(): void {
    this.menuSections.forEach(section => {
      section.items.forEach(item => {
        item.active = this.isRouteActive(item.route);
      });
    });
  }

  private isRouteActive(route: string): boolean {
    if (route === '/dashboard') {
      return this.currentRoute === '/dashboard' || this.currentRoute === '/';
    }
    return this.currentRoute.startsWith(route);
  }

  private setActiveItem(selectedItem: MenuItem): void {
    this.menuSections.forEach(section => {
      section.items.forEach(item => {
        item.active = item.id === selectedItem.id;
      });
    });
  }

  private updateMenuBasedOnUser(): void {
    // Update menu items based on user role or preferences
    if (this.currentUser) {
      // Example: Show admin-only items
      if (this.isAdmin()) {
        this.addAdminMenuItems();
      }
      
      // Update badges (e.g., notification counts)
      this.updateMenuBadges();
    }
  }

  private addAdminMenuItems(): void {
    const adminSection = this.menuSections.find(section => section.title === 'Admin');
    if (!adminSection) {
      this.menuSections.push({
        title: 'Admin',
        items: [
          {
            id: 'users',
            icon: 'people',
            label: 'User Management',
            route: '/admin/users',
            active: false,
            comingSoon: true,
            description: 'Manage system users',
            requiredRole: 'ADMIN'
          },
          {
            id: 'system',
            icon: 'settings_applications',
            label: 'System Settings',
            route: '/admin/system',
            active: false,
            comingSoon: true,
            description: 'System configuration',
            requiredRole: 'ADMIN'
          }
        ]
      });
    }
  }

  private updateMenuBadges(): void {
    // Update notification badges
    const notificationItem = this.findMenuItem('notifications');
    if (notificationItem) {
      // This would typically come from a notifications service
      notificationItem.badge = 0;
    }
  }

  private findMenuItem(id: string): MenuItem | undefined {
    for (const section of this.menuSections) {
      const item = section.items.find(item => item.id === id);
      if (item) return item;
    }
    return undefined;
  }

  protected hasRequiredRole(role: string): boolean {
    return this.currentUser?.roles?.includes(role) || false;
  }

  private isAdmin(): boolean {
    return this.hasRequiredRole('ADMIN');
  }

  protected showComingSoonMessage(feature: string): void {
    this.snackBar.open(`${feature} feature is coming soon!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private showAccessDeniedMessage(): void {
    this.snackBar.open('Access denied. Insufficient permissions.', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  // Utility methods for template
  getUserInitials(): string {
    if (this.currentUser) {
      const firstInitial = this.currentUser.firstName?.charAt(0)?.toUpperCase() || '';
      const lastInitial = this.currentUser.lastName?.charAt(0)?.toUpperCase() || '';
      return `${firstInitial}${lastInitial}` || 'U';
    }
    return 'U';
  }

  getUserName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim();
    }
    return 'User';
  }

  getAppVersion(): string {
    return '1.0.0';
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Method to handle keyboard navigation
  onKeyDown(event: KeyboardEvent, item: MenuItem): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateTo(item);
    }
  }

  // Method to track menu items for *ngFor performance
  trackByMenuItem(index: number, item: MenuItem): string {
    return item.id;
  }

  trackByMenuSection(index: number, section: MenuSection): string {
    return section.title;
  }

  // Method to get menu item tooltip
  getMenuItemTooltip(item: MenuItem): string {
    if (item.comingSoon) {
      return `${item.description} (Coming Soon)`;
    }
    return item.description || item.label;
  }

  // Method to check if section has any available items
  hasAvailableItems(section: MenuSection): boolean {
    return section.items.some(item => 
      !item.comingSoon || 
      (item.requiredRole && this.hasRequiredRole(item.requiredRole))
    );
  }

  // Method to get section item count
  getSectionItemCount(section: MenuSection): number {
    return section.items.filter(item => 
      !item.comingSoon && 
      (!item.requiredRole || this.hasRequiredRole(item.requiredRole))
    ).length;
  }

  // Method to handle section collapse/expand (for future use)
  toggleSection(section: MenuSection): void {
    // Implementation for collapsible sections
    console.log('Toggle section:', section.title);
  }
}