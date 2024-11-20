import { Component, Input } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-second-graph',
  standalone: true,
  imports: [],
  templateUrl: './second-graph.component.html',
  styleUrl: './second-graph.component.css',
})
export class SecondGraphComponent {
  @Input() chartConfig?: ChartConfiguration;
  chart: Chart | null = null;

  ngOnInit(): void {
    if (this.chartConfig) {
      this.chart = new Chart('secondChart', this.chartConfig);
    }
  }
}
