import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DayComponent } from './body/statistics/day/day.component';
import { HourComponent } from './body/statistics/hour/hour.component';
import { MonthComponent } from './body/statistics/month/month.component';
import { LocationComponent } from './body/statistics/location/location.component';

const appRoutes: Routes = [
    { path: 'day', component: DayComponent },
    { path: 'hour', component: HourComponent },
    { path: 'month', component: MonthComponent },
    { path: 'location', component: LocationComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}