import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {authGuard} from "./auth/auth.guard";
import {MainComponent} from "./main/main.component";
import {UserComponent} from "./user/user.component";
import {StatisticsComponent} from "./statistics/statistics.component";


export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainComponent, canActivate: [authGuard], children:[
      {path: 'users', component: UserComponent},
      {path: 'statistics', component: StatisticsComponent},
    ]},
  {path: '', redirectTo:'/login', pathMatch: "full"}
];
