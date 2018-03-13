import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';
import { tap } from 'rxjs/operators';
import { forEach } from '@firebase/util';

export interface IHash {
  [details: string]: number;
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



  constructor(private route: ActivatedRoute, private dataService: DataService) { }
  ngOnInit() {
    this.google = this.route.snapshot.data.google;

    this.dataService.getSummary().pipe(
      tap(val => {

        this.computeCost(val);
        this.computeCost1(val);
      })
    ).subscribe(val => {
      console.log(val);

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



  computeCost1(val) {
    this.costData = [];
    const row = [];
    const myhash: IHash = {};

    val.forEach(element => {

      myhash[element.itemId] = 0;

    });
    val.forEach(element => {
      myhash[element.itemId] += element.cost;
    });

    console.log('hashValues:', myhash);

    // assign the top 10 values to two different arrays and pass

    for (let i = 0; i < this.categoryList.length; i++) {
      this.costData.push([this.categoryList[i], this.costComp[i]]);
    }
    this.drawChart1();

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

  drawChart1() {
    const data = new this.google.visualization.DataTable()
    data.addColumn('string', 'item');
    data.addColumn('number', 'costAggr');
    data.addRows(this.costData);


    const view = new this.google.visualization.DataView(data);
    view.setColumns([0, 1]);

    const options = {
      title: 'Top 10 items on expense list',
      width: 600,
      height: 400,
      bar: { groupWidth: '95%' },
      legend: { position: 'none' },
      colors: ['#000', '#4374e0', '#e2431e', '#4374e0'],
    };
    const chart = new this.google.visualization.BarChart(document.getElementById('barchart_values'));
    chart.draw(view, options);
  }
}
