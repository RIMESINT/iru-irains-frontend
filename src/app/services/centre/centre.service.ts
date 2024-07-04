import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CenterService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  fetchData(centreType: string = 'MC'): Observable<any> {
    // const url = `${this.baseUrl}/api/v1/getCenterDetails`, { region_code: regionCode, centre_type: centreType });
    // return this.http.post<any>(url, data);
    // console.log('centerService', centreType)
    return this.http.post<any>(`${this.baseUrl}/api/v1/getCenterDetails`, { centre_type: centreType });
  }
}
