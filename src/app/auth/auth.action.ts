export class Login {
  static readonly type = '[Auth] LoginUser';
  constructor(public role: string) {}
}

export class Logout {
  static readonly type = '[Auth] LogoutUser';
}
