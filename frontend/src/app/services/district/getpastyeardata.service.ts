import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root',
})
export class RainfallDataService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Method to call the API
  getRainfallData(startDate: string, endDate: string, district_code: string): Observable<any> {
    const url = `${this.baseUrl}/api/v1/getLatestFiveYearDataOfDistrict`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      startDate,
      endDate,
      district_code,
    };
    console.log(body);

    return this.http.post<any>(url, body, { headers });
  }
}

