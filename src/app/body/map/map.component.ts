import { Component, OnInit } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer, LatLngBounds } from 'leaflet'; //EXTRA
import { RouteData } from "../../shared/route-data.model";
import { DataStorageService } from 'src/app/shared/data-storage.service';


//declare var ol: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  routesData: RouteData[] = []; 
 
  map: Map;
  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit() {}
  
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

  showRoutes(){
    this.dataStorageService.getRoutes().subscribe(
    (data: any[]) => {
      this.routesData = data;
      
      this.showFilterRoutes(this.routesData);
    });
  }

   onMapReady(map: Map) {
    this.map=map;
    var lat=polyline([[45.81444, 15.97798]]);
    map.fitBounds(lat.getBounds(), {
      padding: point(24, 24),
      maxZoom: 12,
      animate: true
     });
     console.log("1");
     this.showRoutes();
  }

  showFilterRoutes(data){
    var routeMap : any;
    var keys:Set<number>=new Set<number>();
    routeMap= this.dataStorageService.mapRoutes(data);
    keys=this.dataStorageService.getMapKeys(data);
      console.log("2");
      // var array=this.routeMap.get(parseInt("33939750"));
      var brojac=0;
      keys.forEach(values => {

        var array=routeMap.get(values);
        var ruta:any[]=[];
        for(let i in array){
          if(array[i].latitude > 45 && array[i].latitude < 46 && array[i].longitude > 15 && array[i].longitude < 16){
            var novi: number[]=[];
            novi.push(array[i].latitude, array[i].longitude);
            ruta.push(novi);
            console.log(values + " " + brojac);
            console.log(array[i].latitude + " " + array[i].longitude);
          }
        }
        if( ruta.length >0 ){
          var route = polyline(ruta);
          var optionlays = this.options.layers;
          var br=values;
          var overlays = this.layersControl.overlays;
          overlays[br] = route;
          this.options.layers.push(route);
          brojac++;
        }
      });
      console.log(this.options.layers);
      console.log(this.layersControl.overlays);
  }
}



