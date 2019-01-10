import { Component, OnInit } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer, LatLngBounds } from 'leaflet'; //EXTRA
import { RouteData } from "../../shared/route-data.model";
import { DataStorageService } from 'src/app/shared/data-storage.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  routesData: RouteData[] = []; 
  routeMap : any;
  keys:Set<number>=new Set<number>();
  map: Map;
  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit() {
    this.dataStorageService.filterRoutesEvent.subscribe(
      (filteredRoutes: RouteData[]) => {
        this.routesData = filteredRoutes;
        this.showRoutes();
      }
    );
  }
  
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

   wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    },
    overlays: {
      //filteri
      //'Mt. Rainier Climb Route': route
    }
  };

  options = {
    layers: [this.streetMaps, polyline([])],
    zoom: 10,
    center: latLng([45.81444, 15.97798])
  };

  getRoutesData() {
    this.dataStorageService.getRoutes().subscribe(
      (data: any[]) => {
        this.routesData = data;
        this.showRoutes();
      }
    );
  }

  showRoutes() {
    this.options = {
      layers: [this.streetMaps, polyline([])],
      zoom: 10,
      center: latLng([45.81444, 15.97798])
    };
    this.layersControl.overlays = {};

    this.routeMap = this.dataStorageService.mapRoutes(this.routesData);
    this.keys = this.dataStorageService.getMapKeys(this.routesData);
    console.log("2");
    var brojac = 0;
    this.keys.forEach(values => {
      var array=this.routeMap.get(values);
      var ruta:any[]=[];
      for(let i in array){
        if(array[i].latitude > 45 && array[i].latitude < 46 && array[i].longitude > 15 && array[i].longitude < 16){
          var novi: number[]=[];
          novi.push(array[i].latitude, array[i].longitude);
          ruta.push(novi);
        }
      }
      if( ruta.length > 0 ){
        var route = polyline(ruta);
        var br = values;
        var overlays = this.layersControl.overlays;
        overlays[br] = route;
        this.options.layers.push(route);
        brojac++;
      }
    });
  }

  //inicijalizacija mape
  onMapReady(map: Map) {
    this.map=map;
    var lat=polyline([[45.81444, 15.97798]]);
    
    map.fitBounds(lat.getBounds(), {
      padding: point(24, 24),
      maxZoom: 12,
      animate: true
    });
    console.log("1");
    this.getRoutesData();
  }
}
