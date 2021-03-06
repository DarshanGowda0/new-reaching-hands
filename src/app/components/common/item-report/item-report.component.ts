import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { forEach } from '@firebase/util';
import { tap } from 'rxjs/operators';
import { ReportDetails } from '../../../models/report-details';

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


  logTypeOptions = ['Added', 'Issued', 'Donated'];

  sum = 0;
  agg = 0;
  mean;
  standardDeviation;
  reportDetails: ReportDetails;
  isDone = false;


  constructor(private route: ActivatedRoute, private dataService: DataService) {
  }

  ngOnInit() {
    this.initializeReportDetails();
  }

  // changing this only for issued
  fetchDataAndAddChart() {
    this.dataService.getLogsOfItemAsce(this.itemId, this.startDate, this.endDate)
      .pipe(
        tap(val => {
          let count = 0;
          val.forEach(element => {
            if (element.logType === this.logTypeOptions[1]) {
              this.sum += element.cost;
              count++;
            }
          });
          this.mean = this.sum / count;
          val.forEach(element => {
            if (element.logType === this.logTypeOptions[1]) {
              this.agg += Math.pow(element.cost - this.mean, 2);
            }
          });
          this.standardDeviation = Math.pow(this.agg / count, 1 / 2);
        })
      ).subscribe(val => {
        this.calculateCost(val);
        this.calculateQuantity(val);
      });
  }

  // row = ['date','added','Issued','donated','currentQuantity']
  calculateQuantity(val) {
    let currentQuantity = 0, currentCost = 0;
    this.quantityData = [];
    this.costData = [];

    const issuedArray = [[], []];
    const donatedArray = [[], []];
    const purchasedArray = [[], []];
    const currentArray = [[], []];

    this.initializeReportDetails();
    val.forEach(ele => {
      let row = [], costRow = [];
      // added
      if (ele.logType === this.logTypeOptions[0]) {

        currentQuantity += ele.quantity;
        row = [this.dateFormat(ele.date), ele.quantity, 0, 0, currentQuantity];

        currentCost += ele.cost;
        costRow = [this.dateFormat(ele.date), ele.cost, 0, 0, currentCost];

        purchasedArray[0].push([ele.date, ele.quantity]);
        purchasedArray[1].push([ele.date, ele.cost]);
        currentArray[0].push([ele.date, ele.currentQuantity]);
        currentArray[1].push([ele.date, ele.currentCost]);

        this.reportDetails.addedCost += ele.cost;
        this.reportDetails.addedQuantity += ele.quantity;

      }
      // issued
      else if (ele.logType === this.logTypeOptions[1]) {

        currentQuantity -= ele.quantity;
        row = [this.dateFormat(ele.date), 0, ele.quantity, 0, currentQuantity];

        currentCost -= ele.cost;
        costRow = [this.dateFormat(ele.date), 0, ele.cost, 0, currentCost];

        issuedArray[0].push([ele.date, ele.quantity]);
        issuedArray[1].push([ele.date, ele.cost]);
        currentArray[0].push([ele.date, ele.currentQuantity]);
        currentArray[1].push([ele.date, ele.currentCost]);

        this.reportDetails.issuedCost += ele.cost;
        this.reportDetails.issuedQuantity += ele.quantity;
      }
      // donated
      else {

        currentQuantity += ele.quantity;
        row = [this.dateFormat(ele.date), 0, 0, ele.quantity, currentQuantity];

        currentCost += ele.cost;
        costRow = [this.dateFormat(ele.date), 0, 0, ele.cost, currentCost];

        donatedArray[0].push([ele.date, ele.quantity]);
        donatedArray[1].push([ele.date, ele.cost]);
        currentArray[0].push([ele.date, ele.currentQuantity]);
        currentArray[1].push([ele.date, ele.currentCost]);

        this.reportDetails.donatedCost += ele.cost;
        this.reportDetails.donatedQuantity += ele.quantity;
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
      if (element.logType === this.logTypeOptions[1]) {
        row.push(this.dateFormat(element.date));
        row.push(element.cost);
        row.push(this.mean);
        row.push(this.mean - 2 * this.standardDeviation);
        row.push(this.mean + 2 * this.standardDeviation);
        this.costDataWithSD.push(row);
      }
    });
    this.drawCostChart();
  }

  drawCostChart() {
    const data = new this.google.visualization.DataTable();
    data.addColumn('string', 'x');
    data.addColumn('number', 'cost');
    data.addColumn('number', 'mean');
    data.addColumn({ id: 'i0', type: 'number', role: 'interval' });
    data.addColumn({ id: 'i1', type: 'number', role: 'interval' });

    data.addRows(this.costDataWithSD);

    // The intervals data as narrow lines (useful for showing raw source data)
    const options_lines = {
      title: 'Consumption rate',
      curveType: 'function',
      lineWidth: 4,
      intervals: { 'style': 'area' },
      animation: {
        duration: 1000,
        easing: 'in',
        startup: true
      },
      pointSize: 7,
      dataOpacity: 0.3,
      height: 360,
      series: {
        1: { lineDashStyle: [4, 1] }
      },
      colors: ['#e2431e', '#4374e0'],
    };

    const chart_lines = new this.google.visualization.LineChart(document.getElementById('costChart'));
    chart_lines.draw(data, options_lines);
    this.google.visualization.events.addListener(chart_lines, 'select', function () {
      const selectedItem = chart_lines.getSelection()[0];
      if (selectedItem) {
        console.log(selectedItem.row, ' ', selectedItem.column);
      }
    });
  }

  drawQuantityChart() {
    const data = new this.google.visualization.DataTable();
    data.addColumn('string', 'date');
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
      this.isDone = true;
      this.fetchDataAndAddChart();
    }
  }

  addEventEnd(type: string, event: MatDatepickerInputEvent<Date>) {
    this.endDate = event.value;
    if (this.startDate !== null) {
      console.log('show graph');
      this.isDone = true;
      this.fetchDataAndAddChart();
    }
  }

  switchCharts() {
    this.chartType = 1 - this.chartType;
    this.drawQuantityChart();
  }

  initializeReportDetails() {
    this.reportDetails = {
      addedCost: 0,
      addedQuantity: 0,
      donatedCost: 0,
      donatedQuantity: 0,
      issuedCost: 0,
      issuedQuantity: 0
    };
  }

  dateFormat(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return String(date.toDate().toLocaleString('en-US'));
  }

}

// arr = ['in','main']

// for each i in arr:
//    data.push([i,'1234']) =  or row.push(i);row.push(1234)
