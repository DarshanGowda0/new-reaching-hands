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
  selector: 'app-sub-category-level-report',
  templateUrl: './sub-category-level-report.component.html',
  styleUrls: ['./sub-category-level-report.component.css']
})
export class SubCategoryLevelReportComponent implements OnInit {

  @Input() itemId: string;
  @Input() google: any;
  nameHash = new Map();
  temp = '';
  totalCost = 0;
  categoryList = ['Inventory', 'Services', 'Maintenance', 'Education', 'Projects', 'HomeSchoolInventory'];
  subCategoryList: string[] = ['Assets', 'Groceries', 'Stationary', 'Toiletries',
    'Perishablegoods', 'Miscellaneous1', 'Miscellaneous2', 'Miscellaneous3', 'Miscellaneous4',
     'Genericmeds', 'Utilities', 'Studentpersonalcare', 'Medicalcare',
    'Transportation', 'Vehicle', 'Campus', 'Monthlybills', 'School', 'Homeschool', 'Extracurricular', 'Tutorials',
    'Construction', 'Installation', 'Painting', 'General', 'Assets-HS', 'Groceries-HS', 'Toiletries-HS',
    'Stationary-HS', 'Perishablegoods-HS', 'Miscellaneous-HS', 'Genericmeds-HS', 'Utilities-HS'];
  costComp: number[] = [];
  items: string[][] = [];
  logTypeOptions = ['Added', 'Issued', 'Donated'];
  displayedColumns = ['name', 'cost', 'type', 'category', 'subCategory'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private dataService: DataService, private dialog: MatDialog) { }
  ngOnInit() {
    this.google = this.route.snapshot.data.google;
    this.chosen('Assets');
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
        this.dataSource = new MatTableDataSource(logs);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }


  chosen(subCat: string) {

    this.dataService.getSummarysubCat(subCat).subscribe(logs => {
      this.dataService.getAllItems().subscribe(items => {
        this.getAllNames(items);
          this.computeDataForPieChart(logs, items);
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

  computeDataForPieChart(val, items) {
    const costData = [];
    const row = [];
    const myhash = new Map();
    const itemhash = new Map();
    let cost = 0;

    val.forEach(element => {
      if (element.logType !== 'Issued') {
      if (myhash.has(element.itemId)) {
        cost = myhash.get(element.itemId) + element.cost;
        myhash.set(element.itemId, cost);
      } else {
        myhash.set(element.itemId, element.cost);
      }

    }
    });
    console.log('itemhashval', myhash);

    items.forEach(element => {
      itemhash.set(element.itemId, element.itemName);
    });

    console.log('itemhash', itemhash);

    const dataArray = new Array();
    myhash.forEach((value, key) => {
      dataArray.push({
        'id': key,
        'cost': value
      });
    });

    console.log('newboww', dataArray);

    for (let i = 0; i < dataArray.length; i++) {
      const id = dataArray[i].id;
      costData.push([itemhash.get(id), dataArray[i].cost]);
    }
    this.drawChart(costData);

  }



  computeDataForTopTenItems(logs) {
    const costData = [];
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

    // console.log('array',dataArray[1]);

    const arrayTen = new Array();
    if (dataArray.length > 10) {
      for (let i = 0; i < 10; i++) {
        arrayTen[i] = dataArray[i];
      }
      this.drawChart1(arrayTen);
    } else {
      this.drawChart1(dataArray);
    }
    console.log('array', arrayTen[1]);

    // for (let i = 0; i < this.categoryList.length; i++) {
    //   this.costData.push([this.categoryList[i], this.costComp[i]]);
    // }


  }


  comupteDataForLineChart(val) {
    const costData = [];
    // tslint:disable-next-line:prefer-const
    let totalCost = 0;
    const myhash = new Map();
    const dateToData = new Map();

    val.forEach(element => {
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
    });

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
      costData.push(row);

    });
    this.drawLineChart(costData, dateToData);
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






  drawChart(costData) {
    const data = new this.google.visualization.DataTable();
    data.addColumn('string', 'subCategory');
    data.addColumn('number', 'cost');
    data.addRows(costData);

    const options = {
      title: 'Cost Summary',
      pieHole: 0.4,
    };

    const chart = new this.google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);

  }




  drawChart1(dataArray) {

    console.log('name ', dataArray);

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
    data.addColumn('string', 'x');
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
      const selectedItem = chart_lines.getSelection()[0]['row'];
      if (selectedItem) {
        const sDate = costData[selectedItem][0];
        const tableData = dateToData.get(sDate);
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
