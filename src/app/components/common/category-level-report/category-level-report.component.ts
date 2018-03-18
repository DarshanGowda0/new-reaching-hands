import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';
import { tap, map } from 'rxjs/operators';
import { forEach } from '@firebase/util';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

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
  costComp: number[] = [0, 0, 0, 0, 0, 0, 0];
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
      this.computeCost(val);

    });
  }

  computeCost(val) {
    this.costData = [];
    const row = [];
    val.forEach(element => {
      for (let i = 0; i < this.subCategoryList.length; i++) {
        if (element.subCategory === this.subCategoryList[i]) {
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
