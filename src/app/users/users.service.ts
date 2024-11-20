import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import {
  UsersData,
  ProductsData,
  CartData,
  UsersPhotosResponse,
  UsersTableData,
  UserTableData,
  User,
  UserPhoto,
} from './users-data';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersUrl = 'https://fakestoreapi.com/users';
  private cartsUrl = 'https://fakestoreapi.com/carts';
  private productsUrl = 'https://fakestoreapi.com/products';
  private photoUrl = 'http://localhost:3000/photos';

  constructor(private http: HttpClient) {}

  public getUsersData(): Observable<UsersTableData> {
    return forkJoin({
      users: this.http.get<UsersData>(this.usersUrl),
      carts: this.http.get<CartData>(this.cartsUrl),
      products: this.http.get<ProductsData>(this.productsUrl),
      photos: this.http.get<UsersPhotosResponse>(this.photoUrl),
    }).pipe(
      map(({ users, carts, products, photos }) => {
        return users.map((user) =>
          this.mapUserData(user, carts, products, photos),
        );
      }),
    );
  }

  private mapUserData(
    user: User,
    carts: CartData,
    products: ProductsData,
    photos: UsersPhotosResponse,
  ): UserTableData {
    const userCarts = this.getUserCarts(user.id, carts);
    const totalSpent = this.calculateTotalSpent(userCarts, products);
    const lastVisit = this.getLastVisit(userCarts);
    const photo = this.getUserPhoto(user.id, photos);
    return {
      id: user.id,
      name: `${user.name.firstname} ${user.name.lastname}`,
      lastVisit: lastVisit,
      totalSpent: totalSpent,
      photo: photo?.url,
    };
  }

  private getUserCarts(userId: number, carts: CartData): CartData {
    return carts.filter((cart) => cart.userId === userId);
  }

  private calculateTotalSpent(
    userCarts: CartData,
    products: ProductsData,
  ): number {
    return userCarts.reduce((total, cart) => {
      return (
        total +
        cart.products.reduce((sum, product) => {
          const productInfo = products.find((p) => p.id === product.productId);
          if (productInfo) {
            return sum + productInfo.price * product.quantity;
          }
          return sum;
        }, 0)
      );
    }, 0);
  }

  private getLastVisit(userCarts: CartData): string {
    if (userCarts.length === 0) {
      return '1970-01-01T00:00:00.000Z';
    }
    return userCarts.reduce((latest, cart) => {
      const cartDate = new Date(cart.date);
      const latestDate = new Date(latest);
      return cartDate > latestDate ? cart.date : latest;
    }, '1970-01-01T00:00:00.000Z');
  }

  private getUserPhoto(
    userId: number,
    photos: UsersPhotosResponse,
  ): UserPhoto | undefined {
    return photos.find((photo) => photo.id === userId);
  }
}
