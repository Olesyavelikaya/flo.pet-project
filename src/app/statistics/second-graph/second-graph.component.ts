import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Store } from '@ngxs/store';
import { UsersState } from '../../users/users.state';
import { UserTableData } from '../../users/users-data';

@Component({
  selector: 'app-second-graph',
  standalone: true,
  imports: [],
  templateUrl: './second-graph.component.html',
  styleUrl: './second-graph.component.css',
})
export class SecondGraphComponent {
  chart: Chart | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(UsersState.getUsers)
      .subscribe((users: UserTableData[]) => {
        const userNames = users.map((user) => user.name);
        const totalSpent = users.map((user) => user.totalSpent);

        this.chart = new Chart('secondChart', {
          type: 'bar',
          data: {
            labels: userNames,
            datasets: [
              {
                label: 'Сумма покупок',
                data: totalSpent,
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
        });
      });
  }
}
