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
    routeTime : Map<number, number[]> = new Map<number, number[]>();
    locationData: Map<string,RouteData[]> = new Map<string,RouteData[]>();
    filterRoutesEvent = new Subject<RouteData[]>();
    location: string;

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
                            if(route.location.latitude > 45 && route.location.latitude < 46 
                                && route.location.longitude > 15 && route.location.longitude < 17) {
                                this.routesData.push(route);
                            }
                        }
                    }
                    return this.routesData;
                }
            )
        );
    }

    filterRoutes(dateStart, dateEnd, location: string){
        var end = false;
        this.location = location;
        dateStart = new Date(dateStart);
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
    getLocation(){
        return this.location;
    }

    getStatisticByHour(dataCalc) {
        var  hourStat : Map<number,Map<number, number> > = new Map<number, Map<number, number>>();
         for(let data of dataCalc) {
            if(hourStat.has(data.routeId)){
                var hourStatistic=hourStat.get(data.routeId);
                var date = new Date(data.timestamp);
                var hour= date.getHours();
                if(hourStatistic.has(hour)){
                    var numb= hourStatistic.get(date.getHours())+1;
                    hourStatistic.set(date.getHours(),numb);
                } else {
                    hourStatistic.set(date.getHours(),1);
                }
                hourStat.set(data.routeId,hourStatistic);
            } else {
                var hourStatistic=new  Map<number, number>();
                var date = new Date(data.timestamp);
                var hour= date.getHours();
                if(hourStatistic.has(hour)){
                    var numb= hourStatistic.get(date.getHours())+1;
                    hourStatistic.set(date.getHours(),numb);
                } else {
                    hourStatistic.set(date.getHours(),1);
                }
                hourStat.set(data.routeId,hourStatistic);
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
            this.filterRoutes(new Date, null, 'center');
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
    
    getStatisticByWeek(isAllData:boolean){
        var dataCalc;
        if(isAllData==true){
            dataCalc=this.routesData;
        }else{
            if(this.filterData.length==0){
                this.filterRoutes(new Date, null, 'center');
            }
            dataCalc=this.filterData;
        }
        var  dayStat : Map<number,Map<number, number> > = new Map<number, Map<number, number>>();
        for(let data of dataCalc) {
            if(dayStat.has(data.routeId)){
                var daysStatistic=dayStat.get(data.routeId);
                var date = new Date(data.timestamp);
                var day= date.getDay();
                if (daysStatistic.has(day)) {
                    var numb= daysStatistic.get(date.getDay())+1;
                    daysStatistic.set(date.getDay(),numb);
                } else {
                    daysStatistic.set(date.getDay(),1);
                }
                dayStat.set(data.routeId,daysStatistic);
            } else {
                var daysStatistic=new  Map<number, number>();
                var date = new Date(data.timestamp);
                var day= date.getDay();
                if(daysStatistic.has(day)){
                    var numb=daysStatistic.get(date.getDay())+1;
                    daysStatistic.set(date.getDay(),numb);
                } else {
                    daysStatistic.set(date.getDay(),1);
                }
                dayStat.set(data.routeId,daysStatistic);
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
            if(date.getFullYear()==year) {
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
                } else {
                    var monthsStatistic=new  Map<number, number>();
                    var month= date.getMonth();

                    if(monthsStatistic.has(month)){
                        var numb=monthsStatistic.get(date.getMonth())+1;
                        monthsStatistic.set(date.getMonth(),numb);
                    } else {
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
        return monthStatistic;
    }

    getLocationStatistic(){
        for(let data of this.routesData){
            var rd:RouteData[] =[] ;
               if(data.location.latitude > 45.8411230784956) {
                    if(this.locationData.has("north")){
                    rd = this.locationData.get("north");
                    }
                    rd.push(data);
                    this.locationData.set("north",rd);
                    
                }else if(data.location.latitude < 45.78985947348451){
                    if(this.locationData.has("south")){
                        rd = this.locationData.get("south");
                    }
                    rd.push(data);
                    this.locationData.set("south",rd);

                }else if(data.location.longitude > 16.01303786312937){
                    if(this.locationData.has("east")){
                        rd = this.locationData.get("east");
                    }
                    rd.push(data);
                    this.locationData.set("east",rd);

                }else if( data.location.longitude < 15.935919697041015){
                    if(this.locationData.has("west")){
                        rd = this.locationData.get("west");
                    }
                    rd.push(data);
                    this.locationData.set("west",rd);
                }else if(data.location.latitude < 45.8411230784956 &&
                        data.location.latitude > 45.78985947348451 &&
                        data.location.longitude < 16.01303786312937 &&
                        data.location.longitude > 15.935919697041015){
                            if(this.locationData.has("center")){
                                rd = this.locationData.get("center");
                            }
                                rd.push(data);
                                this.locationData.set("center",rd);
                            }
             
         }
        
     
         var resultMap:Map<string,number> =new Map<string,number>();
       
         for(let key of Array.from(this.locationData.keys()) ) {
            var r=key;
            var x:RouteData[]= this.locationData.get(r);
            var map:Map<number,number> =new Map<number,number>();
            for(var d of x){
                if(!map.has(d.routeId)){
                    map.set(d.routeId,0);
                }
                var num = map.get(d.routeId)+1;
                map.set(d.routeId,num);
            }
            var cnt=0;
            map.forEach(element => {
                 cnt+=element;
              });
            resultMap.set(r,cnt);
         }
         return resultMap;
    }
}
