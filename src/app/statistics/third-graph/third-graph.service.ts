import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChartConfiguration } from 'chart.js';
import { UsersState } from '../../users/users.state';
import { UserTableData } from '../../users/users-data';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThirdGraphService {
  constructor(private store: Store) {}
  private usersSubscription?: Subscription;

  getChartConfig(): ChartConfiguration {
    let config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Дата последнего захода',
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
    };

    this.usersSubscription = this.store
      .select(UsersState.getUsers)
      .subscribe((users: UserTableData[]) => {
        const activeUsers = users.filter((user) => user.totalSpent > 0);
        const labels = activeUsers.map(
          (user) => `${user.name} (${user.lastVisit})`,
        );

        config.data.labels = labels;
        config.data.datasets[0].data = activeUsers.map(() => 1);
      });

    return config;
  }

  public unsubscribe() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}
