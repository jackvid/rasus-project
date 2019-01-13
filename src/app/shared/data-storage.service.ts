import { Http, Response } from "@angular/http";
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { RouteData } from "./route-data.model";
import { Coordinates } from "./coordinates.model";
import { Subject } from "rxjs";


@Injectable()
export class DataStorageService {
    filterData: RouteData[] = [];
    routesData: RouteData[] = []; 
    array: Coordinates[] = [];
    routeMap : Map<number, Coordinates[]> = new Map<number, Coordinates[]>();
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
        for(let r in data){
                var lon=data[r].location.longitude;
                var la=data[r].location.latitude;
            if(!this.routeMap.has(data[r].routeId)){
                let coordinates = new Coordinates(lon, la);
                this.array.push(coordinates);
                this.routeMap.set(data[r].routeId, this.array);
            } else {
                this.array = this.routeMap.get(data[r].routeId);
                let coordinates = new Coordinates(lon, la);
                this.array.push(coordinates);
                this.routeMap.set(data[r].routeId, this.array);
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

    getStatisticByWeek(isAllData:boolean){
        var dataCalc;
        if(isAllData==true){
            dataCalc=this.routesData;
        }else{
            if(this.filterData.length==0){
                this.filterRoutes(new Date,null);
            }
            dataCalc=this.filterData;
        }
        var  dayStat : Map<number,Map<number, number> > = new Map<number, Map<number, number>>();
        for(let data of dataCalc) {
            if(data.location.latitude > 45 && data.location.latitude < 46 && data.location.longitude > 15 && data.location.longitude < 17){
         
               if(dayStat.has(data.routeId)){
                   var daysStatistic=dayStat.get(data.routeId);
                   var date = new Date(data.timestamp);
                   var day= date.getDay();
                   if(daysStatistic.has(day)){
                       var numb= daysStatistic.get(date.getDay())+1;
                       daysStatistic.set(date.getDay(),numb);
                   }
                   else{
                    daysStatistic.set(date.getDay(),1);
                   }
                   dayStat.set(data.routeId,daysStatistic);
               }
               else{
                   var daysStatistic=new  Map<number, number>();
                   var date = new Date(data.timestamp);
                   var day= date.getDay();
                 
                   if(daysStatistic.has(day)){
                       var numb=daysStatistic.get(date.getDay())+1;
                       daysStatistic.set(date.getDay(),numb);
                   }
                   else{
                    daysStatistic.set(date.getDay(),1);
                   }
                   dayStat.set(data.routeId,daysStatistic);
               }
           }
        }
     
      var length = 0;
      var  dayStatistic: Map<string, number> = new Map<string, number>();
      var  dayStatisticSort: Map<string, number> = new Map<string, number>();
      let array=['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for(var i=0;i<array.length;++i){
           dayStatistic.set(array[i],0);
           dayStat.forEach(element => {
               if(element.has(i)){
                   var val= dayStatistic.get(array[i])+1;
                   dayStatistic.set(array[i],val);
               }


           });

      }
        array=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
      for(var i=0;i<array.length;++i){
       length+=dayStatistic.get(array[i]);
      }
  
      for(var i=0;i<array.length;++i){
       var val=(dayStatistic.get(array[i])/length);
       if(val!=0){
           val=val*100;
       }
       
       dayStatisticSort.set(array[i],Math.round(val * 100) / 100);
      }

      
      return dayStatisticSort;

    }
    getStatisticByMonth(year:number){
        var dataCalc=this.routesData;
       
        var  monStat : Map<number,Map<number, number> > = new Map<number, Map<number, number>>();
        for(let data of dataCalc) {
            var date = new Date(data.timestamp);
            if(data.location.latitude > 45 && data.location.latitude < 46 && data.location.longitude > 15 && data.location.longitude < 17 && date.getFullYear()==year){
         
               if(monStat.has(data.routeId)){
                   var monthsStatistic=monStat.get(data.routeId);
               
                   var month= date.getMonth();
                   if(monthsStatistic.has(month)){
                       var numb= monthsStatistic.get(date.getMonth())+1;
                       monthsStatistic.set(date.getMonth(),numb);
                   }
                   else{
                    monthsStatistic.set(date.getMonth(),1);
                   }
                   monStat.set(data.routeId,monthsStatistic);
               }
               else{
                   var monthsStatistic=new  Map<number, number>();
                   var month= date.getMonth();
                 
                   if(monthsStatistic.has(month)){
                       var numb=monthsStatistic.get(date.getMonth())+1;
                       monthsStatistic.set(date.getMonth(),numb);
                   }
                   else{
                    monthsStatistic.set(date.getMonth(),1);
                   }
                   monStat.set(data.routeId,monthsStatistic);
               }
           }
        }
     
      var length = 0;
      var  monthStatistic: Map<string, number> = new Map<string, number>();
  
      let array=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      for(var i=0;i<array.length;++i){
           monthStatistic.set(array[i],0);
           monStat.forEach(element => {
               if(element.has(i)){
                   var val= monthStatistic.get(array[i])+1;
                   monthStatistic.set(array[i],val);
               }


           });

      }
       
  
      console.log(monthStatistic);
      
      return monthStatistic;
    }
}
