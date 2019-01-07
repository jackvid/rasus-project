import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Response } from '@angular/http';
import { RouteData } from 'src/app/shared/route-data.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  locationForm: FormGroup;
  routesData: RouteData[]; 

  constructor(private dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.locationForm = new FormGroup({
      'location-name': new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    console.log(this.locationForm.get('location-name').value);
  }

  getRoutes() {
    this.dataStorageService.getRoutes().subscribe(
      (data: any[]) => {
        //console.log(data);
        this.routesData = data;
        //console.log(this.routesData[0].location.latitude);
      }
    );
  }

}
