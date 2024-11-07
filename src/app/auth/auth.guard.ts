import {CanActivateFn} from '@angular/router';
import {AuthState} from "./auth.state";
import {Store} from '@ngxs/store'
import {inject} from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
const store = inject(Store);
const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);
if (isAuthenticated) {
  return true
}
return false
};
