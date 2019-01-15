import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../../../shared/data-storage.service';


@Component({
  selector: 'app-hour',
  templateUrl: './hour.component.html',
  styleUrls: ['./hour.component.css']
})
export class HourComponent implements OnInit {
arrayAll:any[]=[];
arrayFiltered:any[]=[];
  constructor(private dataStorageService:DataStorageService) { }

  ngOnInit() {
    var rvFiltered=this.dataStorageService.getFilteredStatisticByHour();
    var rvAll=this.dataStorageService.getAllStatisticByHour();
    
    for(var i=0; i<24;++i){
      var num=rvFiltered.get(i);
      var numAll=rvAll.get(i);
      this.arrayFiltered[i]=num;
      this.arrayAll[i]=numAll;
    }
  }
// lineChart
public lineChartData:Array<any> = [
  {data: this.arrayFiltered, label: 'Filtered Data'},
  {data: this.arrayAll, label: 'All Data'}
];
public lineChartLabels:Array<any> = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00','07:00','08:00',
                                     '09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00',
                                    '19:00','20:00','21:00','22:00','23:00'];
public lineChartOptions:any = {
  responsive: true,
  scales: {
    xAxes: [ {
     
      scaleLabel: {
        display: true,
        labelString: 'Hours [h]'
      },
     
    } ],
    yAxes: [ {
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Percentage [%]'
      }
    } ]
  }

};
public lineChartColors:Array<any> = [
  { // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },
  { // dark grey
    backgroundColor: 'rgba(110,122,238,0.2)',
    borderColor: 'rgba(110,122,238,1)',
    pointBackgroundColor: 'rgba(110,122,238,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(110,122,238,1)'
  }
];
public lineChartLegend:boolean = true;
public lineChartType:string = 'line';

public randomize():void {
  let _lineChartData:Array<any> = new Array(this.lineChartData.length);
  for (let i = 0; i < this.lineChartData.length; i++) {
    _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
    for (let j = 0; j < this.lineChartData[i].data.length; j++) {
      _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
    }
  }
  this.lineChartData = _lineChartData;
}

// events
public chartClicked(e:any):void {
  console.log(e);
}

public chartHovered(e:any):void {
  console.log(e);
}

}
