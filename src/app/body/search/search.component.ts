import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataStorageService } from 'src/app/shared/data-storage.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  locationForm: FormGroup;
  dateStart: Date;
  dateEnd: Date;
  

  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit() {
    this.locationForm = new FormGroup({
      'location-name': new FormControl(null, Validators.required),
      'start': new FormControl("2019-01-01T00:00:00", Validators.required),
      'end': new FormControl(null, Validators.required)
    });
  }

  onSubmit() { }
 
  filterRoutes() {
    this.dataStorageService.filterRoutes(
      this.locationForm.get('start').value,
      this.locationForm.get('end').value);
  }
} 

