import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChartConfiguration } from 'chart.js';
import { UsersState } from '../../users/users.state';
import { UserTableData } from '../../users/users-data';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SecondGraphService {
  constructor(private store: Store) {}
  private usersSubscription?: Subscription;

  getChartConfig(): ChartConfiguration {
    let config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Сумма покупок',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
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

    this.usersSubscription = this.store
      .select(UsersState.getUsers)
      .subscribe((users: UserTableData[]) => {
        const userNames = users.map((user) => user.name);
        const totalSpent = users.map((user) => user.totalSpent);

        config.data.labels = userNames;
        config.data.datasets[0].data = totalSpent;
      });

    return config;
  }

  public unsubscribe() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}
