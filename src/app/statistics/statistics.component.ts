import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirstGraphComponent } from './first-graph/first-graph.component';
import { FirstGraphService } from './first-graph/first-graph.service';
import { SecondGraphComponent } from './second-graph/second-graph.component';
import { SecondGraphService } from './second-graph/second-graph.service';
import { ThirdGraphComponent } from './third-graph/third-graph.component';
import { ThirdGraphService } from './third-graph/third-graph.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [FirstGraphComponent, SecondGraphComponent, ThirdGraphComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit, OnDestroy {
  firstGraphConfig?: ChartConfiguration;
  secondGraphConfig?: ChartConfiguration;
  thirdGraphConfig?: ChartConfiguration;

  constructor(
    private firstGraphService: FirstGraphService,
    private secondGraphService: SecondGraphService,
    private thirdGraphService: ThirdGraphService,
  ) {}

  ngOnInit(): void {
    this.firstGraphConfig = this.firstGraphService.getChartConfig();
    this.secondGraphConfig = this.secondGraphService.getChartConfig();
    this.thirdGraphConfig = this.thirdGraphService.getChartConfig();
  }

  ngOnDestroy() {
    this.firstGraphService.unsubscribe();
    this.secondGraphService.unsubscribe();
    this.thirdGraphService.unsubscribe();
  }
}
