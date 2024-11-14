import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {AddUserModalComponent} from "../add-user-modal/add-user-modal.component";
import {MatButton} from "@angular/material/button";
import {UserTableData } from "./users-data";
import {Observable} from "rxjs";
import { UsersState} from "./users.state";
import {FetchUsers, AddUser} from "./users.action";
import {Store} from "@ngxs/store";
import { MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {UserDetail} from "../user/user-detail";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, CurrencyPipe, NgIf, DatePipe, MatButton],
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['photo', 'name', 'lastVisit', 'totalSpent'];
  dataSource!: MatTableDataSource<UserTableData>;
  users$: Observable<UserTableData[]> = this.store.select(UsersState.getUsers)

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, public dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(new FetchUsers());
    this.users$.subscribe(users => {
      this.dataSource = new MatTableDataSource<UserTableData>(users);
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  goToUserDetails(user: UserDetail) {
    if (user && user.id) {
      this.router.navigate(['/main/users', user.id]);
    } else {
      console.error('User ID is undefined');
    }
  }
  openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: '600px',
      height: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newUser: UserTableData = {
          name: `${result.userData.firstName} ${result.userData.lastName}`,
          lastVisit: new Date().toISOString(),
          totalSpent: 0,
          photo: result.photoBase64.toString()
        };
        this.store.dispatch(new AddUser(newUser));
      }
    });
  }
}
