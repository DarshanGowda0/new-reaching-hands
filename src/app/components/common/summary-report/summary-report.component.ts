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
  temp: string = null;
  categoryList = ['Inventory', 'Services', 'Maintenance', 'Education'];
  logTypeOptions = ['Added', 'Issued', 'Donated'];
  displayedColumns = ['name', 'cost', 'type', 'category', 'subCategory'];
  nameHash = new Map();
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
          this.getAllNames(items);
          this.computeDataForPieChart(logs);
          this.computeDataForTopTenItems(logs);
          this.comupteDataForLineChart(logs);
        });
      });
  }

  getAllNames(items) {
    items.forEach(element => {
      if (!this.nameHash.get(element.itemId)) {
        this.nameHash.set(element.itemId, element.itemName);
      }
    });
  }


  computeDataForPieChart(val) {
    const costData = [];
    const row = [];
    const costComp: number[] = [0, 0, 0, 0];
    val.forEach(element => {
      if (element.category === this.categoryList[0] && (element.logType !== 'Issued')) {
        costComp[0] += element.cost;
      } else if (element.category === this.categoryList[1] && (element.logType !== 'Issued')) {
        costComp[1] += element.cost;
      } else if (element.category === this.categoryList[2] && (element.logType !== 'Issued')) {
        costComp[2] += element.cost;
      } else if (element.category === this.categoryList[3] && (element.logType !== 'Issued')) {
        costComp[3] += element.cost;
      }
    });
    for (let i = 0; i < this.categoryList.length; i++) {
      costData.push([this.categoryList[i], costComp[i]]);
    }
    this.drawPieChart(costData);

  }



  computeDataForTopTenItems(logs) {
    const row = [];
    const myhash = new Map();
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



    const dataArray = new Array();
    myhash.forEach((value, key) => {
      dataArray.push({
        'id': key,
        'costObject': value
      });
    });

    dataArray.sort((a, b) => {
      return b.costObject.total - a.costObject.total;
    });

    const arrayTen = new Array();
    if (dataArray.length > 10) {
      for (let i = 0; i < 10; i++) {
        arrayTen[i] = dataArray[i];
      }
      this.topTenItemsChart(arrayTen);
    } else {
      this.topTenItemsChart(dataArray);
    }

  }

  comupteDataForLineChart(val) {
    const costData = [];
    const myhash = new Map();
    const dateToData = new Map();

    val.forEach(element => {

      const tempDate = new Date(element.date);

      if (element.logType !== this.logTypeOptions[1]) {
        if (myhash.has(element.date)) {
          const previousCost = myhash.get(element.date);
          myhash.set(element.date, previousCost + element.cost);

          const tempArray = dateToData.get(element.date);
          tempArray.push(element);
          dateToData.set(element.date, tempArray);
        } else {
          myhash.set(element.date, element.cost);

          const elementDataArray = new Array();
          elementDataArray.push(element);
          dateToData.set(element.date, elementDataArray);
        }
      }
      // if (myhash.has(element.date)) {
      //   if (element.logType !== this.logTypeOptions[1]) {
      //     totalCost += element.cost;
      //     myhash.set(element.date, totalCost);
      //     const tempArray = dateToData.get(element.date);
      //     tempArray.push(element);
      //     dateToData.set(element.date, tempArray);
      //   }
      // } else {
      //   if (element.logType !== this.logTypeOptions[1]) {
      //     totalCost = element.cost;
      //     myhash.set(element.date, totalCost);
      //     const elementDataArray = new Array();
      //     elementDataArray.push(element);
      //     dateToData.set(element.date, elementDataArray);
      //   }
      // }
    });

    const dataArray = new Array();
    myhash.forEach((value, key) => {
      dataArray.push({
        'date': key,
        'cost': value
      });
    });

    dataArray.sort((a, b) => {
      const aDate = new Date(b.date);
      const bDate = new Date(a.date);
      return (bDate > aDate ? 1 : -1);
    });

    dataArray.forEach(element => {
      const row = [];

      row.push(new Date(element.date));
      row.push(element.cost);
      row.push(element.cost - 300);
      row.push(element.cost + 300);
      costData.push(row);

    });
    this.drawLineChart(costData, dateToData);
  }

  drawPieChart(costData) {
    const data = new this.google.visualization.DataTable();
    data.addColumn('string', 'category');
    data.addColumn('number', 'cost');
    data.addRows(costData);

    const options = {
      title: 'Cost Summary',
      pieHole: 0.4,
    };

    const chart = new this.google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);

  }

  topTenItemsChart(dataArray) {

    const myData = [];
    myData.push(['Item', 'Total', 'Purchased', 'Donated']);
    dataArray.forEach((item) => {
      myData.push([this.nameHash.get(item.id), item.costObject.total, item.costObject.purchased, item.costObject.donated]);
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


  drawLineChart(costData, dateToData) {
    const data = new this.google.visualization.DataTable();
    data.addColumn('date', 'x');
    data.addColumn('number', 'cost');
    data.addColumn({ id: 'i0', type: 'number', role: 'interval' });
    data.addColumn({ id: 'i1', type: 'number', role: 'interval' });

    data.addRows(costData);

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
    this.google.visualization.events.addListener(chart_lines, 'select', () => {

      const selectedItem = chart_lines.getSelection()[0];
      if (selectedItem) {
        const sDate = costData[selectedItem.row][0];
        console.log(this.dateFormat(sDate));
        const tableData = dateToData.get(this.dateFormat(sDate));
        this.dataSource = new MatTableDataSource(tableData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }

    });
  }

  dateFormat(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return String(date.toLocaleString('en-US')).substr(0, 9);
  }

  getFullDate(date) {
    return String(date.toLocaleString('en-US'));
  }

  getName(itemId) {
    return this.nameHash.get(itemId);
  }

}
