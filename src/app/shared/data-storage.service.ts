import { Http, Response } from "@angular/http";
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { RouteData } from "./route-data.model";

@Injectable()
export class DataStorageService {

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
}