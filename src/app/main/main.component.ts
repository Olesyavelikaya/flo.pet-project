import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs';
import { Store } from '@ngxs/store';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  ActivatedRoute,
  Router,
  NavigationEnd,
} from '@angular/router';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../user/user.service';
import { FetchAllCarts } from '../user/cart.state';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    RouterLink,
    RouterOutlet,
    HeaderComponent,
    RouterLinkActive,
    NgIf,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  showHeader: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.updateHeaderVisibility();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHeaderVisibility();
      });
    this.loadAllCarts();
  }

  private updateHeaderVisibility(): void {
    let child = this.route.firstChild;
    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
      } else if (
        child.snapshot.data &&
        child.snapshot.data['showHeader'] !== undefined
      ) {
        this.showHeader = child.snapshot.data['showHeader'];
        return;
      } else {
        child = null;
      }
    }
  }

  private loadAllCarts() {
    this.userService.getAllUsers().subscribe((users) => {
      users.forEach((user) => {
        this.store.dispatch(
          new FetchAllCarts({ userId: user.id, carts: user.carts }),
        );
      });
    });
  }
}
