import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Login, Logout} from "./auth.action";

export interface  AuthStateModal{
  isAuthenticated: boolean;
}

@State<AuthStateModal>({
  name: 'auth',
  defaults: {
    isAuthenticated: false
  }
})
@Injectable()
export class AuthState{

  @Action(Login)
  login(ctx: StateContext<AuthStateModal>) {
    ctx.patchState({isAuthenticated: true})
}

@Action(Logout)
  logout(ctx: StateContext<AuthStateModal>) {
    ctx.patchState({isAuthenticated: false})
}

@Selector()
  static isAuthenticated(state: AuthStateModal) {
    return state?.isAuthenticated ?? false
}



}
