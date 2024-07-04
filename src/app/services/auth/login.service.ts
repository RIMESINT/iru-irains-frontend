import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  userLogin(data:any): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/login", data);
  }
  
}