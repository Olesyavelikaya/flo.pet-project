import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { UsersState } from '../../users/users.state';
import { UserTableData } from '../../users/users-data';

Chart.register(...registerables);

@Component({
  selector: 'app-third-graph',
  standalone: true,
  imports: [],
  templateUrl: './third-graph.component.html',
  styleUrl: './third-graph.component.css',
})
export class ThirdGraphComponent {
  chart: Chart | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(UsersState.getUsers)
      .subscribe((users: UserTableData[]) => {
        const activeUsers = users.filter((user) => user.totalSpent > 0);
        const labels = activeUsers.map(
          (user) => `${user.name} (${user.lastVisit})`,
        );

        const config: ChartConfiguration = {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Дата последнего захода',
                data: activeUsers.map(() => 1),
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

        this.chart = new Chart('thirdChart', config);
      });
  }
}
