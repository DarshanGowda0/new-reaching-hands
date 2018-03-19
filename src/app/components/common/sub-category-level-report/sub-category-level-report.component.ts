import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';
import { tap, map } from 'rxjs/operators';
import { forEach } from '@firebase/util';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-sub-category-level-report',
  templateUrl: './sub-category-level-report.component.html',
  styleUrls: ['./sub-category-level-report.component.css']
})
export class SubCategoryLevelReportComponent implements OnInit {

  @Input() itemId: string;
  @Input() google: any;
  costData = [];
  temp: string = '';
  totalCost: number = 0;
  categoryList = ['Inventory', 'Services', 'Maintenance', 'Education'];
  subCategoryList: string[] = ['Assets', 'Groceries', 'Stationary', 'Toiletries', 'Perishablegoods', 'Miscellaneous', 'Genericmeds', 'Studentpersonelcare', 'Medicalcare', 'Transportation', 'Vehicle', 'Campus', 'Monthlybills', 'School', 'Homeschool', 'Extracurricular', 'Tutorials'];
  costComp: number[] = [];
  items: string[][] = [];
  logTypeOptions = ['Added', 'Issued', 'Donated'];
  display = ['ItemName', 'Cost', 'Category', 'SubCategory'];
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
          })
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

    this.dataService.getSummarysubCat(subCat).subscribe(val => {
      this.dataService.getAllItems().subscribe(items => {


        this.computeCost(val, items);
      });
    });
  }

  computeCost(val, items) {
    console.log('itemsssss', items);
    this.costData = [];
    const row = [];
    const myhash = new Map();
    const itemhash = new Map();
    let cost: number = 0;

    val.forEach(element => {
      if (myhash.has(element.itemId)) {
        cost = myhash.get(element.itemId) + element.cost;
        myhash.set(element.itemId, cost);
      }
      else {
        myhash.set(element.itemId, element.cost);
      }

    });

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

    console.log('new', dataArray);

    for (let i = 0; i < dataArray.length; i++) {
      this.costData.push([dataArray[i].id, dataArray[i].cost]);
    }
    this.drawChart();

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

  dateFormat(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return String(date.toLocaleString('en-US')).substr(0, 9);
  }


}
