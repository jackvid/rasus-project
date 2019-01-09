import { Http, Response } from "@angular/http";
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { RouteData } from "./route-data.model";
import { Coordinates } from "./coordinates.model";

@Injectable()
export class DataStorageService {
    filterData: RouteData[] = []; 
    array: Coordinates[] = [];
    routeMap : Map<number, Coordinates[]> = new Map<number, Coordinates[]>();
    constructor(private http: Http) {}

    getRoutes() {
        return this.http.get('http://161.53.19.87:8824/routes').pipe(
            map(
                (response: Response) => {
                     let data = [];
                    data = response.json();
                    let routesData: RouteData[] = []; 

                    for(let i in data) {
                        for(let j in data[i]) {
                            let route: RouteData = data[i][j];
                            routesData.push(route);
                        }
                    }
                    //console.log(routesData);
                    return routesData;
                }
            )
        );
    }
   
    filterRoutes(dateStart, dateEnd,routesData){
        var end=false;
        
        
        dateStart=new Date(dateStart);
        if(dateEnd!=null){
          end=true;
          dateEnd=new Date(dateEnd);
        }
       
        for(let d in routesData){
          var date= new Date(routesData[d].timestamp);
          if(end==false){
           if(dateStart.toDateString()==date.toDateString()){
             //console.log(date);
              this.filterData.push(routesData[d]);
              }
            }
          else{
            if((date >= dateStart && date<=dateEnd)){
            // console.log(date);
              this.filterData.push(routesData[d]);
              }
    
          }
       
        }
        //this.mapRoutes(this.filterData);
    }

    mapRoutes(data){
        for(let r in data){
                var lon=data[r].location.longitude;
                var la=data[r].location.latitude;
            if(!this.routeMap.has(data[r].routeId)){
                let coordinates = new Coordinates(lon, la);
                this.array.push(coordinates);
               // console.log(data[r].routeId + " : DONEEE");
                this.routeMap.set(data[r].routeId, this.array);
            } else {
               // console.log('------Usao sam tu-------\n Route Id je: ' + data[r].routeId);
                this.array= this.routeMap.get(data[r].routeId);
                let coordinates = new Coordinates(lon, la);
                this.array.push(coordinates);
                this.routeMap.set(data[r].routeId, this.array);
            }
            this.array = [];
        }
        //console.log(this.routeMap)
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
}
