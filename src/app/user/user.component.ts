import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UserService} from "./user.service";
import {combineLatest, Observable, switchMap, take, tap} from "rxjs";
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {UserDetail, Cart} from "./user-detail";
import {MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule,} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import { Store } from '@ngxs/store';
import {CartState, AddCart, UpdateCartQuantity} from "./cart.state";



@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, CurrencyPipe, NgIf, DatePipe, MatButton],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ['productName', 'article', 'cost', 'quantity', 'totalAmount'];
  dataSource!: MatTableDataSource<Cart>;
  user$!: Observable<UserDetail>;
  user: UserDetail | null = null;
  carts$!: Observable<Cart[]>;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private store: Store) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Cart>();

    this.user$ = this.route.paramMap.pipe(
      switchMap(params => {
        const userId = Number(params.get('id'));
        return this.userService.getUserById(userId);
      })
    );

    this.user$.pipe(
      switchMap(user => {
        this.user = user;
        // Проверяем, есть ли уже данные в состоянии для этого пользователя
        this.store.select(state => CartState.getCarts(state.carts)(user.id)).pipe(
          take(1)
        ).subscribe(existingCarts => {
          if (existingCarts.length === 0) {
            // Если данных нет, добавляем их
            user.carts.forEach(cart => {
              this.store.dispatch(new AddCart({ ...cart, userId: user.id }));
            });
          }
        });
        this.carts$ = this.store.select(state => CartState.getCarts(state.carts)(user.id));
        return this.carts$;
      })
    ).subscribe(carts => {
      console.log('Carts data received:', carts);
      if (this.dataSource) {
        console.log('Updating dataSource with carts:', carts);
        this.dataSource.data = carts;
      } else {
        console.error('dataSource is not initialized');
      }
    });
  }




  increaseQuantity(product: Cart) {
    const newQuantity = product.quantity + 1;
    this.store.dispatch(new UpdateCartQuantity({ id: product.id, quantity: newQuantity, userId: this.user?.id || 0 }));
  }

  decreaseQuantity(product: Cart) {
    if (product.quantity > 0) {
      const newQuantity = product.quantity - 1;
      this.store.dispatch(new UpdateCartQuantity({ id: product.id, quantity: newQuantity, userId: this.user?.id || 0 }));
    }
  }

  goToUsers() {
    this.router.navigate(['main/users']);
  }
}
