import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-first-graph',
  standalone: true,
  imports: [],
  templateUrl: './first-graph.component.html',
  styleUrl: './first-graph.component.css',
})
export class FirstGraphComponent implements OnInit {
  @Input() chartConfig?: ChartConfiguration;
  chart: Chart | null = null;

  ngOnInit(): void {
    if (this.chartConfig) {
      this.chart = new Chart('firstChart', this.chartConfig);
    }
  }
}
