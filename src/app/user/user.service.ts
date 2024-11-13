import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import {User, UsersPhotosResponse, UserPhoto, UsersData, CartData, ProductsData} from "../users/users-data";

@Injectable({
  providedIn: 'root'
})
export class UserService {
private userUrl = 'https://fakestoreapi.com/users';
private photoUrl = 'http://localhost:3000/photos';
private cartsUrl = 'https://fakestoreapi.com/carts';
private productsUrl = 'https://fakestoreapi.com/products';


  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<any> {
    return forkJoin({
      user: this.http.get<UsersData>(`${this.userUrl}/${userId}`),
      carts: this.http.get<CartData>(`${this.cartsUrl}/user/${userId}`),
      products: this.http.get<ProductsData>(this.productsUrl),
      photo: this.http.get<UsersPhotosResponse>(this.photoUrl)
    }).pipe(
      map(({ user, carts, products, photo }) => {
        return user.map((user) => {
          const userPhoto = photo.find(p => p.id === user.id);
          const userCarts = carts.filter(cart => cart.userId === user.id);


        })
      })
    )}
}



