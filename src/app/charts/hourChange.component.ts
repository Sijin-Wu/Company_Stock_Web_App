// column-stack-chart.component.ts
import {Component, AfterViewInit, input, Input} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-hour-chart',
  template: '<div id="hourChart" style="min-width: 310px; height: 400px; margin: 0 auto"></div>\n',
  standalone: true,
  styleUrls: ['./hourChange.component.css']
})
export class HourChartComponent implements AfterViewInit {

  @Input() data : any[] = [];
  @Input() ticker: string = '';

  constructor() { }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  unixTimeToDate(unixTime: number): Date {
    return new Date(unixTime);
  }

  renderChart(): void {
    const startDate = this.unixTimeToDate(this.data[0].t);


    const seriesData= [];
    for (let p of this.data) {
      seriesData.push(p.c);
    }


    console.log("stateTime:  " + startDate)

    Highcharts.chart('hourChart', {
      chart: {
        type: 'spline',
        scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1
        }
      },
      title: {
        text: `${this.ticker}`,
        align: 'center'
      },
      xAxis: {
        type: 'datetime',
        labels: {
          overflow: 'justify'
        },
        align: 'right'
      },
      yAxis: {
        minorGridLineWidth: 0,
        gridLineWidth: 0,
        alternateGridColor: null,
      },
      tooltip: {
        valueSuffix: ' m/s'
      },
      plotOptions: {
        spline: {
          lineWidth: 4,
          states: {
            hover: {
              lineWidth: 5
            }
          },
          marker: {
            enabled: false
          },
          pointInterval: 3600000,
          pointStart: Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), 0, 0)
        }
      },
      series: [{
        name: 'price',
        data: seriesData

      }],
      navigation: {
        menuItemStyle: {
          fontSize: '10px'
        }
      }
    } as any);
  }

}
