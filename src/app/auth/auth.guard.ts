import { CanActivateFn } from '@angular/router';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  console.log(auth.isAuthenticated)
  return auth.isAuthenticated;
};
