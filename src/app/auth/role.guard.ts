import { CanActivateFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { inject } from '@angular/core';
import { AuthState } from './auth.state';

export const roleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const userRole = store.selectSnapshot(AuthState.getRole);
  return userRole === 'admin'
}
