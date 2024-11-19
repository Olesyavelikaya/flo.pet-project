import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';
import { UserTableData } from './users-data';
import { UsersState } from './users.state';
import { UserDetail } from '../user/user-detail';
import { DialogResult } from '../add-user-modal/add-user';
import { AuthState } from '../auth/auth.state';
import { FetchUsers, AddUser } from './users.action';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyPipe,
    NgIf,
    DatePipe,
    MatButton,
  ],
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['photo', 'name', 'lastVisit', 'totalSpent'];
  dataSource!: MatTableDataSource<UserTableData>;
  users$: Observable<UserTableData[]> = this.store.select(UsersState.getUsers);
  isAdmin: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.store.dispatch(new FetchUsers());
    this.users$.subscribe((users) => {
      this.dataSource = new MatTableDataSource<UserTableData>(users);
      this.dataSource.sort = this.sort;
    });
    this.isAdmin = this.store.selectSnapshot(AuthState.getRole) === 'admin';
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  public goToUserDetails(user: UserDetail) {
    if (user && user.id) {
      this.router.navigate(['/main/users', user.id]);
    } else {
      console.error('User ID is undefined');
    }
  }

  public openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: '600px',
      height: '500px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: DialogResult) => {
      if (result) {
        const newUser: UserTableData = {
          id: result.id,
          name: `${result.userData.firstName} ${result.userData.lastName}`,
          lastVisit: new Date().toISOString(),
          totalSpent: 0,
          photo: result.photoBase64.toString(),
        };
        this.store.dispatch(new AddUser(newUser));
      }
    });
  }
}
