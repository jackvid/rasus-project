import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  arrayAll:any[]=[];
  arrayLabels:any[]=[];
  constructor(private dataStorageService:DataStorageService) { }

  ngOnInit() {
    var getData = this.dataStorageService.getLocationStatistic();
    for(let key of Array.from(getData.keys()) ) {
      this.arrayLabels.push(key);
      this.arrayAll.push(getData.get(key));

    }
  }

    // Pie
    public pieChartLabels:string[] = this.arrayLabels;
    public pieChartData:number[] = this.arrayAll;
    public pieChartType:string = 'pie';
   
    // events
    public chartClicked(e:any):void {
      console.log(e);
    }
   
    public chartHovered(e:any):void {
      console.log(e);
    }
}
