import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { UserTableData } from './users-data';
import { FetchUsers, AddUser } from './users.action';
import { tap } from 'rxjs';

@State<UserTableData[]>({
  name: 'users',
  defaults: [],
})
@Injectable()
export class UsersState {
  constructor(private usersService: UsersService) {}

  @Selector()
  static getUsers(state: UserTableData[]) {
    return state;
  }

  @Action(FetchUsers)
  fetchUsers(ctx: StateContext<UserTableData[]>) {
    return this.usersService.getUsersData().pipe(
      tap((users) => {
        ctx.setState(users);
      }),
    );
  }

  @Action(AddUser)
  addUser(ctx: StateContext<UserTableData[]>, { payload }: AddUser) {
    const state = ctx.getState();
    state.push(payload);
    ctx.setState(state);
  }
}
