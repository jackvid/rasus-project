import { Http, Response } from "@angular/http";
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { RouteData } from "./route-data.model";
import { Coordinates } from "./coordinates.model";
import { Subject, Timestamp } from "rxjs";


@Injectable()
export class DataStorageService {
    filterData: RouteData[] = [];
    routesData: RouteData[] = []; 
    array: Coordinates[] = [];
    routeMap : Map<number, Coordinates[]> = new Map<number, Coordinates[]>();
    routeTime : Map<number, number[]> = new Map<number, number[]>();
    filterRoutesEvent = new Subject<RouteData[]>();
    
    constructor(private http: Http) {}

    getRoutes() {
        return this.http.get('http://161.53.19.87:8824/routes').pipe(
            map(
                (response: Response) => {
                    let data = [];
                    data = response.json();

                    for(let i in data) {
                        for(let j in data[i]) {
                            let route: RouteData = data[i][j];
                            this.routesData.push(route);
                        }
                    }
                    return this.routesData;
                }
            )
        );
    }

    filterRoutes(dateStart, dateEnd){
        var end=false;
        dateStart=new Date(dateStart);
        this.filterData = [];

        if(dateEnd!=null && dateEnd !=""){
            end = true;
            dateEnd = new Date(dateEnd).setHours(0,0,0,0);
        }
       
        for(let d in this.routesData){
            var date= new Date(this.routesData[d].timestamp);
            if(end == false){
                if(dateStart.toDateString() == date.toDateString()) {
                    this.filterData.push(this.routesData[d]);
                }
            } else {
                if((date.setHours(0,0,0,0) >= dateStart.setHours(0,0,0,0) && date.setHours(0,0,0,0)<=dateEnd)){
                    this.filterData.push(this.routesData[d]);
                }
            }
        }
       
        this.filterRoutesEvent.next(this.filterData);
    }

    mapRoutes(data){
        this.routeMap.clear();
        var tarray:number[]=[];

        for(let r in data){
                var lon=data[r].location.longitude;
                var la=data[r].location.latitude;
                var time:number;
                time=data[r].timestamp;
            if(!this.routeMap.has(data[r].routeId)){
                let coordinates = new Coordinates(lon, la);
                this.array.push(coordinates);
                this.routeMap.set(data[r].routeId, this.array);

                tarray=[time];
                this.routeTime.set(data[r].routeId, tarray);

            } else {
                this.array = this.routeMap.get(data[r].routeId);
                let coordinates = new Coordinates(lon, la);
                this.array.push(coordinates);
                this.routeMap.set(data[r].routeId, this.array);

                tarray=this.routeTime.get(data[r].routeId);
                tarray.push(time);
                this.routeTime.set(data[r].routeId, tarray);
            }
            this.array = [];
        }
        return this.routeMap;
    }

    getMapKeys(data){
        this.mapRoutes(data);
        var set:Set<number>= new Set<number>();
        this.routeMap.forEach((val, key) => { 
            set.add(key);
        });
        return set;
    }

    getStatisticByHour(dataCalc) {
     //   var  hourStatistic : Map<number, number> = new Map<number, number>();
        var  hourStat : Map<number,Map<number, number> > = new Map<number, Map<number, number>>();
         for(let data of dataCalc) {
             if(data.location.latitude > 45 && data.location.latitude < 46 && data.location.longitude > 15 && data.location.longitude < 17){
               console.log(data.routeId);
                if(hourStat.has(data.routeId)){
                    var hourStatistic=hourStat.get(data.routeId);
                    var date = new Date(data.timestamp);
                    var hour= date.getHours();
                    if(hourStatistic.has(hour)){
                      //  console.log(date.getHours()+ " ima   "+ hourStatistic.get(date.getHours()));
                        var numb= hourStatistic.get(date.getHours())+1;
                        hourStatistic.set(date.getHours(),numb);
                    }
                    else{
                        //console.log(date.getHours()+ " POSTAVI ");
                        hourStatistic.set(date.getHours(),1);
                    }
                    hourStat.set(data.routeId,hourStatistic);
                }
                else{
                    var hourStatistic=new  Map<number, number>();
                    var date = new Date(data.timestamp);
                    var hour= date.getHours();
                    if(hourStatistic.has(hour)){
                      //  console.log(date.getHours()+ " ima   "+ hourStatistic.get(date.getHours()));
                        var numb= hourStatistic.get(date.getHours())+1;
                        hourStatistic.set(date.getHours(),numb);
                    }
                    else{
                        //console.log(date.getHours()+ " POSTAVI ");
                        hourStatistic.set(date.getHours(),1);
                    }
                    hourStat.set(data.routeId,hourStatistic);
                }
            }
         }
    
       var length = 0;
       var  hourStatistic : Map<number, number> = new Map<number, number>();
       for(var i=0;i<24;++i){
           hourStatistic.set(i,0);
            hourStat.forEach(element => {
                if(element.has(i)){
                    var val= hourStatistic.get(i)+1;
                    hourStatistic.set(i,val);
                }


            });

       }
       for(var i=0;i<24;++i){
        length+=hourStatistic.get(i);
       }
   
       for(var i=0;i<24;++i){
        var val=(hourStatistic.get(i)/length);
        if(val!=0){
            val=val*100;
        }
        
         hourStatistic.set(i,Math.round(val * 100) / 100);
       }

    
       return hourStatistic;
     }
     
     getAllStatisticByHour() {
         return this.getStatisticByHour(this.routesData);
     }
     getFilteredStatisticByHour() {
        if(this.filterData.length==0){
            this.filterRoutes(new Date,null);
        }
        return this.getStatisticByHour(this.filterData);
    }

    getRouteDurations(routeid){
        var duration:String;
        this.routeTime.forEach((val, key)=>{
            if(key==routeid){
                var times=val;
                var date=new Date(times[0]);
                var end=new Date(times[times.length-1]);
                var interval=new Date(times[times.length-1]-times[0]);
                duration=(interval.getUTCHours()+":"+ interval.getUTCMinutes()+":"+interval.getUTCSeconds()).toString();
            }
        });
        return duration;
    }
    
}