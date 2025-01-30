import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment";

@Injectable({
  providedIn: "root",
})
export class MCRMCsService {
  private baseUrl: string = environment.baseUrl;

  private msRMCs: any = {

    "MC Ahmedabad": {
      url: "assets/geojson/MCRMCs/AHM.json",
      centre: [22.8252, 70.8491],
      zoomfactor: 15,
    },
    "MC Bengaluru": {
      url: "assets/geojson/MCRMCs/MC_BNG.json",
      centre: [15.4315, 75.6355],
      zoomfactor: 15,
    },
    "MC Amaravati": {
      url: "assets/geojson/MCRMCs/amv.json",
      centre: [16.9039, 80.4671],
      zoomfactor: 16,
    },
    "MC Bhopal": {
      url: "assets/geojson/MCRMCs/MC_BHP.json",
      centre: [23.5236, 78.414],
      zoomfactor: 17,
    },
    "MC Bhubaneswar": {
      url: "assets/geojson/MCRMCs/MC_BBN.json",
      centre: [20.1342, 84.0167],
      zoomfactor: 15,
    },
    "MC Chandigarh": {
      url: "assets/geojson/MCRMCs/MC_CHD.json",
      centre: [30.5132, 75.451],
      zoomfactor: 15,
    },
    "MC Dehradun": {
      url: "assets/geojson/MCRMCs/MC_DDN.json",
      centre: [30.5892, 79.6467],
      zoomfactor: 10,
    },
    "MC Hyderabad": {
      url: "assets/geojson/MCRMCs/MC_HYD.json",
      centre: [17.4459, 78.4738],
      zoomfactor: 10,
    },
    "MC Jaipur": {
      url: "assets/geojson/MCRMCs/MC_JPR.json",
      centre: [27.2389, 73.0243],
      zoomfactor: 19,
    },
    "MC Lucknow": {
      url: "assets/geojson/MCRMCs/MC_LKN.json",
      centre: [27.3965, 80.125],
      zoomfactor: 19,
    },
    "MC Patna": {
      url: "assets/geojson/MCRMCs/MC_PTN.json",
      centre: [25.612677, 85.458875],
      zoomfactor: 10,
    },
    "MC Raipur": {
      url: "assets/geojson/MCRMCs/MC_RPR.json",
      centre: [21.25, 81.629997],
      zoomfactor: 15,
    },
    "MC Ranchi": {
      url: "assets/geojson/MCRMCs/MC_RNC.json",
      centre: [23.844315, 85.296013],
      zoomfactor: 12,
    },
    "MC Shimla": {
      url: "assets/geojson/MCRMCs/MC_SML.json",
      centre: [32.1052, 77.1707],
      zoomfactor: 10,
    },
    "MC Srinagar": {
      url: "assets/geojson/MCRMCs/MC_SRN.json",
      centre: [34.7739, 76.1349],
      zoomfactor: 15,
    },
    "MC Thiruvanthapuram": {
      url: "assets/geojson/MCRMCs/MC_TRV.json",
      centre: [11.051, 74.0711],
      zoomfactor: 15,
    },
    "RMC Chennai": {
      url: "assets/geojson/MCRMCs/MC_CNI.json",
      centre: [10.9601, 78.0766],
      zoomfactor: 15,
    },
    "RMC Guwahati": {
      url: "assets/geojson/MCRMCs/MC_GHT.json",
      centre: [26.523, 93.4623],
      zoomfactor: 17,
    },
    "RMC Kolkata": {
      url: "assets/geojson/MCRMCs/MC_KOL.json",
      centre: [17.9900, 89.1411],
      zoomfactor: 35,
    },
    "RMC Mumbai": {
      url: "assets/geojson/MCRMCs/MC_MUM.json",
      centre: [19.0948, 74.748],
      zoomfactor: 15,
    },
    "RMC Nagpur": {
      url: "assets/geojson/MCRMCs/MC_NAG.json",
      centre: [20.146633, 78.08886],
      zoomfactor: 13,
    },
    "RMC New Delhi": {
      url: "assets/geojson/MCRMCs/RMC_DLH.json",
      centre: [28.5199, 77.1900],
      zoomfactor: 2,
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
