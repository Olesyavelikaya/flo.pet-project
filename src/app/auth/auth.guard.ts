import { CanActivateFn } from '@angular/router';
import { AuthState } from './auth.state';
import { Store } from '@ngxs/store';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(Store).selectSnapshot(AuthState.isAuthenticated);
};
