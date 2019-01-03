import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  locationForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.locationForm = new FormGroup({
      'location-name': new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    console.log(this.locationForm.get('location-name').value);
  }

}
