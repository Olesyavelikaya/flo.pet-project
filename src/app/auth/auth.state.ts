import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Login, Logout } from './auth.action';

export interface AuthStateModal {
  isAuthenticated: boolean;
  role: string;
}

@State<AuthStateModal>({
  name: 'auth',
  defaults: {
    isAuthenticated: false,
    role: '',
  },
})
@Injectable()
export class AuthState {
  @Action(Login)
  login(ctx: StateContext<AuthStateModal>, action: Login) {
    ctx.patchState({ isAuthenticated: true, role: action.role });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModal>) {
    ctx.patchState({ isAuthenticated: false, role: '' });
  }

  @Selector()
  static isAuthenticated(state: AuthStateModal) {
    return state?.isAuthenticated ?? false;
  }

  @Selector()
  static getRole(state: AuthStateModal) {
    return state?.role ?? '';
  }
}
