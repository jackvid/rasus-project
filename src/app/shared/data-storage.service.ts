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
        this.filterData = []
        
        if(dateEnd!=null){
            end = true;
            dateEnd = new Date(dateEnd);
        }
       
        for(let d in this.routesData){
            var date= new Date(this.routesData[d].timestamp);
            if(end == false){
                if(dateStart.toDateString() == date.toDateString()) {
                    this.filterData.push(this.routesData[d]);
                }
            } else {
                if((date >= dateStart && date<=dateEnd)){
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
}
