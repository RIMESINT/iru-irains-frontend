import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StateInfoService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getStateInformartion(){

    const StateInformation :any = {
        "ANDHRA PRADESH": { abbreviation: "AP", lat: 15.5, lng: 78 },
        "ARUNACHAL PRADESH": { abbreviation: "AR", lat: 29, lng: 94.2 },
        "ASSAM": { abbreviation: "AS", lat: 26.8, lng: 91.9 },
        "BIHAR": { abbreviation: "BR", lat: 26, lng: 85.3 },
        "CHHATTISGARH": { abbreviation: "CG", lat: 22, lng: 81 },
        "CHANDIGARH (UT)": { abbreviation: "CH", lat: 30.8, lng: 76 },
        "DADRA & NAGAR HAVELI AND DAMAN & DIU (UT)": { abbreviation: "DN", lat: 21.5, lng: 72 },
        "DELHI (UT)": { abbreviation: "DL", lat: 28.7, lng: 77.1 },
        "GOA": { abbreviation: "GA", lat: 16.5, lng: 72.7 },
        "GUJARAT": { abbreviation: "GJ", lat: 23.5, lng: 71 },
        "HARYANA": { abbreviation: "HR", lat: 29.5, lng: 75 },
        "HIMACHAL PRADESH": { abbreviation: "HP", lat: 32.7, lng: 76 },
        "JAMMU & KASHMIR (UT)": { abbreviation: "JK", lat: 34.5, lng: 73.2 },
        "JHARKHAND": { abbreviation: "JH", lat: 23.6, lng: 84 },
        "KARNATAKA": { abbreviation: "KA", lat: 15, lng: 74.7 },
        "KERALA": { abbreviation: "KL", lat: 10.5, lng: 75.5 },
        "LADAKH (UT)": { abbreviation: "LA", lat: 35.3, lng: 76 },
        "LAKSHADWEEP (UT)": { abbreviation: "LD", lat: 10.8, lng: 71.5 },
        "MADHYA PRADESH": { abbreviation: "MP", lat: 23.9, lng: 76.5 },
        "MAHARASHTRA": { abbreviation: "MH", lat: 19.5, lng: 74 },
        "MANIPUR": { abbreviation: "MN", lat: 24.5, lng: 92.9 },
        "MEGHALAYA": { abbreviation: "ML", lat: 25.7, lng: 90.5 },
        "MIZORAM": { abbreviation: "MZ", lat: 23.1, lng: 92.9 },
        "NAGALAND": { abbreviation: "NL", lat: 26.1, lng: 94.5 },
        "ODISHA": { abbreviation: "OD", lat: 20.8, lng: 83.3 },
        "PUDUCHERRY (UT)": { abbreviation: "PY", lat: 11.5, lng: 79.5 },
        "PUNJAB": { abbreviation: "PB", lat: 31.5, lng: 73.8 },
        "RAJASTHAN": { abbreviation: "RJ", lat: 27, lng: 72 },
        "SIKKIM": { abbreviation: "SK", lat: 28.5, lng: 88 },
        "TAMILNADU": { abbreviation: "TN", lat: 11.5, lng: 77.5 },
        "TELANGANA": { abbreviation: "TG", lat: 18, lng: 77.7 },
        "TRIPURA": { abbreviation: "TR", lat: 23.5, lng: 90.5 },
        "UTTAR PRADESH": { abbreviation: "UP", lat: 27.2, lng: 79.2 },
        "UTTARAKHAND": { abbreviation: "UT", lat: 30.2, lng: 78.5 },
        "WEST BENGAL": { abbreviation: "WB", lat: 23.7, lng: 86.8 },
        "ANDAMAN & NICOBAR ISLANDS (UT)": { abbreviation: "AN", lat: 9.8, lng: 91.7 }
    };

    return StateInformation
  }
}
