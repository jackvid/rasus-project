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
  

  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit() {
    this.locationForm = new FormGroup({
      'location': new FormControl('center'),
      'start': new FormControl("2018-09-15", Validators.required),
      'end': new FormControl(null, Validators.required)
    });
  }

  onSubmit() { }
 
  filterRoutes() {
    //console.log(this.locationForm.get('location').value);
    this.dataStorageService.filterRoutes(
      this.locationForm.get('start').value,
      this.locationForm.get('end').value,
      this.locationForm.get('location').value);
  }
} 

