import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';
import { tap } from 'rxjs/operators';
import { forEach } from '@firebase/util';

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
        console.log(val);
      })
    ).subscribe(val => {
      this.computeCost(val);
    });
  }


  computeCost(val) {
    this.costData = [];
    const row = [];
    val.forEach(element => {

      if (element.category === this.categoryList[0] && !(element.logType === 'Issued')) {
        this.costComp[0] += element.cost;
      }
      else if (element.category === this.categoryList[1] && !(element.logType === 'Issued')) {
        this.costComp[1] += element.cost;
      }
     else if (element.category === this.categoryList[2] && !(element.logType === 'Issued')) {
        this.costComp[2] += element.cost;
      }
      else if (element.category === this.categoryList[3] && !(element.logType === 'Issued')) {
        this.costComp[3] += element.cost;
      }
    });



    for (var i = 0; i < this.categoryList.length; i++) {
      this.costData.push([this.categoryList[i], this.costComp[i]]);
    }
    this.drawChart();
  }




  drawChart() {
    var data = new this.google.visualization.DataTable()
    data.addColumn('string', 'category');
    data.addColumn('number', 'cost');
    data.addRows(this.costData);


    var options = {
      title: 'Cost Summary',
      pieHole: 0.4,
    };

    var chart = new this.google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);

  }
}
