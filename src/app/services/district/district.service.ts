import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  fetchData(data:any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchDistrictData`;
    return this.http.post<any>(url, data);
  }

  fetchDataFtp(data:any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchDistrictDataFtp`;
    console.log('called fetchDataFtp');
    return this.http.post<any>(url, data);
  }
}
