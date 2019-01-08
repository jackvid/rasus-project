import { Component, OnInit } from '@angular/core';

declare var ol: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  latitude: number = 15.9786;
  longitude: number = 45.8130;

  map: any;

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    
    this.map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: {
          collapsible: false
        }
      }),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([15.9786, 45.8130]),
        zoom: 10
      })
    });
    
  }

}
