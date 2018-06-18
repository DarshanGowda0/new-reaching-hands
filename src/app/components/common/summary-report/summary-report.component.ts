import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data-service.service';
import { tap, map } from 'rxjs/operators';
import { forEach } from '@firebase/util';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatDatepickerInputEvent } from '@angular/material';
// import { model } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

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
  startDate: any = null;
  endDate: any = null;

  fullData = [];
  predictionMap: any;

  // line chart variables
  lineChartCostData: any;
  lineChartDatetoData: any;

  isDone = false;
  categoryList = ['Inventory', 'Services', 'Maintenance', 'Education', 'Projects', 'HomeSchoolInventory'];
  logTypeOptions = ['Added', 'Issued', 'Donated'];
  displayedColumns = ['name', 'cost', 'type', 'category', 'subCategory'];
  nameHash = new Map();
  dataSource: MatTableDataSource<any>;

  isProgress = false;

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

  fetchDataAndAddChart() {
    this.dataService.getSummaryDatePicker(this.startDate, this.endDate)
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
    const costComp: number[] = [0, 0, 0, 0, 0, 0];
    val.forEach(element => {
      if (element.category === this.categoryList[0] && (element.logType !== 'Issued')) {
        costComp[0] += element.cost;
      } else if (element.category === this.categoryList[1] && (element.logType !== 'Issued')) {
        costComp[1] += element.cost;
      } else if (element.category === this.categoryList[2] && (element.logType !== 'Issued')) {
        costComp[2] += element.cost;
      } else if (element.category === this.categoryList[3] && (element.logType !== 'Issued')) {
        costComp[3] += element.cost;
      } else if (element.category === this.categoryList[4] && (element.logType !== 'Issued')) {
        costComp[4] += element.cost;
      } else if (element.category === this.categoryList[5] && (element.logType !== 'Issued')) {
        costComp[5] += element.cost;
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

      if (element.logType === this.logTypeOptions[1]) {
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
      // row.push(element.cost - 300);
      // row.push(element.cost + 300);
      costData.push(row);

    });
    this.fullData = dataArray;
    this.lineChartCostData = costData;
    this.lineChartDatetoData = dateToData;
    this.drawLineChart();

  }

  addEventStart(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
    if (this.endDate !== null) {
      console.log('show graph');
      this.isDone = true;
      this.fetchDataAndAddChart();
    }
  }

  addEventEnd(type: string, event: MatDatepickerInputEvent<Date>) {
    this.endDate = event.value;
    if (this.startDate !== null) {
      console.log('show graph');
      this.isDone = true;
      this.fetchDataAndAddChart();
    }
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


  drawLineChart() {

    const costData = this.lineChartCostData;
    const dateToData = this.lineChartDatetoData;

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

    console.log('map ', this.predictionMap);
    const data = new this.google.visualization.DataTable();
    data.addColumn('date', 'x');
    data.addColumn('number', 'cost');
    // data.addColumn({ id: 'i0', type: 'number', role: 'interval' });
    // data.addColumn({ id: 'i1', type: 'number', role: 'interval' });

    data.addRows(costData);

    const chart_lines = new this.google.visualization.LineChart(document.getElementById('costChart'));
    chart_lines.draw(data, options_lines);
    this.google.visualization.events.addListener(chart_lines, 'select', () => {

      const selectedItem = chart_lines.getSelection()[0];
      if (selectedItem) {
        const sDate = costData[selectedItem.row][0];
        const tableData = dateToData.get(this.dateFormatForDate(sDate));
        this.dataSource = new MatTableDataSource(tableData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }

    });

    // prediction chart
    if (this.predictionMap !== undefined) {
      console.log('pred graph called');
      const originalData = new this.google.visualization.DataTable();
      originalData.addColumn('date', 'date');
      originalData.addColumn('number', 'cost');
      originalData.addRows(costData);

      const predictedDataArray = [];
      costData.forEach(singleRow => {
        const tempDate = singleRow[0];
        if (this.predictionMap.has(this.daysIntoYear(tempDate))) {
          const predCost = this.predictionMap.get(this.daysIntoYear(tempDate));
          predictedDataArray.push([tempDate, predCost]);
        }
      });

      // add next 10 days
      for (let i = 0; i < 10; i++) {
        const today = new Date();
        today.setDate(today.getDate() + i);
        console.log(today);
        if (this.predictionMap.has(this.daysIntoYear(today))) {
          const mCost = this.predictionMap.get(this.daysIntoYear(today));
          predictedDataArray.push([today, mCost]);
        }
      }

      console.log('pred array ', predictedDataArray);

      const predictedData = new this.google.visualization.DataTable();
      predictedData.addColumn('date', 'date');
      predictedData.addColumn('number', 'predicted-cost');
      predictedData.addRows(predictedDataArray);

      const joinedData = this.google.visualization.data.join(originalData, predictedData, 'full', [[0, 0]], [1], [1]);

      const predLineGraph = new this.google.visualization.LineChart(document.getElementById('predChart'));
      predLineGraph.draw(joinedData, options_lines);


    }
  }

  dateFormat(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return String(date.toDate().toLocaleString('en-US')).substr(0, 9);
  }

  dateFormatForDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return String(date.toLocaleString('en-US')).substr(0, 9);
  }

  getFullDate(date) {

    return String(date.toLocaleString('en-US'));

  }

  getName(itemId) {
    return this.nameHash.get(itemId);
  }

  daysIntoYear(date) {
    date = new Date(date);
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
  }

  showPredictions() {
    this.isProgress = !this.isProgress;
    const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const ys = [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230];

    const xArray = [];
    const yArray = [];

    this.fullData.forEach(element => {
      xArray.push(this.daysIntoYear(element.date));
      yArray.push(element.cost);
    });

    this.fitModel(xArray, yArray);
    // this.fitModel(tf.tensor1d(xTrain), tf.tensor1d(yTrain), tf.tensor1d(xTest), tf.tensor1d(yTest));
  }

  showProgress() {
    return this.isProgress;
  }


  async fitModel(xArray, yArray) {

    // data prep
    const xTrain = [];
    const yTrain = [];
    const xTest = [];
    const yTest = [];

    // split test and train dataset to 20/80
    for (let i = 0; i < xArray.length; i++) {
      if (i % 5 === 0) {
        xTest.push(xArray[i]);
        yTest.push(yArray[i]);
      } else {
        xTrain.push(xArray[i]);
        yTrain.push(yArray[i]);
      }
    }

    console.log(xTrain, yTrain);

    const xTrainTensor = tf.tensor1d(xTrain);
    const yTrainTensor = tf.tensor1d(yTrain);
    const xTestTensor = tf.tensor1d(xTest);
    const yTestTensor = tf.tensor1d(yTest);

    // xTrainTensor.print();
    // yTrainTensor.print();
    // xTestTensor.print();
    // yTestTensor.print();

    const linearModel = tf.sequential();
    linearModel.add(tf.layers.dense({
      units: 1,
      inputShape: [1],
    }));

    linearModel.compile({
      loss: 'meanSquaredError',
      optimizer: 'adam',
      metrics: ['accuracy']
    });

    await linearModel.fit(xTrainTensor, yTrainTensor, {
      epochs: 2000,
      validationData: [xTestTensor, yTestTensor],
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          console.log('epoch ', epoch, 'loss ', logs.loss, ' val ', logs.val_loss);
          console.log('acc ', logs.acc, ' acc val ', logs.val_acc);
        },
      }
    });

    let xPred = [];
    xPred = xPred.concat(xArray);
    const todayDayNumber = this.daysIntoYear(new Date());

    for (let i = 0; i < 10; i++) {
      xPred.push(todayDayNumber + i);
    }

    const output = linearModel.predict(tf.tensor2d(xPred, [xPred.length, 1])) as any;
    const prediction = Array.from(output.dataSync());
    const predMap = new Map();
    for (let i = 0; i < xPred.length; i++) {
      predMap.set(xPred[i], prediction[i]);
    }
    console.log('pred ', predMap);
    this.predictionMap = predMap;
    this.drawLineChart();

    // return predMap;
  }

}
