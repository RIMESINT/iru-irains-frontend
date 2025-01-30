import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})

export class DataEntryService {

  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }
  
  updateRainfallValue(body: any): Observable<any> {
    console.log(body,)
    let url = `${this.baseUrl}/api/v1/updateStationData`;
    console.log(body, url)
    return this.http.post<any>(url, body);
  }

  addNewStation(body:any){
    let url = `${this.baseUrl}/api/v1/addNewStation`;
    return this.http.post<any>(url, body);
  }
}