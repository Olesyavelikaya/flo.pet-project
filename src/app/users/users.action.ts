import { UserTableData } from './users-data';

export class FetchUsers {
  static readonly type = '[Users] Fetch Users';
}

export class AddUser {
  static readonly type = '[Users] Add User';
  constructor(public payload: UserTableData) {}
}
