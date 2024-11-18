import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth/auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    loadComponent: () => import('./main/main.component').then(m => m.MainComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
        data: { showHeader: true }
      },
      {
        path: 'users/:id',
        loadComponent: () => import('./user/user.component').then(m => m.UserComponent),
        data: { showHeader: false }
      },
      {
        path: 'statistics',
        loadComponent: () => import('./statistics/statistics.component').then(m => m.StatisticsComponent),
        data: { showHeader: true }
      },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
