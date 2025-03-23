
import {Component, AfterViewInit, input, Input} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-eps-chart',
  template: '<div id="epsChart" style="min-width: 310px; height: 400px; margin: 0 auto"></div>\n',
  standalone: true,
  styleUrls: ['./eps.component.css']
})
export class EPSChartComponent implements AfterViewInit {

  @Input() data : any[] = [{},{},{},{}];

  constructor() { }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  renderChart(): void {
    const line1 = [
      `${this.data[0].period}\nSurprise: ${this.data[0].surprise}`,
      `${this.data[1].period}\nSurprise: ${this.data[1].surprise}`,
      `${this.data[2].period}\nSurprise: ${this.data[2].surprise}`,
      `${this.data[3].period}\nSurprise: ${this.data[3].surprise}`];


    Highcharts.chart('epsChart', {
      title: {
        text: 'Historical EPS Surprises'
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS'
        }
      },

      xAxis: {
        categories: line1
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      series: [
        {
          name: 'Actual',
          data: [
            this.data[0].actual,
            this.data[1].actual,
            this.data[2].actual,
            this.data[3].actual
          ]
        },
        {
          name: 'Estimate',
          data: [
            this.data[0].estimate,
            this.data[1].estimate,
            this.data[2].estimate,
            this.data[3].estimate
          ]
        }
      ]
    } as any);
  }

}
