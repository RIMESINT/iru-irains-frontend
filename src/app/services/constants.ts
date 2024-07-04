import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})

export class Constants {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private dataservice:DataService) {}

  getRangeFromDateRange(){

    let EndDate: any;
    let StartDate : any;
    
    this.dataservice.fromAndToDate$.subscribe((value) => {

      const currentDate = new Date();
      const dd = String(currentDate.getDate()).padStart(2, '0');
      const mon = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const year = String(currentDate.getFullYear());
      const formatteddate = `${dd}-${mon}-${year}`;

      if (value) {
        let fromAndToDates = JSON.parse(value);
        StartDate = fromAndToDates.fromDate;
        EndDate = fromAndToDates.toDate;
      }
      else {
        StartDate = `${year}-${mon}-${dd}`;
        EndDate = `${year}-${mon}-${dd}`;
      }

    });
    return {
      startDate : StartDate,
      endDate : EndDate
    }
  }

  getCurrentMonthSeasonFromAndTodate(date:any){
    const seasons = [
        { startMonth: 0, endMonth: 1 },    // Jan-Feb
        { startMonth: 2, endMonth: 4 },    // Mar-May
        { startMonth: 5, endMonth: 8 },    // Jun-Sep
        { startMonth: 9, endMonth: 11 }    // Oct-Dec
      ];
    
    const month = date.getMonth();
    
    const matchedSeason : any = seasons.find(season => month >= season.startMonth && month <= season.endMonth);
    
    const startDate = new Date(date.getFullYear(), matchedSeason.startMonth, 1);

    
    const dd = String(startDate.getDate()).padStart(2, '0');
    const mon = String(startDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = String(startDate.getFullYear());
    const formatteddate1 = `${year}-${mon}-${dd}`;

    const currdd = String(date.getDate()).padStart(2, '0');
    const currmon = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const curryear = String(date.getFullYear());
    const formatteddate2 = `${curryear}-${currmon}-${currdd}`;

    return {
        startDate: formatteddate1,
        endDate: formatteddate2
    };
  }
}