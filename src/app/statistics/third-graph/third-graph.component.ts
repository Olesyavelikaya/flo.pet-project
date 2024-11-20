import {Component, Input, OnInit} from '@angular/core';

import { Chart, ChartConfiguration, registerables } from 'chart.js';


Chart.register(...registerables);

@Component({
  selector: 'app-third-graph',
  standalone: true,
  imports: [],
  templateUrl: './third-graph.component.html',
  styleUrl: './third-graph.component.css',
})
export class ThirdGraphComponent implements OnInit {
  @Input() chartConfig?: ChartConfiguration;
  chart: Chart | null = null;

  ngOnInit(): void {
    if (this.chartConfig) {
      this.chart = new Chart('thirdChart', this.chartConfig);
    }
  }
}
