import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../../../shared/data-storage.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  arrayAll:any[]=[];
  arrayFiltered:any[]=[];
  array=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    constructor(private dataStorageService:DataStorageService) { }
  
    ngOnInit() {
      var rvFiltered=this.dataStorageService.getStatisticByWeek(false);
      var rvAll=this.dataStorageService.getStatisticByWeek(true);
      
      for(var i=0; i<this.array.length;++i){
        var num=rvFiltered.get(this.array[i]);
        var numAll=rvAll.get(this.array[i]);
        this.arrayFiltered[i]=num;
        this.arrayAll[i]=numAll;
      }
     
     
       
    }
  // lineChart
  public lineChartData:Array<any> = [
    {data: this.arrayFiltered, label: 'Filtered Data'},
    {data: this.arrayAll, label: 'All Data'}
  ];
  public lineChartLabels:Array<any> = this.array;
  public lineChartOptions:any = {
    responsive: true,
    scales: {
      xAxes: [ {
       
        scaleLabel: {
          display: true,
          labelString: 'Days [d]'
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
