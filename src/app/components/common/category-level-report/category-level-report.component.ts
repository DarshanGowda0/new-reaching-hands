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
  selector: 'app-category-level-report',
  templateUrl: './category-level-report.component.html',
  styleUrls: ['./category-level-report.component.css']
})

export class CategoryLevelReportComponent implements OnInit {

  @Input() itemId: string;
  @Input() google: any;
  costData = [];
  temp: string = null;
  totalCost: number = 0;
  categoryList = ['Inventory', 'Services', 'Maintenance', 'Education'];
  subCategoryList: string[] = null;
  costComp: number[] = [];
  logTypeOptions = ['Added', 'Issued', 'Donated'];
  display = ['ItemName', 'Cost', 'Category', 'SubCategory'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private dataService: DataService, private dialog: MatDialog) { }
  ngOnInit() {
    this.google = this.route.snapshot.data.google;
    this.chosen('Inventory');
    this.dataService.getSummary()
      .pipe(
        map(logs => {
          logs.forEach(item => {
            item.date = this.dateFormat(item.date);
          })
          return logs;
        })
      )
      .subscribe(logs => {
        this.dataService.getAllItems().subscribe(items => {


          this.dataSource = new MatTableDataSource(logs);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      });



  }


  chosen(cat: string) {
    this.subCategoryList = null;
    if (cat == 'Inventory') {
      this.subCategoryList = ['Assets', 'Groceries', 'Stationary', 'Toiletries', 'Perishablegoods', 'Miscellaneous', 'Genericmeds'];
    }
    else if (cat == 'Services') {
      this.subCategoryList = ['Studentpersonelcare', 'Medicalcare', 'Transportation'];
    }
    else if (cat == 'Maintenance') {
      this.subCategoryList = ['Vehicle', 'Campus', 'Monthlybills'];
    }
    else {
      this.subCategoryList = ['School', 'Homeschool', 'Extracurricular', 'Tutorials'];
    }


    this.dataService.getSummaryCat(cat).subscribe(val => {
      this.dataService.getAllItemsCat(cat).subscribe(items => {
        this.computeCost(val);
        this.computeCost1(val, items);
      });
    });
  }

  computeCost(val) {
    this.costData = [];
    const row = [];
    for (let i = 0; i < this.subCategoryList.length; i++) {
      this.costComp[i] = 0;
    }



    val.forEach(element => {
      for (let i = 0; i < this.subCategoryList.length; i++) {
        if (element.subCategory === this.subCategoryList[i] && (element.logType !== 'Issued')) {
          this.costComp[i] += element.cost;
        }
      }

    });

    console.log('val2', this.costComp);
    for (let i = 0; i < this.subCategoryList.length; i++) {
      this.costData.push([this.subCategoryList[i], this.costComp[i]]);
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
    if (dataArray.length > 10) {
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



  drawChart() {
    const data = new this.google.visualization.DataTable()
    data.addColumn('string', 'subCategory');
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



  dateFormat(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return String(date.toLocaleString('en-US')).substr(0, 9);
  }


}
