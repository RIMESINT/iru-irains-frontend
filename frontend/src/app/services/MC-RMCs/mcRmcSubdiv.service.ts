import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";

@Injectable({
  providedIn: "root",
})
export class MCRMCsServiceSubdiv {
  private baseUrl: string = environment.baseUrl;

  private msRMCs: any = {

    "MC Ahmedabad": {
      url: [
        "assets/geojson/subdivision/Gujrat_Region.json",
        "assets/geojson/subdivision/SD_Saurashtra_&_Kutch.json",
      ],      
      centre: [22.6708, 71.5724],
      zoomfactor: 7,
    },
    "MC Bengaluru": {
      url: [
        "assets/geojson/subdivision/SD_SOUTHERN_INTERIOR_KARNATAKA.json",
        "assets/geojson/subdivision/SD_COASTAL_KARNATAKA.json",   
      ],
      centre: [15.3173, 76.7139],
      zoomfactor: 7,
    },
    "MC Amaravati": {
      url: [
        "assets/geojson/subdivision/SD_RAYALSEEMA.json",
        "assets/geojson/subdivision/SD_COASTAL_ANDHRA_PRADESH_&_YANAM.json",
      ],
      centre: [15.9129, 81.1000],
      zoomfactor: 6.3,
    },
    "MC Bhopal": {
        url: [
            "assets/geojson/subdivision/East_Madhya_Pradesh.json",
            "assets/geojson/subdivision/SD_West_Madhya_Pradesh.json",
        ],
      centre: [23.5236, 78.414],
      zoomfactor: 6.7,
    },
    "MC Bhubaneswar": {
      url: "assets/geojson/subdivision/SD_Odishat.json",
      centre: [20.1342, 84.0167],
      zoomfactor: 7,
    },
    "MC Chandigarh": {
      url: [
        "assets/geojson/subdivision/ST_CHANDIGARH_(UT).json",
        "assets/geojson/subdivision/SD_PUNJAB.json",
      ],
      centre: [31.1, 75.451],
      zoomfactor: 7.7,
    },
    "MC Dehradun": {
      url: "assets/geojson/subdivision/SD_UTTARAKHAND.json",
      centre: [30.4892, 78.9991],
      zoomfactor: 7.7,
    },
    "MC Hyderabad": {
      url: "assets/geojson/subdivision/SD_TELANGANA.json",
      centre: [17.7759, 79.1238],
      zoomfactor: 7.4,
    },
    "MC Jaipur": {
        url: [
            "assets/geojson/subdivision/SD_WEST_RAJASTHAN.json",
        ],  
      centre: [27.2389, 74.0243],
      zoomfactor: 6.6,
    },
    "MC Lucknow": {
      url: [
        "assets/geojson/subdivision/East_Madhya_Pradesh.json",
        "assets/geojson/subdivision/SD_WEST_UTTAR_PRADESH.json",
       ],  
      centre: [27.3965, 80.125],
      zoomfactor: 6.6,
    },
    "MC Patna": {
      url: "assets/geojson/subdivision/SD_BIHAR.json",
      centre: [25.612677, 85.458875],
      zoomfactor: 7.3,
    },
    "MC Raipur": {
      url: "assets/geojson/subdivision/Chattisgarh.json",
      centre: [21.25, 82.629997],
      zoomfactor: 7,
    },
    "MC Ranchi": {
      url: "assets/geojson/subdivision/SD_JHARKHAND.json",
      centre: [23.844315, 85.296013],
      zoomfactor: 7,
    },
     "MC Shimla": {
      url: "assets/geojson/subdivision/SD_HIMACHAL_PRADESH.json",
      centre: [32.1052, 77.1707],
      zoomfactor: 7.6,
    },
    "MC Srinagar": {
      url: "assets/geojson/subdivision/SD_JAMMU_&_KASHMIR_AND_LADAKH.json",
      centre: [34.7739, 76.1349],
      zoomfactor: 6.6,
    },
    "MC Thiruvanthapuram": {
      url: "assets/geojson/subdivision/SD_KERALA_&_MAHE.json",
      centre: [11.051, 76.0711],
      zoomfactor: 7.6,
    },
    "RMC Chennai": {
      url: "assets/geojson/subdivision/SD_TAMILNADU,_PUDUCHERRY_&_KARAIKAL.json",
      centre: [10.9601, 78.0766],
      zoomfactor: 7,
    },
    "RMC Guwahati": {
      url: [
        "assets/geojson/subdivision/SD_ASSAM_&_MEGHALAYA.json",
        "assets/geojson/subdivision/SD_NMMT.json",
        "assets/geojson/subdivision/SD_Arunachal_Pradesh.json",     
      ],
      centre: [26.523, 93.4623],
      zoomfactor: 6.6,
    },
    "RMC Kolkata": {
      url: [
        "assets/geojson/subdivision/SD_GANGETIC_WEST_BENGAL.json",
        "assets/geojson/subdivision/SD_SHWB_&_SIKKIM.json",
        "assets/geojson/subdivision/SD_ANDAMAN_&_NICOBAR_ISLANDS.json",
      ],
      centre: [17.9900, 89.1411],
      zoomfactor: 5.4,
    },
    "RMC Mumbai": {
      url: [
        "assets/geojson/subdivision/SD_Madhya_Maharashtra.json",
        "assets/geojson/subdivision/SD_Marathwada.json",
        "assets/geojson/subdivision/SD_konkan_&_goa.json",
      ],
      centre: [19.0948, 76.748],
      zoomfactor: 6.3,
    },
    "RMC Nagpur": {
      url: "assets/geojson/subdivision/SD_Vidarbha.json",
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
