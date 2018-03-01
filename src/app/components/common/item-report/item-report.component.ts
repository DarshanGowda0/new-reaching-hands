import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';

@Component({
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  styleUrls: ['./item-report.component.css']
})
export class ItemReportComponent implements OnInit {

  itemId = 'OAbQXmwQf9DuwD3DjXK9';
  private google: any;
  data = [];

  constructor(private route: ActivatedRoute, private dataService: DataService) {
  }

  ngOnInit() {
    this.google = this.route.snapshot.data.google;
    this.dataService.getLogsOfItemAsce(this.itemId).subscribe(val => {
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

}
