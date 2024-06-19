import { Component } from '@angular/core';
import { DataService } from '../data.service';
import * as L from 'leaflet';


@Component({
  selector: 'app-all-maps',
  templateUrl: './all-maps.component.html',
  styleUrls: ['./all-maps.component.css']
})
export class AllMapsComponent {
  previousWeekWeeklyStartDate: any;
  previousWeekWeeklyendDate: any;
  
 constructor(
    private dataService: DataService,

  ) {
    this.dataService.fromAndToDate$.subscribe((value) => {
      if (value) {
        let fromAndToDates = JSON.parse(value);
        this.previousWeekWeeklyStartDate = fromAndToDates.fromDate;
        // console.log(this.previousWeekWeeklyStartDate, 'previousWeekWeeklyStartDate');
        this.previousWeekWeeklyendDate = fromAndToDates.toDate;
        console.log(this.previousWeekWeeklyStartDate, this.previousWeekWeeklyendDate)
      }
    });

 }
}
