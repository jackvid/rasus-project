import { Component, OnInit } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer, LatLngBounds, Polyline, circle, layerGroup, LatLng, Layer} from 'leaflet';
import { RouteData } from "../../shared/route-data.model";
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { map } from 'rxjs/operators';
import { b } from '@angular/core/src/render3';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  routesData: RouteData[] = []; 
  routeMap : any;
  keys:Set<number>=new Set<number>();
  map:Map;
  sverute=layerGroup([]);
  routeLength={};

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
      iconUrl: 'leaflet/marker-icon-2x.png'
    })
  });
  
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    },
    overlays: 
      {
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
    var markers = layerGroup([]);
    this.sverute=layerGroup([]);

    //brisanje svih dodanih layera
    this.map.eachLayer(lay=>{
      if(lay!=this.streetMaps && lay!=this.wMaps && lay!=this.summit){
          this.map.removeLayer(lay);
      }
    });
    this.options = {
      layers: [this.streetMaps, this.summit,  polyline([])],
      zoom: 10,
      center: latLng([45.81444, 15.97798])
    };
    this.layersControl.overlays = {};

    this.routeMap = this.dataStorageService.mapRoutes(this.routesData);
    this.keys = this.dataStorageService.getMapKeys(this.routesData);
    console.log("2");

    var maxL=0;
    var najduza:any[]=[];
    var trajanje;

    this.keys.forEach(values => {
      var array=this.routeMap.get(values);
      var ruta:any[]=[];
     
      for(let i in array){
        if(array[i].latitude > 45 && array[i].latitude < 46 && array[i].longitude > 15 && array[i].longitude < 17){
          var novi: number[]=[];
          novi.push(array[i].latitude, array[i].longitude);
          ruta.push(novi);
        }
      }

      //dodavanje svake rute pojedinacno
      if( ruta.length > 0 ){
        var route = polyline(ruta, {color: 'blue'});
        this.sverute.addLayer(route);

        var routeMarker = marker(route.getCenter(), {
          icon: icon({
            iconSize: [ 20, 20 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'bike.jpg'
          })
        });
        var dist= Math.round(this.getLength(route));
        var dur=this.dataStorageService.getRouteDurations(values);
        routeMarker.bindPopup("Duljina rute:"+dist.toString()+"m"+" Trajaje rute(h:m:s):"+dur);
        markers.addLayer(routeMarker);
        if(dist>maxL){
          maxL=dist;
          najduza= ruta;
          trajanje=dur;
        }
      }
      if(marker.length>0){
        this.layersControl.overlays["Routes"]=this.sverute;
        this.map.addLayer(this.sverute);
        this.layersControl.overlays["Route lengths"]=markers;
        this.map.addLayer(markers);
      }
    
    });
    console.log('3');
    if(maxL>0){
      var longest=polyline(najduza, {color: 'red'});
      this.layersControl.overlays["Longest route"]=longest;
      longest.bindPopup("Duljina rute:"+maxL.toString()+"m Trajaje rute(h:m:s):"+trajanje);
      this.map.addLayer(longest);
    }
  }

  //inicijalizacija mape
  onMapReady(map: Map) {
    var lat=polyline([[45.81444, 15.97798]]);
    this.map=map;
    map.fitBounds(lat.getBounds(), {
      padding: point(24, 24),
      maxZoom: 12,
      animate: true
    });
  
    console.log("1");
    this.getRoutesData();
   
  }

  getLength(r:Polyline<any>){
    var  ll=r.getLatLngs();
    var dist:number=0;
    var previousPoint;
    var point;

    for(let i in ll){
      if(previousPoint){
        var latlng = latLng(previousPoint.lat, previousPoint.lng);
        point=ll[i];
        var latlngPoint = latLng(point.lat, point.lng);
        dist+=latlng.distanceTo(latlngPoint);
      }
      previousPoint=ll[i];
    }
    return dist;
  }
}
