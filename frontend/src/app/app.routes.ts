import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'cats',
        loadComponent: () => import('./features/cats/cat-list/cat-list.component').then(m => m.CatListComponent)
      },
      {
        path: 'cats/new',
        loadComponent: () => import('./features/cats/cat-form/cat-form.component').then(m => m.CatFormComponent)
      },
      {
        path: 'cats/edit/:id',
        loadComponent: () => import('./features/cats/cat-form/cat-form.component').then(m => m.CatFormComponent)
      },
      {
        path: 'appointments',
        loadComponent: () => import('./features/appointments/appointment-list/appointment-list.component').then(m => m.AppointmentListComponent)
      },
      {
        path: 'appointments/new',
        loadComponent: () => import('./features/appointments/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
      },
      {
        path: 'appointments/edit/:id',
        loadComponent: () => import('./features/appointments/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
      },
      {
        path: 'expenses',
        loadComponent: () => import('./features/expenses/expense-list/expense-list.component').then(m => m.ExpenseListComponent)
      },
      {
        path: 'expenses/new',
        loadComponent: () => import('./features/expenses/expense-form/expense-form.component').then(m => m.ExpenseFormComponent)
      },
      {
        path: 'expenses/edit/:id',
        loadComponent: () => import('./features/expenses/expense-form/expense-form.component').then(m => m.ExpenseFormComponent)
      },
      {
        path: 'health',
        loadComponent: () => import('./features/health-records/health-list/health-list.component').then(m => m.HealthListComponent)
      },
      {
        path: 'health/new',
        loadComponent: () => import('./features/health-records/health-form/health-form.component').then(m => m.HealthFormComponent)
      },
      {
        path: 'health/edit/:id',
        loadComponent: () => import('./features/health-records/health-form/health-form.component').then(m => m.HealthFormComponent)
      },
      {
        path: 'ai-vet',
        loadComponent: () => import('./features/ai-vet/ai-vet.component').then(m => m.AiVetComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];