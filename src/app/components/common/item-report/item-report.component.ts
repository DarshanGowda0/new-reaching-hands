import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  styleUrls: ['./item-report.component.css']
})
export class ItemReportComponent implements OnInit {

  @Input() itemId: string;
  @Input() google: any;
  data = [];
  startDate: any = null;
  endDate: any = null;

  constructor(private route: ActivatedRoute, private dataService: DataService) {
  }

  ngOnInit() {

  }

  fetchDataAndAddChart() {
    this.dataService.getLogsOfItemAsce(this.itemId, this.startDate, this.endDate).subscribe(val => {
      this.data = [];
      val.forEach(element => {
        const row = [];
        row.push(String(element.date));
        row.push(element.cost);
        row.push(element.cost - 20);
        row.push(element.cost + 20);
        this.data.push(row);
      });
      this.drawChart(this.google);
    });
  }

  drawChart(google) {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'x');
    data.addColumn('number', 'values');
    data.addColumn({ id: 'i0', type: 'number', role: 'interval' });
    data.addColumn({ id: 'i1', type: 'number', role: 'interval' });

    data.addRows(this.data);

    // The intervals data as narrow lines (useful for showing raw source data)
    const options_lines = {
      title: 'Line intervals, default',
      curveType: 'function',
      lineWidth: 4,
      intervals: { 'style': 'area' },
      legend: 'none'
    };

    const chart_lines = new google.visualization.LineChart(document.getElementById('piechart'));
    chart_lines.draw(data, options_lines);
  }

  addEventStart(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
    if (this.endDate !== null) {
      console.log('show graph');
      this.fetchDataAndAddChart();
    }
  }

  addEventEnd(type: string, event: MatDatepickerInputEvent<Date>) {
    this.endDate = event.value;
    if (this.startDate !== null) {
      console.log('show graph');
      this.fetchDataAndAddChart();
    }
  }

  // validDate(): boolean {
  //   if (this.endDate < this.startDate) {
  //     alert('invalid date range');
  //     return false;
  //   }
  //   return true;
  // }

}
