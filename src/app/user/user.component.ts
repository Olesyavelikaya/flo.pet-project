import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UserService} from "./user.service";
import {Observable, switchMap} from "rxjs";
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
export class UserComponent {
  displayedColumns: string[] = ['productName', 'article', 'cost', 'quantity', 'totalAmount'];
  dataSource!: MatTableDataSource<Cart>;
  user$!: Observable<UserDetail>;
  user: UserDetail | null = null;
  carts$: Observable<Cart[]> = this.store.select(CartState.getCarts)


  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private store: Store) {
  }

  ngOnInit() {
    this.user$ = this.route.paramMap.pipe(
      switchMap(params => {
        const userId = Number(params.get('id'));
        return this.userService.getUserById(userId);
      })
    );
    this.user$.subscribe(user => {
      this.user = user;
      this.dataSource = new MatTableDataSource(user.carts);
      user.carts.forEach(cart => this.store.dispatch(new AddCart(cart)));
    });
  }

  increaseQuantity(product: Cart) {
    const newQuantity = product.quantity + 1;
    this.store.dispatch(new UpdateCartQuantity({ id: product?.id, quantity: newQuantity }));
    this.updateDataSource();
  }

  decreaseQuantity(product: Cart) {
    if (product.quantity > 0) {
      const newQuantity = product.quantity - 1;
      this.store.dispatch(new UpdateCartQuantity({ id: product.id, quantity: newQuantity }));
      this.updateDataSource();
    }
  }

  updateDataSource() {
    this.carts$.subscribe(carts => {
      this.dataSource.data = carts;
    });
  }

  goToUsers() {
    this.router.navigate(['main/users']);
  }
}
