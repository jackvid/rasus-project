import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';
import { MapComponent } from './body/map/map.component';
import { SearchComponent } from './body/search/search.component';
import { DataStorageService } from './shared/data-storage.service';
import { ChartsModule } from 'ng2-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppRoutingModule } from './app-routing.module';
import { HourComponent } from './body/statistics/hour/hour.component';
import { DayComponent } from './body/statistics/day/day.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    MapComponent,
    SearchComponent,
    HourComponent,
    DayComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    LeafletModule.forRoot(),
    AppRoutingModule,
    ChartsModule
  ],
  providers: [ DataStorageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
