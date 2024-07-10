import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchStationDataService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchStationData(date: string): Observable<any> {

    let url = `${this.baseUrl}/api/v1/fetchStationData`;

    const body = {
      Date: date
    };

    return this.http.post<any>(url, body);
  }

  addNewStation(body:any){
    let url = `${this.baseUrl}/api/v1/addNewStation`;
    return this.http.post<any>(url, body);    
  }

  editStation(body:any){
    let url = `${this.baseUrl}/api/v1/editStation`;
    return this.http.post<any>(url, body);
  }

  deleteStataion(body:any){
    let url = `${this.baseUrl}/api/v1/deleteStation`;
    return this.http.post<any>(url, body);
  }

  uploadStationDataFile(file: File) : Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/api/v1/insertMultipleStations', formData);
  }

  uploadRainfallDataFile(file: File) : Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/api/v1/insertRainfallFile', formData);
  }

  fetchInRangeStationdata(fromDate: string, toDate: string): Observable<any> {
    let url = `${this.baseUrl}/api/v1/fetchInRangeStationdata`;

    const body = {
       fromDate,
       toDate,
    };
    return this.http.post<any>(url, body);
  }

  fetchStationLogs(): Observable<any> {
    let url = `${this.baseUrl}/api/v1/fetchStationLogs`;

    return this.http.get<any>(url);
  }


  fetchAllDatesAndDataOfStation(body:any){
    let url = `${this.baseUrl}/api/v1/fetchAllDatesAndDataOfStation`;
    return this.http.post<any>(url, body);    
  }

}