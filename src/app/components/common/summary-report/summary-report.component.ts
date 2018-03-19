import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';
import { tap, map } from 'rxjs/operators';
import { forEach } from '@firebase/util';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

export interface CostModel {
  purchased: number;
  donated: number;
  total: number;
}

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.css']
})

export class SummaryReportComponent implements OnInit {
  @Input() itemId: string;
  @Input() google: any;
  costData = [];
  temp: string = null;
  totalCost = 0;
  categoryList = ['Inventory', 'Services', 'Maintenance', 'Education'];
  costComp: number[] = [0, 0, 0, 0];
  logTypeOptions = ['Added', 'Issued', 'Donated'];
  display = ['ItemName', 'Cost', 'Category', 'SubCategory'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private dataService: DataService, private dialog: MatDialog) { }
  ngOnInit() {
    this.google = this.route.snapshot.data.google;

    this.dataService.getSummary()
      .pipe(
        map(logs => {
          logs.forEach(item => {
            item.date = this.dateFormat(item.date);
          });
          return logs;
        })
      )
      .subscribe(logs => {
        this.dataService.getAllItems().subscribe(items => {
          this.computeCost(logs);
          this.computeCost1(logs, items);
          this.computeCost2(logs);
          this.dataSource = new MatTableDataSource(logs);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      });



  }


  computeCost(val) {
    this.costData = [];
    const row = [];
    val.forEach(element => {

      if (element.category === this.categoryList[0] && (element.logType !== 'Issued')) {
        this.costComp[0] += element.cost;
      } else if (element.category === this.categoryList[1] && (element.logType !== 'Issued')) {
        this.costComp[1] += element.cost;
      } else if (element.category === this.categoryList[2] && (element.logType !== 'Issued')) {
        this.costComp[2] += element.cost;
      } else if (element.category === this.categoryList[3] && (element.logType !== 'Issued')) {
        this.costComp[3] += element.cost;
      }
    });



    for (let i = 0; i < this.categoryList.length; i++) {
      this.costData.push([this.categoryList[i], this.costComp[i]]);
    }
    this.drawChart();

  }



  computeCost1(logs, items) {
    this.costData = [];
    const row = [];
    const myhash = new Map();
    const nameHash = new Map();


    // ('purchased','donated','full')

    logs.forEach(element => {
      if (myhash.has(element.itemId)) {
        const mCost = myhash.get(element.itemId);
        if (element.logType === this.logTypeOptions[0]) {
          mCost.purchased = mCost.purchased + element.cost;
          mCost.total = mCost.total + element.cost;
          myhash.set(element.itemId, mCost);
        } else if (element.logType === this.logTypeOptions[2]) {
          mCost.donated = mCost.donated + element.cost;
          mCost.total = mCost.total + element.cost;
          myhash.set(element.itemId, mCost);
        }
      } else {
        const mCost: CostModel = {
          purchased: 0,
          donated: 0,
          total: 0
        };
        if (element.logType === this.logTypeOptions[0]) {
          mCost.purchased = element.cost;
          mCost.total = element.cost;
          myhash.set(element.itemId, mCost);
        } else if (element.logType === this.logTypeOptions[2]) {
          mCost.donated = element.cost;
          mCost.total = element.cost;
          myhash.set(element.itemId, mCost);
        }
      }
    });

    items.forEach(element => {
      if (!nameHash.get(element.itemId)) {
        nameHash.set(element.itemId, element.itemName);
      }
    });

    const dataArray = new Array();
    myhash.forEach((value, key) => {
      dataArray.push({
        'id': key,
        'costObject': value
      });
    });



    dataArray.sort(function (a, b) {
      return b.costObject.total - a.costObject.total;
    });

    //console.log('array',dataArray[1]);

    const arrayTen = new Array();
    if (arrayTen.length > 10) {
      for (let i = 0; i < 10; i++) {
        arrayTen[i] = dataArray[i];
      }
      this.drawChart1(arrayTen, nameHash);
    }
    else {
      this.drawChart1(dataArray, nameHash);
    }
    console.log('array', arrayTen[1]);

    // for (let i = 0; i < this.categoryList.length; i++) {
    //   this.costData.push([this.categoryList[i], this.costComp[i]]);
    // }


  }

  computeCost2(val) {
    this.costData = [];

    const myhash = new Map();

    val.forEach(element => {
      if (myhash.has(element.date)) {
        if (element.logType !== this.logTypeOptions[1]) {

          this.totalCost += element.cost;
          myhash.set(element.date, this.totalCost);
        }
      } else {
        if (element.logType !== this.logTypeOptions[1]) {
          this.totalCost = element.cost;
          myhash.set(element.date, this.totalCost);
        }
      }
    });

    console.log('booooooooooootrre', myhash);

    const dataArray1 = new Array();
    myhash.forEach((value, key) => {
      dataArray1.push({
        'date': key,
        'cost': value
      });
    });


    dataArray1.forEach(element => {
      const row = [];

      row.push(this.dateFormat(element.date));
      row.push(element.cost);
      row.push(element.cost - 300);
      row.push(element.cost + 300);
      this.costData.push(row);

    });
    this.drawCostChart2();
  }

  compare(a, b) {
    if (a.last_nom < b.last_nom) {
      return -1;
    }
    if (a.last_nom > b.last_nom) {
      return 1;
    }
    return 0;
  }




  drawChart() {
    const data = new this.google.visualization.DataTable()
    data.addColumn('string', 'category');
    data.addColumn('number', 'cost');
    data.addRows(this.costData);

    const options = {
      title: 'Cost Summary',
      pieHole: 0.4,
    };

    const chart = new this.google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);

  }

  drawChart1(dataArray, nameHash) {

    console.log('name ', dataArray);

    const myData = [];
    myData.push(['Item', 'Total', 'Purchased', 'Donated']);
    dataArray.forEach((item) => {
      myData.push([nameHash.get(item.id), item.costObject.total, item.costObject.purchased, item.costObject.donated]);
    });

    const data = new this.google.visualization.arrayToDataTable(myData);

    const options = {
      title: 'Top 10 items',
      legend: { position: 'top' },
      chart: {
        title: 'Top 10 items',
        subtitle: 'Cost comparison'
      },
      bars: 'horizontal', // Required for Material Bar Charts.
      axes: {
        x: {
          0: { side: 'top', label: 'Cost' } // Top x-axis.
        }
      },
      bar: { groupWidth: '90%' }
    };

    const chart = new this.google.charts.Bar(document.getElementById('barchart_values'));
    chart.draw(data, options);
  }


  drawCostChart2() {
    const data = new this.google.visualization.DataTable();
    data.addColumn('string', 'x');
    data.addColumn('number', 'cost');
    data.addColumn({ id: 'i0', type: 'number', role: 'interval' });
    data.addColumn({ id: 'i1', type: 'number', role: 'interval' });

    data.addRows(this.costData);

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
  }

  dateFormat(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return String(date.toLocaleString('en-US')).substr(0, 9);
  }


}
