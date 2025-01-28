import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class getRegionService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  fetchData(): Observable<any> {
    const url = `${this.baseUrl}/api/v1/getAllRegions`;
    return this.http.get<any>(url);
  }
}