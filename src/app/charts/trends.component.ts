import {Component, AfterViewInit, input, Input} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-trends-chart',
  template: '<div id="columnStackChart" style="min-width: 310px; height: 400px; margin: 0 auto"></div>\n',
  standalone: true,
  styleUrls: ['./trends.component.css']
})
export class ColumnStackChartComponent implements AfterViewInit {

  @Input() data : any[] = [{},{},{},{},{}];

  constructor() { }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  renderChart(): void {
    Highcharts.chart('columnStackChart', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Recommendation Trends'
      },
      xAxis: {
        categories: [this.data[0].period, this.data[1].period, this.data[2].period, this.data[3].period]
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: (Highcharts as any).defaultOptions.title.style.color
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: (Highcharts as any).defaultOptions.legend.backgroundColor,
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          name: 'Strong Buy',
          data: [
            this.data[0].strongBuy,
            this.data[1].strongBuy,
            this.data[2].strongBuy,
            this.data[3].strongBuy
          ]
        },
        {
          name: 'Buy',
          data: [
            this.data[0].buy,
            this.data[1].buy,
            this.data[2].buy,
            this.data[3].buy
          ]
        },
        {
          name: 'Hold',
          data: [
            this.data[0].hold,
            this.data[1].hold,
            this.data[2].hold,
            this.data[3].hold
          ]
        },
        {
          name: 'Sell',
          data: [
            this.data[0].sell,
            this.data[1].sell,
            this.data[2].sell,
            this.data[3].sell
          ]
        },
        {
          name: 'Strong Sell',
          data: [
            this.data[0].strongSell,
            this.data[1].strongSell,
            this.data[2].strongSell,
            this.data[3].strongSell
          ]
        }
      ]
    } as any);
  }

}
