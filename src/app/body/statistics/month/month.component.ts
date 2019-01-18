import { Component, OnInit,ViewChild  } from '@angular/core';
import { DataStorageService } from '../../../shared/data-storage.service';
import { FormGroup,FormControl } from '@angular/forms'; 


@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit {
  yearForm: FormGroup;
  @ViewChild('lineChart') private chartRef;
  chart: any;
  arrayAll:any[]=[];
 

  array=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    constructor(private dataStorageService:DataStorageService) { }
  
    ngOnInit() {
      this.yearForm = new FormGroup({
        'year': new FormControl(2018)});
        this.start();
      }
   start(){
  
      var rvAll=this.dataStorageService.getStatisticByMonth(this.yearForm.get('year').value);
      
      for(var i=0; i<this.array.length;++i){
     
        var numAll=rvAll.get(this.array[i]);
  
        this.arrayAll[i]=numAll;
      }
     this.randomize();
    }
    public randomize():void {
      let _lineChartData:Array<any> =  [
        {data: this.arrayAll, label: this.yearForm.get('year').value}
      ];
      
      this.lineChartData = _lineChartData;
    }
    public lineChartData:Array<any> = [
      {data: this.arrayAll, label: '2018'}
    ];
    public lineChartLabels:Array<any> = this.array;
    public lineChartOptions:any = {
      responsive: true,
      elements: {
        line: {
            tension: 0
        }
    },
      scales: {
        xAxes: [ {
         
          scaleLabel: {
            display: true,
            labelString: 'Months [d]'
          },
         
        } ],
        yAxes: [ {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Cnt'
          }
        } ]
      }
    
    };
    public lineChartColors:Array<any> = [
      { // grey
        backgroundColor: 'rgba(255,215,255,0)',
        borderColor: 'rgba(255,215,0,1)',
        pointBackgroundColor: 'rgba(255,215,0,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255,215,0,0.8)'
      }
    ];
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';
    
 
    
    // events
    public chartClicked(e:any):void {
      console.log(e);
    }
    
    public chartHovered(e:any):void {
      console.log(e);
    }
    
    }
