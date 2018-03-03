import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { forEach } from '@firebase/util';

@Component({
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  styleUrls: ['./item-report.component.css']
})
export class ItemReportComponent implements OnInit {

  @Input() itemId: string;
  @Input() google: any;
  costDataWithSD = [];
  quantityData = [];
  costData = [];
  startDate: any = null;
  endDate: any = null;
  chartType = 0;

  logTypeOptions = ['Added', 'Supplied', 'Donated'];

  constructor(private route: ActivatedRoute, private dataService: DataService) {
  }

  ngOnInit() {

  }

  fetchDataAndAddChart() {
    this.dataService.getLogsOfItemAsce(this.itemId, this.startDate, this.endDate)
      .subscribe(val => {
        this.calculateCost(val);
        this.calculateQuantity(val);

      });
  }

  // row = ['date','added','supplied','donated','currentQuantity']
  calculateQuantity(val) {
    let currentQuantity = 0, currentCost = 0;
    this.quantityData = [];
    this.costData = [];
    val.forEach(ele => {
      let row = [], costRow = [];
      if (ele.logType === this.logTypeOptions[0]) {

        currentQuantity += ele.quantity;
        row = [ele.date, ele.quantity, 0, 0, currentQuantity];

        currentCost += ele.cost;
        costRow = [ele.date, ele.cost, 0, 0, currentCost];

      } else if (ele.logType === this.logTypeOptions[1]) {

        currentQuantity -= ele.quantity;
        row = [ele.date, 0, ele.quantity, 0, currentQuantity];

        currentCost -= ele.cost;
        costRow = [ele.date, 0, ele.cost, 0, currentCost];
      } else {

        currentQuantity += ele.quantity;
        row = [ele.date, 0, 0, ele.quantity, currentQuantity];

        currentCost += ele.cost;
        costRow = [ele.date, 0, 0, ele.cost, currentCost];
      }
      this.quantityData.push(row);
      this.costData.push(costRow);
    });
    this.drawQuantityChart();
  }

  calculateCost(val) {
    this.costDataWithSD = [];
    val.forEach(element => {
      const row = [];
      row.push(element.date);
      row.push(element.cost);
      row.push(element.cost - 20);
      row.push(element.cost + 20);
      this.costDataWithSD.push(row);
    });
    this.drawCostChart();
  }

  drawCostChart() {
    const data = new this.google.visualization.DataTable();
    data.addColumn('datetime', 'x');
    data.addColumn('number', 'values');
    data.addColumn({ id: 'i0', type: 'number', role: 'interval' });
    data.addColumn({ id: 'i1', type: 'number', role: 'interval' });

    data.addRows(this.costDataWithSD);

    // The intervals data as narrow lines (useful for showing raw source data)
    const options_lines = {
      title: 'Line intervals, default',
      curveType: 'function',
      lineWidth: 4,
      intervals: { 'style': 'area' },
      height: 360,
    };

    const chart_lines = new this.google.visualization.LineChart(document.getElementById('costChart'));
    chart_lines.draw(data, options_lines);
  }

  drawQuantityChart() {
    const data = new this.google.visualization.DataTable();
    data.addColumn('datetime', 'date');
    data.addColumn('number', 'Purchased');
    data.addColumn('number', 'Issued');
    data.addColumn('number', 'Donated');
    data.addColumn('number', `Current ${(this.chartType ? 'Quantity' : 'Cost')}`);

    if (this.chartType) {
      data.addRows(this.quantityData);
    } else {
      data.addRows(this.costData);
    }

    const options = {
      title: `${(this.chartType ? 'Quantity' : 'Cost')} Reports`,
      curveType: 'function',
      legend: { position: 'right' },
      lineWidth: 3,
      animation: {
        duration: 1000,
        easing: 'in',
        startup: true
      },
      pointSize: 7,
      dataOpacity: 0.3,
      height: 360,
    };

    const chart = new this.google.visualization.LineChart(document.getElementById('quantityChart'));
    chart.draw(data, options);
  }

  addEventStart(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
    if (this.endDate !== null) {
      console.log('show graph');
      this.fetchDataAndAddChart();
    }
  }

  addEventEnd(type: string, event: MatDatepickerInputEvent<Date>) {
    this.endDate = event.value;
    if (this.startDate !== null) {
      console.log('show graph');
      this.fetchDataAndAddChart();
    }
  }

  switchCharts() {
    this.chartType = 1 - this.chartType;
    this.drawQuantityChart();
  }

}
