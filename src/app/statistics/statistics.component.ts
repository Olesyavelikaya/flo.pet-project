import { Component } from '@angular/core';
import { FirstGraphComponent } from './first-graph/first-graph.component';
import { SecondGraphComponent } from './second-graph/second-graph.component';
import { ThirdGraphComponent } from './third-graph/third-graph.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [FirstGraphComponent, SecondGraphComponent, ThirdGraphComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent {}
