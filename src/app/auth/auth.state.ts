import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Login, Logout } from './auth.action';

export enum UserRole {
  Admin = 'admin',
  Viewer = 'viewer',
}

export interface AuthStateModal {
  isAuthenticated: boolean;
  role: UserRole;
}

@State<AuthStateModal>({
  name: 'auth',
  defaults: {
    isAuthenticated: false,
    role: UserRole.Viewer,
  },
})
@Injectable()
export class AuthState {
  @Action(Login)
  login(ctx: StateContext<AuthStateModal>, action: Login) {
    ctx.patchState({ isAuthenticated: true, role: action.role as UserRole });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModal>) {
    ctx.patchState({ isAuthenticated: false, role: UserRole.Viewer });
  }

  @Selector()
  static isAuthenticated(state: AuthStateModal) {
    return state?.isAuthenticated ?? false;
  }

  @Selector()
  static getRole(state: AuthStateModal) {
    return state?.role ?? UserRole.Viewer;
  }
}
