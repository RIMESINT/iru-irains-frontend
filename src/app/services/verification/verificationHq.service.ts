import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class VerificationHq {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchStationData(date: string): Observable<any> {

    let url = `${this.baseUrl}/api/v1/fetchStationData`;
    const body = {
      Date: date
    };
    console.log(url, body)
    return this.http.post<any>(url, body);
  }

  verifyAll(body: any): Observable<any> {

    let url = `${this.baseUrl}/api/v1/verifyMultipleStationData`;

    console.log(url, body)
    return this.http.post<any>(url, body);
  }

}