import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})


export class StateInformationService {

  private baseUrl: string = environment.baseUrl;

  private msRMCs : any  = {
    'ANDAMAN & NICOBAR ISLANDS (UT)': {
        url : 'assets/geojson/state/ST_ANDAMAN_&_NICOBAR_ISLANDS_(UT).json',
        centre : [11.623377, 92.726486],
        zoomfactor : 20   
    },
    'ANDHRA PRADESH': {
        url : 'assets/geojson/state/ST_ANDHRA_PRADESH.json',
        centre : [15.9129, 79.7400],
        zoomfactor : 20
    },
    'ARUNACHAL PRADESH': {
        url: 'assets/geojson/state/ST_ARUNACHAL_PRADESH.json',
        centre : [28.2180, 94.7278],
        zoomfactor : 15
    } ,
    'ASSAM': {
        url:'assets/geojson/state/ST_ASSAM.json',
        centre : [26.2006, 92.9376],
        zoomfactor : 15
    },
    'BIHAR': {
        url : 'assets/geojson/state/ST_BIHAR.json',
        centre : [25.9644, 85.2722],
        zoomfactor : 12
    },
    'CHANDIGARH (UT)': {
        url : 'assets/geojson/state/ST_CHANDIGARH_(UT).json',
        centre : [30.7333, 76.7794],
        zoomfactor : 0.5,
    }, 
    'CHHATTISGARH': {
        url : 'assets/geojson/state/ST_CHHATTISGARH.json',
        centre : [21.295132, 81.828232],
        zoomfactor : 15

    },
    'DADRA & NAGAR HAVELI AND DAMAN & DIU (UT)': {
        url : 'assets/geojson/state/ST_DADRA_&_NAGAR_HAVELI_AND_DAMAN_&_DIU_(UT).json',
        centre : [20.397373, 72.832802],
        zoomfactor : 10

    },
    'DELHI (UT)': {
        url : 'assets/geojson/state/ST_DELHI_(UT).json',
        centre : [28.7041, 77.1025],
        zoomfactor : 1.5

        
    },
    'GOA': {
        url : 'assets/geojson/state/ST_GOA.json',
        centre : [15.2993, 74.1240],
        zoomfactor : 3

    },
    'GUJARAT': {
        url : 'assets/geojson/state/ST_GUJARAT.json',
        centre : [22.6708, 71.5724],
        zoomfactor : 15

    }, 
    'HIMACHAL PRADESH': {
        url : 'assets/geojson/state/ST_HIMACHAL_PRADESH.json',
        centre : [32.1024, 77.5619],
        zoomfactor : 10

    },
    'JAMMU & KASHMIR (UT)': {
        url : 'assets/geojson/state/ST_JAMMU_&_KASHMIR_(UT).json',
        centre : [33.2778, 75.3412],
        zoomfactor : 12

    },
    'JHARKHAND': {
        url : 'assets/geojson/state/ST_JHARKHAND.json',
        centre : [23.6913, 85.2722],
        zoomfactor : 10

    },
    'KARNATAKA': {
        url : 'assets/geojson/state/ST_KARNATAKA.json',
        centre : [15.3173, 75.7139],
        zoomfactor : 15

    },
    'KERALA': {
        url : 'assets/geojson/state/ST_KERALA.json',
        centre : [10.1632, 76.6413],
        zoomfactor : 13
    },
    'LADAKH (UT)': {
        url : 'assets/geojson/state/ST_LADAKH_(UT).json',
        centre : [35.209515, 77.615112],
        zoomfactor : 20

    },
    'LAKSHADWEEP (UT)': {
        url : 'assets/geojson/state/ST_LAKSHADWEEP_(UT).json',
        centre : [10.3280,72.7846],
        zoomfactor : 15

    },
    'MADHYA PRADESH': {
        url : 'assets/geojson/state/ST_MADHYA_PRADESH.json',
        centre : [22.9734, 78.6569],
        zoomfactor : 20

    },
    'MAHARASHTRA': {
        url : 'assets/geojson/state/ST_MAHARASHTRA.json',
        centre : [19.7515, 75.7139],
        zoomfactor : 20

    },
    'MANIPUR': {
        url : 'assets/geojson/state/ST_MANIPUR.json',
        centre : [24.6637, 93.9063],
        zoomfactor : 5

    }, 
    'MEGHALAYA': {
        url : 'assets/geojson/state/ST_MEGHALAYA.json',
        centre : [25.4670, 91.3662],
        zoomfactor : 7
    },
    'MIZORAM': {
        url:  'assets/geojson/state/ST_MIZORAM.json',
        centre : [23.1645, 92.9376],
        zoomfactor : 7
    },
    'NAGALAND': {
        url:  'assets/geojson/state/ST_NAGALAND.json',
        centre : [26.1584, 94.5624],
        zoomfactor : 5
    },
    'ODISHA': {
        url:  'assets/geojson/state/ST_ODISHA.json',
        centre : [20.2376, 84.2700],
        zoomfactor : 15
    },
    'PUDUCHERRY (UT)': {
        url:  'assets/geojson/state/ST_PUDUCHERRY_(UT).json',
        centre : [10.9416, 79.8083],
        zoomfactor : 1
    },
    'PUNJAB': {
        url:  'assets/geojson/state/ST_PUNJAB.json',
        centre : [31.1471, 75.3412],
        zoomfactor : 10
    },
    'RAJASTHAN': {
        url:  'assets/geojson/state/ST_RAJASTHAN.json',
        centre : [27.0238, 74.2179],
        zoomfactor : 20
    },
    'SIKKIM': {
        url:  'assets/geojson/state/ST_SIKKIM.json',
        centre : [27.3516, 88.3239],
        zoomfactor : 4
    },
    'TAMILNADU': {
        url:  'assets/geojson/state/ST_TAMILNADU.json',
        centre : [11.1271, 78.6569],
        zoomfactor : 15
    },
    'TELANGANA': {
        url:  'assets/geojson/state/ST_TELANGANA.json',
        centre : [18.1124, 79.0193],
        zoomfactor : 15
    },
    'TRIPURA': {
        url:  'assets/geojson/state/ST_TRIPURA.json',
        centre : [23.5639, 91.6761],
        zoomfactor : 5
    },
    'UTTAR PRADESH': {
        url:  'assets/geojson/state/ST_UTTAR_PRADESH.json',
        centre : [27.5706, 80.0982],
        zoomfactor : 18
    },
    'UTTARAKHAND': {
        url:  'assets/geojson/state/ST_UTTARAKHAND.json',
        centre : [30.0668, 79.0193],
        zoomfactor : 10
    },
    'WEST BENGAL': {
        url:  'assets/geojson/state/ST_WEST_BENGAL.json',
        centre : [22.9868, 87.8550],
        zoomfactor : 17
    },
  };

  listOfmsRMCs : any = ['HYD', 'BBN', 'BNG']

  constructor(private http: HttpClient) { }

  fetchMcRMcData(date: string): Observable<any> {

    let url = `${this.baseUrl}/api/v1/fetchStationData`;

    const body = {
      Date: date
    };
    return this.http.post<any>(url, body);
  }

  getMcRMCsJson(){
    return this.msRMCs
  }

  getListOfMcRMCs(){
    return Object.keys(this.msRMCs)
  }

  getCordinates(mcName : any){
    return this.msRMCs[mcName].centre
  }

  getZoomFactor(mcName : any){
    return this.msRMCs[mcName].zoomfactor
  }
}