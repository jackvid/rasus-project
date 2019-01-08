import { Http, Response } from "@angular/http";
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { RouteData } from "./route-data.model";
import { Coordinates } from "./coordinates.model";

@Injectable()
export class DataStorageService {
    filterData: RouteData[] = []; 
    array: Coordinates[] = [];
    RouteMap : Map<number, Coordinates[]> = new Map<number, Coordinates[]>();
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
        this.mapRoutes();
    }
    mapRoutes(){

        for(let r in this.filterData){
        
            if(!this.RouteMap.has(this.filterData[r].routeId)){
               
                var lon=this.filterData[r].location.longitude;
                var la=this.filterData[r].location.latitude;
              
                /*const ru: Route ={long: lon, lat:la};
               
                array.push(ru);*/
                let coordinates = new Coordinates(lon, la);
                this.array.push(coordinates);
                console.log(this.array[0].longitude+ "DONEEE");
                this.RouteMap.set(this.filterData[r].routeId,this.array);
            }else{
                console.log('------USao sam tu-------');
                let array= this.RouteMap.get(this.filterData[r].routeId);
                var lon=this.filterData[r].location.longitude;
                var la=this.filterData[r].location.latitude;
                //const ru: Route ={long: lon, lat:la};
                let coordinates = new Coordinates(lon, la);
                array.push(coordinates);
                //array.push(ru);
                this.RouteMap.set(this.filterData[r].routeId,array);
            }

        }
       return this.RouteMap;

    }
}
