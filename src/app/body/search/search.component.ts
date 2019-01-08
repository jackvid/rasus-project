import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Response } from '@angular/http';
import { RouteData } from 'src/app/shared/route-data.model';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  locationForm: FormGroup;
  routesData: RouteData[]; 
  dateStart: Date;
  dateEnd: Date;
  

  constructor(private dataStorageService: DataStorageService) { 
    
  }

  ngOnInit() {
    this.locationForm = new FormGroup({
      'location-name': new FormControl(null, Validators.required),
      'start': new FormControl("2019-01-01T00:00:00", Validators.required),
      'end': new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    console.log(this.locationForm.get('location-name').value);
  }
 
  getRoutes() {
    
    this.dataStorageService.getRoutes().subscribe(
      (data: any[]) => {
       
        this.routesData = data;
       this.dataStorageService.filterRoutes(this.locationForm.get('start').value ,this.locationForm.get('end').value,this.routesData);
      }
    );
    
  }
 
} 

