import { Component, OnInit } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer, LatLngBounds, Polyline, circle, LayerGroup, LatLng, Layer} from 'leaflet';
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

  summit = marker([45.81444, 15.97798], {
    icon: icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })
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
    layers: [this.streetMaps, this.summit, polyline([])],
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
      layers: [this.streetMaps, this.summit, polyline([])],
      zoom: 10,
      center: latLng([45.81444, 15.97798])
    };
    this.layersControl.overlays = {};
    

    this.routeMap = this.dataStorageService.mapRoutes(this.routesData);
    this.keys = this.dataStorageService.getMapKeys(this.routesData);
    console.log("2");

    var sverute:any[]=[];

    this.keys.forEach(values => {
      var array=this.routeMap.get(values);
      var ruta:any[]=[];
     
      for(let i in array){
        if(array[i].latitude > 45 && array[i].latitude < 46 && array[i].longitude > 15 && array[i].longitude < 17){
          var novi: number[]=[];
          novi.push(array[i].latitude, array[i].longitude);
          ruta.push(novi);

          sverute.push(novi);
        }
      }

      //dodavanje svake rute pojedinacno
      if( ruta.length > 0 ){
        var route = polyline(ruta);
         var br = values;
         var overlays = this.layersControl.overlays;
         overlays[br] = route;
         this.options.layers.push(route);
      }
      

      //sve rute u jednoj
      if(sverute.length > 0 ){
        var all=polyline(sverute);
        var alllays= this.layersControl.overlays;
        alllays["all"] = all;
        this.options.layers.push(all);
      }
    });
    console.log('3');
  }

  //inicijalizacija mape
  onMapReady(map: Map) {
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
