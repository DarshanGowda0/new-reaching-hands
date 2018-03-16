import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';
import { tap } from 'rxjs/operators';
import { forEach } from '@firebase/util';

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
  categoryList = ['Inventory', 'Services', 'Maintenance', 'Education'];
  costComp: number[] = [0, 0, 0, 0];
  logTypeOptions = ['Added', 'Issued', 'Donated'];


  constructor(private route: ActivatedRoute, private dataService: DataService) { }
  ngOnInit() {
    this.google = this.route.snapshot.data.google;

    this.dataService.getSummary()
      // .pipe(
      //   tap(logs => {

      //   })
      // )
      .subscribe(logs => {
        this.dataService.getAllItems().subscribe(items => {
          this.computeCost(logs);
          this.computeCost1(logs, items);
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

    for (let i = 0; i < this.categoryList.length; i++) {
      this.costData.push([this.categoryList[i], this.costComp[i]]);
    }
    this.drawChart1(dataArray, nameHash);

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

    console.log('name ', nameHash);

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
}
