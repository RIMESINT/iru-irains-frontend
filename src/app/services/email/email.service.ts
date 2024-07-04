import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailLogService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  fetchData(): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchEmailLogs`;
    return this.http.get<any>(url);
  }

  createEmailGroups(data: any): Observable <any> {
    const url = `${this.baseUrl}/api/v1/createEmailGroups`;
    return this.http.post<any>(url, data);
  }

  fetchEmailGroups(): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchEmailGroups`;
    return this.http.get<any>(url);
  }

  sendEmail(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/sendEmail`;
    return this.http.post<any>(url, data);
  }

  deleteEmailGroup(groupId: number): Observable<any> {
    const url = `${this.baseUrl}/api/v1/deleteEmailGroup`;
    return this.http.post<any>(url, { groupId });
  }
  
  updateEmailGroups(data: any): Observable<any> {
    console.log('Updating email groups:', data);
    const url = `${this.baseUrl}/api/v1/updateEmailGroups`;
    return this.http.post<any>(url, data);
  }
  

}