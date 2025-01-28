import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";

@Injectable({
  providedIn: "root",
})
export class MCRMCsServiceRegion {
  private baseUrl: string = environment.baseUrl;

  private msRMCs: any = {

    "MC Ahmedabad": {
      url: "assets/geojson/regions/C_India.json",
      centre: [22.6708, 77.5724],
      zoomfactor: 5.4,
    },
    "MC Bengaluru": {
      url: "assets/geojson/regions/SOUTH_PENINSULA.json",
      centre: [15.3173, 76.7139],
      zoomfactor: 5,
    },
    "MC Amaravati": {
      url: "assets/geojson/regions/SOUTH_PENINSULA.json",
      centre: [15.9129, 81.1000],
      zoomfactor: 5,
    },
    "MC Bhopal": {
      url: "assets/geojson/regions/C_India.json",
      centre: [22.6708, 77.5724],
      zoomfactor: 5.4,
    },
    "MC Bhubaneswar": {
      url: "assets/geojson/regions/C_India.json",
      centre: [22.6708, 77.5724],
      zoomfactor: 5.4,
    },
    "MC Chandigarh": {
       url: "assets/geojson/regions/NORTH_WEST_INDIA.json",
       centre: [32.1052, 77.1707],
       zoomfactor: 5.7,
    },
    "MC Dehradun": {
      url: "assets/geojson/regions/NORTH_WEST_INDIA.json",
      centre: [32.1052, 77.1707],
      zoomfactor: 5.7,
    },
    "MC Hyderabad": {
      url: "assets/geojson/regions/SOUTH_PENINSULA.json",
      centre: [17.7759, 79.1238],
      zoomfactor: 5,
    },
    "MC Jaipur": {
      url: "assets/geojson/regions/NORTH_WEST_INDIA.json",
      centre: [32.1052, 77.1707],
      zoomfactor: 5.7,
    },
    "MC Lucknow": {
      url: "assets/geojson/regions/NORTH_WEST_INDIA.json",
      centre: [32.1052, 77.1707],
      zoomfactor: 5.7,
    },
    "MC Patna": {
      url: "assets/geojson/regions/EAST_AND_NORTH_EAST_INDIA.json",
      centre: [26.523, 90.4623],
      zoomfactor: 6,
    },
    "MC Raipur": {
      url: "assets/geojson/regions/C_India.json",
      centre: [22.6708, 77.5724],
      zoomfactor: 5.4,
    },
    "MC Ranchi": {
      url: "assets/geojson/regions/EAST_AND_NORTH_EAST_INDIA.json",
      centre: [26.523, 90.4623],
      zoomfactor: 6,
    },
     "MC Shimla": {
      url: "assets/geojson/regions/NORTH_WEST_INDIA.json",
      centre: [32.1052, 77.1707],
      zoomfactor: 5.7,
    },
    "MC Srinagar": {
      url: "assets/geojson/regions/NORTH_WEST_INDIA.json",
      centre: [32.1052, 77.1707],
      zoomfactor: 5.7,
    },
    "MC Thiruvanthapuram": {
      url: "assets/geojson/regions/SOUTH_PENINSULA.json",
      centre: [11.051, 76.0711],
      zoomfactor: 5,
    },
    "RMC Chennai": {
      url: "assets/geojson/regions/SOUTH_PENINSULA.json",
      centre: [10.9601, 78.0766],
      zoomfactor: 5,
    },
    "RMC Guwahati": {
       url: "assets/geojson/regions/EAST_AND_NORTH_EAST_INDIA.json",
      centre: [26.523, 90.4623],
      zoomfactor: 6,
    },
    "RMC Kolkata": {
      url: [
        "assets/geojson/regions/SOUTH_PENINSULA.json",
        "assets/geojson/regions/EAST_AND_NORTH_EAST_INDIA.json",
      ],
      centre: [17.9900, 89.1411],
      zoomfactor: 4,
    },
    "RMC Mumbai": {
      url: "assets/geojson/regions/C_India.json",
      centre: [22.6708, 77.5724],
      zoomfactor: 5.4,
    },
    "RMC Nagpur": {
      url: "assets/geojson/regions/C_India.json",
      centre: [22.6708, 77.5724],
      zoomfactor: 5.4,
    },
    "RMC New Delhi": {
      url: "assets/geojson/regions/NORTH_WEST_INDIA.json",
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
