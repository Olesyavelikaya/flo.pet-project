import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartType, ChartOptions, ChartDataset } from 'chart.js';
import { ChartDataService } from './chart-data.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent {
  public chartData1: ChartDataset[] = [];
  public chartLabel1: string[] = [];
  public chartType1: ChartType = 'bar';
  public chartOptions1: ChartOptions = {
    responsive: true
  };

  public chartData2: ChartDataset[] = [];
  public chartLabel2: string[] = [];
  public chartType2: ChartType = 'pie';
  public chartOptions2: ChartOptions = {
    responsive: true
  };

  public chartData3: ChartDataset[] = [];
  public chartLabel3: string[] = [];
  public chartType3: ChartType = 'pie';
  public chartOptions3: ChartOptions = {
    responsive: true
  };

//   private subscription: Subscription;
//
//   constructor(private chartDataService: ChartDataService) {}
//
// ngOnInit() {
//     this.subscription = this.chartDataService.chartData$.subscribe(data => {
//       if (data) {
//         this.updateChartData(data)
//       }
//     })
// }
//
// updateChartData(data){
//     if(data.chart1) {
//       this.chartData1 = data.chart1.datasets;
//       this.chartLabel1 = data.chart1.labels
//     }
//   if(data.chart2) {
//     this.chartData2 = data.chart1.datasets;
//     this.chartLabel2 = data.chart1.labels
//   }
//
//   if(data.chart3) {
//     this.chartData3 = data.chart1.datasets;
//     this.chartLabel3 = data.chart1.labels
//   }
// }
//
//   ngOnDestroy() {
//     this.subscription.unsubscribe();
//   }
}
