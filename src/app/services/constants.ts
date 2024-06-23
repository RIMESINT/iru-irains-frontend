import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})

export class Constants {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

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
    return {
        startDate: startDate,
        endDate: date
    };

  }


}