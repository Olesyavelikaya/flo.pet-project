import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth/auth.guard';
import { MainComponent } from './main/main.component';
import { UsersComponent } from './users/users.component';
import { StatisticsComponent } from './statistics/statistics.component';
import {UserComponent} from "./user/user.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: 'users', component: UsersComponent, data: { showHeader: true } },
      { path: 'users/:id', component: UserComponent, data: { showHeader: false }},
      { path: 'statistics', component: StatisticsComponent, data: { showHeader: true } },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
