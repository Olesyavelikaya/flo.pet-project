import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, map, Observable} from 'rxjs';
import {UsersData, ProductsData, CartData} from "./users-data";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersUrl = 'https://fakestoreapi.com/users';
  private cartsUrl = 'https://fakestoreapi.com/carts';
  private productsUrl = 'https://fakestoreapi.com/products';

  constructor( private http: HttpClient) {}
  getUsersData(): Observable<any>{
    return forkJoin({
      users: this.http.get<UsersData>(this.usersUrl),
      carts: this.http.get<CartData>(this.cartsUrl),
      products: this.http.get<ProductsData>(this.productsUrl)
    }).pipe(
      map(({ users, carts, products }) => {
        return users.map(user => {
          const userCarts = carts.filter(cart => cart.userId === user.id);
          const totalSpent = userCarts.reduce((total, cart) => {
            return total + cart.products.reduce((sum, product) => {
              const productInfo = products.find(p => p.id === product.productId);
              if (productInfo){
                return sum + productInfo.price * product.quantity;
              }
              return sum;
            }, 0);
          }, 0)
          const lastVisit = userCarts.reduce((latest, cart) => {
            return new Date(cart.date) > new Date(latest) ? cart.date : latest;
          }, '');
          return {
            name: user.name.firstname + ' ' + user.name.lastname,
            lastVisit: lastVisit,
            totalSpent: totalSpent
          };
        });
      })
    );
  }
}
