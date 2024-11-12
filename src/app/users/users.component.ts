import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UsersService } from "./users.service";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { UserTableData } from "./users-data";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {AddUserModalComponent} from "../add-user-modal/add-user-modal.component";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, CurrencyPipe, NgIf, DatePipe, MatButton],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'lastVisit', 'totalSpent'];
  dataSource!: MatTableDataSource<UserTableData>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService, public dialog: MatDialog) {}

  ngOnInit() {
    this.userService.getUsersData().subscribe(data => {
      this.dataSource = new MatTableDataSource<UserTableData>(data);
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

  openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: '600px',
      height: '500px',
      data: {}
    });

  }


}
