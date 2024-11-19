import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CartState } from '../../user/cart.state';
import { CartItem } from '../../user/user-detail';
import { UsersState } from '../../users/users.state';
import { UserTableData } from '../../users/users-data';

Chart.register(...registerables);

@Component({
  selector: 'app-first-graph',
  standalone: true,
  imports: [],
  templateUrl: './first-graph.component.html',
  styleUrl: './first-graph.component.css',
})
export class FirstGraphComponent {
  chart: Chart | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(CartState.getCarts).subscribe((getCarts) => {
      this.store
        .select(UsersState.getUsers)
        .subscribe((users: UserTableData[]) => {
          const allCarts: CartItem[] = [];
          users.forEach((user) => {
            const carts = getCarts(user.id);
            allCarts.push(...carts);
          });

          const productQuantities: { [key: string]: number } = {};

        allCarts.forEach(cart => {
          if (productQuantities[cart.title]) {
            productQuantities[cart.title] += cart.quantity;
          } else {
            productQuantities[cart.title] = cart.quantity;
          }
        });

        const productTitles = Object.keys(productQuantities);
        const quantities = Object.values(productQuantities);


        const config: ChartConfiguration = {
          type: 'bar',
          data: {
            labels: productTitles,
            datasets: [{
              label: 'Количество купленных товаров',
              data: quantities,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        };

          this.chart = new Chart('firstChart', config);
        });
    });
  }
}
