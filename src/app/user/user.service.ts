import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import {
  CartData,
  ProductsData,
  UsersPhotosResponse,
  User,
  UsersData,
} from '../users/users-data';
import { UserDetail } from './user-detail';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'https://fakestoreapi.com/users';
  private photoUrl = 'http://localhost:3000/photos';
  private cartsUrl = 'https://fakestoreapi.com/carts';
  private productsUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  private getAllUsers(): Observable<UsersData> {
    return this.http.get<UsersData>(this.userUrl);
  }

  private getUserCarts(): Observable<CartData> {
    return this.http.get<CartData>(this.cartsUrl);
  }

  private getProducts(): Observable<ProductsData> {
    return this.http.get<ProductsData>(this.productsUrl);
  }

  private getUserPhotos(): Observable<UsersPhotosResponse> {
    return this.http.get<UsersPhotosResponse>(this.photoUrl);
  }

  private mergeUserData(
    user: User,
    carts: CartData,
    products: ProductsData,
    photos: UsersPhotosResponse,
  ): UserDetail {
    const userPhoto = photos.find((p) => p.id === user.id);
    const userCarts = carts.filter((cart) => cart.userId === user.id);
    const mergedProducts: {
      [key: number]: {
        id: number;
        title: string;
        price: number;
        quantity: number;
        total: number;
      };
    } = {};

    userCarts.flatMap((cart) => {
      return cart.products.map((product) => {
        const productInfo = products.find((p) => p.id === product.productId);
        if (productInfo) {
          const productKey = productInfo.id;
          if (mergedProducts[productKey]) {
            mergedProducts[productKey].quantity += product.quantity;
            mergedProducts[productKey].total +=
              product.quantity * productInfo.price;
          } else {
            mergedProducts[productKey] = {
              id: productInfo.id || 0,
              title: productInfo.title,
              price: productInfo.price || 0,
              quantity: product.quantity,
              total: product.quantity * productInfo.price,
            };
          }
        }
      });
    });

    const userProduct = Object.values(mergedProducts);
    return {
      id: user.id,
      name: `${user.name.firstname} ${user.name.lastname}`,
      email: user.email,
      phone: user.phone,
      photo: userPhoto?.url || '',
      carts: userProduct,
    };
  }

  public loadAllData(): Observable<UserDetail[]> {
    return forkJoin({
      users: this.getAllUsers(),
      carts: this.getUserCarts(),
      products: this.getProducts(),
      photos: this.getUserPhotos(),
    }).pipe(
      map(({ users, carts, products, photos }) => {
        return users.map((user) =>
          this.mergeUserData(user, carts, products, photos),
        );
      }),
    );
  }

  public getUserById(userId: number): Observable<UserDetail> {
    return this.loadAllData().pipe(
      map((users) => {
        const user = users.find((u) => u.id === userId);
        if (!user) {
          throw new Error(`User with id ${userId} not found`);
        }
        return user;
      }),
    );
  }
}
