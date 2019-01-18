import { Component, OnInit } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer, Polyline, layerGroup, polygon } from 'leaflet';
import { RouteData } from "../../shared/route-data.model";
import { DataStorageService } from 'src/app/shared/data-storage.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  location:string;
  routesData: RouteData[] = []; 
  routeMap : any;
  keys:Set<number>=new Set<number>();
  map:Map;
  sverute=layerGroup([]);
  routeLength={};
  jug=[[
    latLng(45.759140108157524, 15.898590087890625),
    latLng(45.74812072727324, 15.921592712402344 ),
    latLng(45.751714242718776, 15.960044860839842 ),
    latLng(45.75387024093393,  15.992317199707031),
    latLng( 45.74620409110211,  16.038665771484375),
    latLng( 45.751953802189036, 16.074371337890625),
    latLng( 45.77015731325816, 16.097373962402344),
    latLng( 45.79242458189578, 16.124496459960938),
    latLng( 45.79673334862717,  16.016693115234375), //istok//
    latLng( 45.79673334862717, 15.952)//zapad//
   
  ]];
  sjever=[[
      latLng(45.874712248904764, 16.20655059814453),
      latLng(45.90267189624682, 16.178741455078125),
      latLng(45.930139885994556, 16.164665222167965),
      latLng(45.970481216767304, 16.135826110839844), 
      latLng(45.968572230031754, 16.121063232421875),
      latLng(45.961412943797235, 16.10973358154297),
      latLng(45.95854897023902, 16.09050750732422),
      latLng(45.91127203324223, 15.965538024902342),
      latLng(45.91963200013655, 15.950775146484375),
      latLng(45.92536382097964, 15.95043182373047),
      latLng(45.93252776429104, 15.938415527343748),
      latLng(45.922497984579934, 15.911293029785154),
      latLng(45.91533274588853, 15.826492309570312),
      latLng(45.91055540605009, 15.8148193359375),
      latLng(45.88737947387065,  15.81928253173828),
      latLng(45.87614641933891, 15.811386108398436),
      latLng(45.87112666088814, 15.781173706054688),
      latLng(45.86730177869193, 15.770874023437498),
      latLng(45.84649937512838, 15.765724182128906),
      latLng(45.84063982266045, 15.77430725097656),
      latLng(45.84099858850666, 15.809841156005858),
      latLng(45.83358362421937, 15.821685791015623),
      latLng(45.82293783536733,15.832672119140625), 
      latLng(45.83980269335617, 15.860137939453123), //odzap
      latLng(45.83238756970164, 15.872154235839842), //z
      latLng(45.83717163354584, 15.905113220214842), //z
      latLng(45.8149222464981, 15.9356689453125), //z
      latLng(45.8149222464981, 15.99678039550781),//istok
      latLng( 45.829516933984685,  16.057205200195312), //i
      latLng( 45.82688538784564, 16.087074279785156), //i
      latLng( 45.82856002251052, 16.102867126464844 ), //i
    ]];
  istok=[[
   // latLng(45.8149222464981, 15.99678039550781),
    latLng( 45.829516933984685,  16.057205200195312),
    latLng( 45.82688538784564, 16.087074279785156),
    latLng( 45.82856002251052, 16.102867126464844 ),
    latLng(45.874712248904764, 16.206893920898438 ),
    latLng(45.86216167877049,  16.219768524169922),
    latLng(45.849488704950616, 16.226634979248047),
    latLng( 45.83430124459186, 16.208782196044922 ),
    latLng(45.79027007360134,  16.1883544921875),
    latLng( 45.80798244671754,  16.13788604736328),
    latLng( 45.79242458189578,  16.122779846191406 ),
    latLng( 45.79673334862717,  16.016693115234375),
    latLng( 45.80941833830775,  16.003217697143555),
    latLng(45.8149222464981, 15.99678039550781)
  ]];
  zapad= [[
    latLng( 45.79673334862717, 15.952),//zapad-jug tocka//
    latLng(45.75890057953495, 15.898590087890625),
    latLng(45.801759822092585, 15.838165283203125),
    latLng(45.80965764997408, 15.84674835205078),
    latLng(45.82281820819514, 15.832328796386719),
    latLng(45.83980269335617, 15.860137939453123), //
    latLng(45.83238756970164, 15.872154235839842), //
    latLng(45.83717163354584, 15.905113220214842),
    latLng(45.8149222464981, 15.9356689453125) //
  ]];
  centar= [[
    latLng( 45.79673334862717,  16.016693115234375), //istok-jug//
    latLng( 45.79673334862717, 15.952),//zapad-jug//
    latLng(45.8149222464981, 15.9356689453125), //z-s
    latLng(45.8149222464981, 15.99678039550781)//istok-sjever strana
  ]];

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
    overlays: 
      {
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
    this.sverute=layerGroup([]);

    this.map.eachLayer(lay=>{
      if(lay!=this.streetMaps && lay!=this.wMaps){
          this.map.removeLayer(lay);
      }
    });
    this.options = {
      layers: [this.streetMaps, polyline([])],
      zoom: 10,
      center: latLng([45.81444, 15.97798])
    };
    this.layersControl.overlays = {};

    this.routeMap = this.dataStorageService.mapRoutes(this.routesData);
    this.keys = this.dataStorageService.getMapKeys(this.routesData);
    this.location=this.dataStorageService.getLocation();

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
      if( ruta.length > 0){
        var route = polyline(ruta, {color: 'blue'});
        var dist= Math.round(this.getLength(route));
        var dur=this.dataStorageService.getRouteDurations(values);
        route.bindPopup("Duljina rute:"+dist.toString()+"m"+" Trajaje rute(h:m:s):"+dur);
      if(this.location==undefined || this.location=="zagreb"){
        this.sverute.addLayer(route);
        if(dist>maxL){
          maxL=dist;
          najduza= ruta;
          trajanje=dur;
        }
       }else{
          if(this.checkArea(route)){
            this.sverute.addLayer(route);
            if(dist>maxL){
               maxL=dist;
              najduza= ruta;
              trajanje=dur;
            }
          }
       }
      }
      if(this.sverute){
        this.layersControl.overlays["Routes"]=this.sverute;
        this.map.addLayer(this.sverute);
      }
    
    });
    if(maxL>0){
      var longest=polyline(najduza, {color: 'red'});
      this.layersControl.overlays["Longest route"]=longest;
      longest.bindPopup("Duljina rute:"+maxL.toString()+"m Trajaje rute(h:m:s):"+trajanje);
      this.map.addLayer(longest);
      this.setArea();
    }
  }


  setArea(){
    var polS = polyline(this.sjever, {color: 'orange'});
    var polJ = polyline(this.jug, {color: 'orange'});
    var polI = polyline(this.istok, {color: 'orange'});
    var polZ = polyline(this.zapad, {color: 'orange'});  
    var polC = polyline(this.centar, {color: 'orange'});  
    
    var s = marker([45.88188273094796, 15.992660522460936],{
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'leaflet/marker-icon.png'})});
      var j = marker([45.767522962149876, 15.977210998535154],{
          icon: icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'leaflet/marker-icon.png'})});
      var z = marker([45.80343521248288, 15.88966369628906],{
              icon: icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'leaflet/marker-icon.png'})});
      var i= marker([45.816357959181374, 16.11007690429687], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'leaflet/marker-icon.png'})});

     var c= marker([45.80941833830775, 15.978240966796875], {
          icon: icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'leaflet/marker-icon.png'})});
      i.bindPopup("Zagreb-Istok");
      c.bindPopup("Zagreb-Centar");
      z.bindPopup("Zagreb-Zapad");
      j.bindPopup("Zagreb-Jug");
      s.bindPopup("Zagreb-Sjever");
    var areas=layerGroup([polS, polJ, polI, polC, polZ, s, j, i, c, z]);
    this.map.addLayer(areas);
    this.layersControl.overlays["Areas"]=areas;
  }

  checkArea(rut: Polyline<any>){
    switch(this.location) {
      case 'north': {
        if(polygon(this.sjever).getBounds().intersects(rut.getBounds())){
          return true;
        }else{
          return false;
        }
      }
      case 'south': {
        if(polygon(this.jug).getBounds().intersects(rut.getBounds())){
          return true;
        }else{
          return false;
        }
      }
      case 'east': {
        if(polygon(this.istok).getBounds().intersects(rut.getBounds())){
          return true;
        }else{
          return false;
        }
      }
      case 'west': {
        if(polygon(this.zapad).getBounds().intersects(rut.getBounds())){
          return true;
        }else{
          return false;
        }
      }
      case 'center': {
        if(polygon(this.centar).getBounds().intersects(rut.getBounds())){
          return true;
        }else{
          return false;
        }
      }
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
