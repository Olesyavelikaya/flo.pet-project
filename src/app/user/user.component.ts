import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, take } from 'rxjs';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { UserService } from './user.service';
import { Store } from '@ngxs/store';
import { CartState } from './cart.state';
import { UpdateCartQuantity, FetchAllCarts } from './cart.state';
import { UserDetail, CartItem } from './user-detail';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';


@Component({
  selector: 'app-user',
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
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = [
    'productName',
    'article',
    'cost',
    'quantity',
    'totalAmount',
  ];
  dataSource!: MatTableDataSource<CartItem>;
  user$!: Observable<UserDetail>;
  user: UserDetail | null = null;
  carts$!: Observable<CartItem[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<CartItem>();
    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const userId = Number(params.get('id'));
        return this.userService.getUserById(userId);
      }),
    );

    this.user$
      .pipe(
        switchMap((user) => {
          this.user = user;
          this.store
            .select((state) => CartState.getCarts(state.carts)(user.id))
            .pipe(take(1))
            .subscribe((existingCarts) => {
              if (existingCarts.length === 0) {
                this.store.dispatch(
                  new FetchAllCarts({ userId: user.id, carts: user.carts }),
                );
              }
            });
          this.carts$ = this.store.select((state) =>
            CartState.getCarts(state.carts)(user.id),
          );
          return this.carts$;
        }),
      )
      .subscribe((carts) => {
        if (this.dataSource) {
          this.dataSource.data = carts;
        } else {
          console.error('dataSource is not initialized');
        }
      });
  }

  public increaseQuantity(product: CartItem) {
    const newQuantity = product.quantity + 1;
    this.store.dispatch(
      new UpdateCartQuantity({
        id: product.id,
        quantity: newQuantity,
        userId: this.user?.id || 0,
      }),
    );
  }

  public decreaseQuantity(product: CartItem) {
    if (product.quantity > 0) {
      const newQuantity = product.quantity - 1;
      this.store.dispatch(
        new UpdateCartQuantity({
          id: product.id,
          quantity: newQuantity,
          userId: this.user?.id || 0,
        }),
      );
    }
  }

  public goToUsers() {
    this.router.navigate(['main/users']);
  }
}
