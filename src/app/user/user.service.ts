import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, map, Observable, switchMap} from 'rxjs';
import {CartData, ProductsData, UsersPhotosResponse, User} from "../users/users-data";
import {UserDetail} from "./user-detail";

@Injectable({
  providedIn: 'root'
})
export class UserService {
private userUrl = 'https://fakestoreapi.com/users';
private photoUrl = 'http://localhost:3000/photos';
private cartsUrl = 'https://fakestoreapi.com/carts';
private productsUrl = 'https://fakestoreapi.com/products';


  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<UserDetail> {
    return forkJoin({
      user: this.http.get<User>(`${this.userUrl}/${userId}`),
      carts: this.http.get<CartData>(`${this.cartsUrl}/user/${userId}`),
      products: this.http.get<ProductsData>(this.productsUrl),
      photo: this.http.get<UsersPhotosResponse>(this.photoUrl)
    }).pipe(
      map(({ user, carts, products, photo }) => {
        const userPhoto = photo.find(p => p.id === user.id);
        const userCarts = carts.filter(cart => cart.userId === user.id);
        const mergedProducts: { [key: number]: { id: number, title: string, price: number, quantity: number, total: number } } = {};
        userCarts.flatMap((cart) => {
          return cart.products.map((product) => {
            const productInfo = products.find(p => p.id === product.productId);
            if (productInfo) {
              const productKey = productInfo.id;
              if (mergedProducts[productKey]) {
                mergedProducts[productKey].quantity += product.quantity;
                mergedProducts[productKey].total += product.quantity * productInfo.price;
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
          carts: userProduct
        };
      })
    );
  }

  getAllUsers(): Observable<UserDetail[]> {
    return this.http.get<User[]>(this.userUrl).pipe(
      switchMap(users => {
        const userDetailsObservables = users.map(user => this.getUserById(user.id));
        return forkJoin(userDetailsObservables);
      })
    );
  }
}
