import {UserRole} from "./auth.state";

export class Login {
  static readonly type = '[Auth] LoginUser';
  constructor(public role: UserRole) {}
}

export class Logout {
  static readonly type = '[Auth] LogoutUser';
}
