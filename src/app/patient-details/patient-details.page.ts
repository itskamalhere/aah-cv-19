import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.page.html',
  styleUrls: ['./patient-details.page.scss'],
})
export class PatientDetailsPage implements OnInit {
  chartData: ChartDataSets[] = [{ data: [], label: 'Vitals' },{ data: [], label: 'Vitals' }];
  chartLabels: Label[];
  chartType = 'line';

  data = [{ value: 96, date: "1-1-2020" },
  { value: 96, date: "1-2-2020" },
  { value: 98, date: "1-3-2020" },
  { value: 92, date: "1-4-2020" },
  { value: 95, date: "1-5-2020" },
  { value: 99, date: "1-6-2020" }];
  data2 = [{ value: 99, date: "1-1-2020" },
  { value: 100, date: "1-2-2020" },
  { value: 198, date: "1-3-2020" },
  { value: 192, date: "1-4-2020" },
  { value: 195, date: "1-5-2020" },
  { value: 199, date: "1-6-2020" }];

  pulseRate = [{ value: 72, date: "1-1-2020" },
  { value: 62, date: "1-2-2020" },
  { value: 80, date: "1-3-2020" },
  { value: 90, date: "1-4-2020" },
  { value: 80, date: "1-5-2020" },
  { value: 72, date: "1-6-2020" }];

  modesList = ["Temperature", "Pulse Rate"];

  constructor(private route: ActivatedRoute) {
    this.setData(this.data);
    // this.route.queryParams.subscribe((user) => {
    //   this.user = user.value;
    //   console.log(user.value.age);
    // });    
  }

  setData(data: any) {
    this.chartData[0].data = [];
    this.chartData[1].data = [];
    this.chartLabels = [];
    for (let dataVal of data) {
      this.chartLabels.push(dataVal.date);
      this.chartData[0].data.push(dataVal.value);
    }
    for(let data2 of this.data2){
      this.chartData[1].data.push(data2.value);
    }
  }

  ngOnInit() {
  }

}