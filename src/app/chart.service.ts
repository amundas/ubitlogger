import { Injectable } from '@angular/core';
import 'chartjs-plugin-zoom'
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  private chartOptions = {
      type: 'scatter',
      data: {
          datasets: []
      },
      options: {
          title: {
              display: false,
          },
          legend: {
              display: true
          },
          scales: {
              xAxes: [{
                  type: 'linear',
                    display: true,
                    scaleLabel: {
                        labelString: 'Timestamp',
                        display: true,
                    }
              }]
          },
                
      },
  }

  getChart(chartData: ChartData[], chartRef: any): any {
    let datasets = [];
      for (let i = 0; i < chartData.length; i++) {
        const newDataSet = {
            label: chartData[i].label,
            showLine: true,
            data: chartData[i].data,
            borderColor: chartData[i].color,
            fill: false,
            pointHitRadius: 20,
        };
        datasets.push(newDataSet);
      }
   
    this.chartOptions.data.datasets = datasets;
    return new Chart(chartRef.nativeElement.getContext('2d'), this.chartOptions);
  }
}

export class ChartData {
    constructor(color: string, label: string, data: any) {
        this.color = color;
        this.label = label;
        this.data = data;
    }
    public color: string;
    public label: string;
    public data: {
        x: number[],
        y: number[]
    }
}