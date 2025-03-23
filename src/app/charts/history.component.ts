import {Component, AfterViewInit, input, Input} from '@angular/core';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-history-chart',
  template: '<div id="historyChart" style="min-width: 310px; height: 400px; margin: 0 auto"></div>\n',
  standalone: true,
  styleUrls: ['./history.component.css']
})
export class HistoryChartComponent implements AfterViewInit {

  @Input() data : any[] = [];
  @Input() ticker: string = '';

  constructor() { }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  renderChart(): void {
    const ohlc = [],
      volume = [],
      dataLength = this.data.length,
      groupingUnits = [[
        'week',
        [1]
      ], [
        'month',
        [1, 2, 3, 4, 6]
      ]];

    for (let i = 0; i < dataLength; i += 1) {
      ohlc.push([
        this.data[i].t,
        this.data[i].o,
        this.data[i].h,
        this.data[i].l,
        this.data[i].c
      ]);

      volume.push([
        this.data[i].t,
        this.data[i].vw
      ]);
    }


    Highcharts.stockChart('historyChart', {

      rangeSelector: {
        selected: 2
      },

      title: {
        text: `${this.ticker} Historical`
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },

      plotOptions: {
        series: {
          dataGrouping: {
            units: groupingUnits
          }
        }
      },

      series: [{
        type: 'candlestick',
        name: `${this.ticker}`,
        id: `${this.ticker}`,
        zIndex: 2,
        data: ohlc
      },
        {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
      },
      ]
    } as any);
  }

}
