import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {authGuard} from "./auth/auth.guard";
import {MainComponent} from "./main/main.component";


export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainComponent, canActivate: [authGuard]},
  {path: '', redirectTo:'/login', pathMatch: "full"}
];
