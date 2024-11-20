import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChartConfiguration } from 'chart.js';
import { CartState } from '../../user/cart.state';
import { UsersState } from '../../users/users.state';
import { UserTableData } from '../../users/users-data';
import { CartItem } from '../../user/user-detail';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirstGraphService {
  constructor(private store: Store) {}
  private cartSubscription?: Subscription;
  private usersSubscription?: Subscription;

  getChartConfig(): ChartConfiguration {
    let config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Количество купленных товаров',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    this.cartSubscription = this.store
      .select(CartState.getCarts)
      .subscribe((getCarts) => {
        this.usersSubscription = this.store
          .select(UsersState.getUsers)
          .subscribe((users: UserTableData[]) => {
            const allCarts: CartItem[] = [];
            users.forEach((user) => {
              const carts = getCarts(user.id);
              allCarts.push(...carts);
            });

            const productQuantities: { [key: string]: number } = {};

            allCarts.forEach((cart) => {
              if (productQuantities[cart.title]) {
                productQuantities[cart.title] += cart.quantity;
              } else {
                productQuantities[cart.title] = cart.quantity;
              }
            });

            const productTitles = Object.keys(productQuantities);
            const quantities = Object.values(productQuantities);

            config.data.labels = productTitles;
            config.data.datasets[0].data = quantities;
          });
      });

    return config;
  }

  public unsubscribe() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}
