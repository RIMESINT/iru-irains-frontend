import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";

@Injectable({
  providedIn: "root",
})
export class MCRMCsServiceState {
  private baseUrl: string = environment.baseUrl;

  private msRMCs: any = {

    "MC Ahmedabad": {
      url: [
        "assets/geojson/state/ST_GUJARAT.json",
        "assets/geojson/state/ST_DADRA_&_NAGAR_HAVELI_AND_DAMAN_&_DIU_(UT).json",
      ],      
      centre: [22.6708, 71.5724],
      zoomfactor: 7,
    },
    "MC Bengaluru": {
      url: "assets/geojson/state/ST_KARNATAKA.json",
      centre: [15.3173, 76.7139],
      zoomfactor: 7,
    },
    "MC Amaravati": {
      url: [
        "assets/geojson/state/ST_PUDUCHERRY_(UT).json",
        "assets/geojson/state/ST_ANDHRA_PRADESH.json",
      ],
      centre: [15.9129, 81.1000],
      zoomfactor: 6.3,
    },
    "MC Bhopal": {
      url: "assets/geojson/state/ST_MADHYA_PRADESH.json",
      centre: [23.5236, 78.414],
      zoomfactor: 6.7,
    },
    "MC Bhubaneswar": {
      url: "assets/geojson/state/ST_ODISHA.json",
      centre: [20.1342, 84.0167],
      zoomfactor: 7,
    },
    "MC Chandigarh": {
      url: [
        "assets/geojson/state/ST_CHANDIGARH_(UT).json",
        "assets/geojson/state/ST_PUNJAB.json",
      ],
      centre: [31.1, 75.451],
      zoomfactor: 7.7,
    },
    "MC Dehradun": {
      url: "assets/geojson/state/ST_UTTARAKHAND.json",
      centre: [30.4892, 78.9991],
      zoomfactor: 7.7,
    },
    "MC Hyderabad": {
      url: "assets/geojson/state/ST_TELANGANA.json",
      centre: [17.7759, 79.1238],
      zoomfactor: 7.4,
    },
    "MC Jaipur": {
      url: "assets/geojson/state/ST_RAJASTHAN.json",
      centre: [27.2389, 74.0243],
      zoomfactor: 6.6,
    },
    "MC Lucknow": {
      url: "assets/geojson/state/ST_UTTAR_PRADESH.json",
      centre: [27.3965, 80.125],
      zoomfactor: 6.6,
    },
    "MC Patna": {
      url: "assets/geojson/state/ST_BIHAR.json",
      centre: [25.612677, 85.458875],
      zoomfactor: 7.3,
    },
    "MC Raipur": {
      url: "assets/geojson/state/ST_CHHATTISGARH.json",
      centre: [21.25, 82.629997],
      zoomfactor: 7,
    },
    "MC Ranchi": {
      url: "assets/geojson/state/ST_JHARKHAND.json",
      centre: [23.844315, 85.296013],
      zoomfactor: 7,
    },
     "MC Shimla": {
      url: "assets/geojson/state/ST_HIMACHAL_PRADESH.json",
      centre: [32.1052, 77.1707],
      zoomfactor: 7.6,
    },
    "MC Srinagar": {
      url: [
        "assets/geojson/state/ST_JAMMU_&_KASHMIR_(UT).json",
        "assets/geojson/state/ST_LADAKH_(UT).json",
      ],
      centre: [34.7739, 76.1349],
      zoomfactor: 6.6,
    },
    "MC Thiruvanthapuram": {
      url: "assets/geojson/state/ST_KERALA.json",
      centre: [11.051, 76.0711],
      zoomfactor: 7.6,
    },
    "RMC Chennai": {
      url: "assets/geojson/state/ST_TAMILNADU.json",
      centre: [10.9601, 78.0766],
      zoomfactor: 7,
    },
    "RMC Guwahati": {
      url: [
        "assets/geojson/state/ST_ASSAM.json",
        "assets/geojson/state/ST_ARUNACHAL_PRADESH.json",
        "assets/geojson/state/ST_NAGALAND.json",
        "assets/geojson/state/ST_MANIPUR.json",
        "assets/geojson/state/ST_MIZORAM.json",
        "assets/geojson/state/ST_MEGHALAYA.json",
        "assets/geojson/state/ST_TRIPURA.json",       
      ],
      centre: [26.523, 93.4623],
      zoomfactor: 6.6,
    },
    "RMC Kolkata": {
      url: [
        "assets/geojson/state/ST_WEST_BENGAL.json",
        "assets/geojson/state/ST_ANDAMAN_&_NICOBAR_ISLANDS_(UT).json",
        "assets/geojson/state/ST_SIKKIM.json",
      ],
      centre: [17.9900, 89.1411],
      zoomfactor: 5.4,
    },
    "RMC Mumbai": {
      url: [
        "assets/geojson/state/ST_MAHARASHTRA.json",
        "assets/geojson/state/ST_GOA.json",
      ],
      centre: [19.0948, 76.748],
      zoomfactor: 6.3,
    },
    "RMC Nagpur": {
      url: "assets/geojson/state/ST_MAHARASHTRA.json",
      centre: [20.146633, 77.08886],
      zoomfactor: 6.6,
    },
    "RMC New Delhi": {
      url: "assets/geojson/state/ST_DELHI_(UT).json",
      centre: [28.7199, 77.1000],
      zoomfactor: 10,
    },
  };

  listOfmsRMCs: any = ["HYD", "BBN", "BNG"];

  constructor(private http: HttpClient) {}

  fetchMcRMcData(date: string): Observable<any> {
    let url = `${this.baseUrl}/api/v1/fetchStationData`;

    const body = {
      Date: date,
    };
    return this.http.post<any>(url, body);
  }

  getMcRMCsJson() {
    return this.msRMCs;
  }

  getListOfMcRMCs() {
    return Object.keys(this.msRMCs);
  }

  getCordinates(mcName: any) {
    return this.msRMCs[mcName].centre;
  }

  getZoomFactor(mcName: any) {
    return this.msRMCs[mcName].zoomfactor;
  }
}
