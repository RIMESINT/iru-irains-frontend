import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EMPTY, concatMap, filter } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DataService } from '../data.service';
@Component({
  selector: 'app-state-wise',
  templateUrl: './state-wise.component.html',
  styleUrls: ['./state-wise.component.css']
})
export class StateWiseComponent implements AfterViewInit {

  @Input() previousWeekWeeklyStartDate: string = '';
  @Input() previousWeekWeeklyEndDate: string = '';
  selectedDate: Date = new Date();
  selectedWeek: string = '';
  selectedYear: string = '';
  isDaily: boolean = false;
  private initialZoom = 5;
  private map: L.Map = {} as L.Map;
  currentDateNormal: string = '';
  currentDateDaily: string = '';
  currentDateNormaly: string = '';
  fetchedData: any;
  selectedStateName:string='INDIA_DISTRICT';
  fetchedMasterData: any;
  formatteddate: any;
  dd: any;
  today = new Date();
  months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  weeklyDates:any[]=[];

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router,
  ) {
    let localDailyDate:any = localStorage.getItem('dailyDate')
    if(localDailyDate){
      this.isDaily = true;
      let dailyDate = JSON.parse(localDailyDate);
      this.today.setDate(dailyDate.date)
      this.today.setMonth(dailyDate.month - 1)
      this.today.setFullYear(dailyDate.year)
    }
    let localWeekDates:any = localStorage.getItem('weekDates')
    if(localWeekDates){
      this.isDaily = false;
      let weeklyDates = JSON.parse(localWeekDates);
      this.previousWeekWeeklyStartDate = weeklyDates.previousWeekWeeklyStartDate;
      this.previousWeekWeeklyEndDate = weeklyDates.previousWeekWeeklyEndDate;
    }
    this.dateCalculation();
  }
  ngAfterViewInit(): void {
    this.initMap();
  }
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      location.reload();
    });
    this.fetchDataFromBackend();
  }

  oldDate:any
  dailyDeparture(){
    if(this.oldDate === this.selectedDate){
      this.onChangeState();
      return
    }
    if(this.oldDate !== new Date(this.selectedDate)){
      this.today = new Date(this.selectedDate);
      this.dateCalculation()
      this.fetchDataFromBackend();
      this.onChangeState();
      console.log("sadasdasd",this.oldDate ," sdf ",new Date(this.selectedDate))
      this.oldDate = this.selectedDate
    }
  }
  dateCalculation() {
    const yesterday = new Date(this.today);
    yesterday.setDate(this.today.getDate() - 1);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    this.dd = String(this.today.getDate());

    const mon = String(this.today.getMonth() + 1)
    const year = this.today.getFullYear();
    this.formatteddate = `${this.dd.padStart(2, '0')}-${mon.padStart(2, '0')}-${year}`
    const currmonth = this.months[this.today.getMonth()];
    const enddate = `${currmonth}${this.dd}`
    const ddy = String(yesterday.getDate());
    const currmonthy = this.months[yesterday.getMonth()];

    this.currentDateNormal = `${currmonth}${this.dd}`;
    this.currentDateNormaly = `${currmonthy}${ddy}`;
    const selectedYear = String(year).slice(-2);
    this.currentDateDaily = `${this.dd.padStart(2, '0')}_${currmonth}_${selectedYear}`;
    this.weeklyDates.push(this.currentDateDaily);
    console.log(this.currentDateDaily, "dateeeeee")
  }
  fetchDataFromBackend(): void {
    // console.log("===",this.fetchedData)
    this.dataService.fetchMasterFile().pipe(
      concatMap(masterData => {
        this.fetchedMasterData = masterData;
        this.stationtodistrict();
        return this.dataService.fetchData();
      }),
      concatMap(fetchedData => {
        this.fetchedData = fetchedData;
        this.processFetchedData();
        this.loadGeoJSON();
        return EMPTY; 
      }),
    ).subscribe(
      () => { },
      error => console.error('Error fetching data:', error)
    );
  }
  findMatchingData(id: string): any | null {
    const matchedData = this.districtdatacum.find((data: any) => data.districtID == id);
    if (matchedData) {
      return matchedData;
    }
    else {
      return null;
    }
  }


  stationtodistrictdata: any[] = [];
  districtnormals: any[] = [];
  districtdatacum: any[] = [];
  statefetchedDatadaily: any[] = [];
  statefetchedDatanormal: any[] = [];
  statefetchedDatadepcum: any[] = [];
  subdivisionfetchedDatadaily: any[] = [];
  subdivisionfetchedDatanormal: any[] = [];
  subdivisionfetchedDatadepcum: any[] = [];
  regionfetchedDatadaily: any[] = [];
  regionfetchedDatanormal: any[] = [];
  regionfetchedDatadepcum: any[] = [];
  countryfetchedDatadaily: any[] = [];
  countryfetchedDatanormal: any[] = [];
  countryfetchedDatadepcum: any[] = [];
  public countrydaily = 0

  stationtodistrict() {
    this.stationtodistrictdata = [];
    let previousdistrictid:any = null;
    let previousdistrictname = "";
    let districtarea:any = null;
    let stationrainfallsum = 0;
    let numberofstations = 0;
    let previousstateid:any = null;
    let previousstatename = "";
    let previoussubdivid:any = null;
    let previoussubdivname = "";
    let subdivweights:any = null;
    let previousregionid:any = null;
    let previousregionname = "";
    let districtcumdata = 0;
    let prevsubdivorder = 0;
    let prevstateorder = 0;
    let prevregionorder = 0;
    this.weeklyDates.forEach(wd => {
    for (const item of this.fetchedMasterData) {
      if (item.district_code == previousdistrictid || previousdistrictid == null) {
        if (item[wd] != -999.9) {
          stationrainfallsum = stationrainfallsum + item[wd];
          numberofstations = numberofstations + 1;
        }
        else {
          stationrainfallsum = stationrainfallsum + 0;
        }
      }
      else {
        this.stationtodistrictdata.push({
          districtid: previousdistrictid,
          districtname: previousdistrictname,
          districtarea: districtarea,
          subdivweights: subdivweights,
          numberofstations: numberofstations,
          stationrainfallsum: stationrainfallsum,
          dailyrainfall: stationrainfallsum / numberofstations,
          stateid: previousstateid,
          statename: previousstatename,
          stateorder : prevstateorder,
          subdivid: previoussubdivid,
          subdivname: previoussubdivname,
          subdivorder : prevsubdivorder,
          regionid: previousregionid,
          regionname: previousregionname,
          regionorder : prevregionorder,
          stationrainfallsumcum: districtcumdata,
          dailyrainfallcum: districtcumdata / numberofstations,
        });
        if (item[wd] != -999.9) {
          stationrainfallsum = item[wd];
          numberofstations = 1;
        }
        else {
          stationrainfallsum = 0;
          numberofstations = 0;
        }
      }
      previousdistrictid = item.district_code;
      previousdistrictname = item.district_name;
      districtarea = item.district_area
      previousstateid = item.state_code;
      previousstatename = item.state_name;
      previoussubdivid = item.subdiv_code;
      previoussubdivname = item.subdiv_name;
      subdivweights = item.subdiv_weights
      previousregionid = item.region_code;
      previousregionname = item.region_name;
      prevsubdivorder = item.subdivorder;
      prevregionorder = item.regionorder;
      prevstateorder = item.stateorder;
    }
    this.stationtodistrictdata.push({
      districtid: previousdistrictid,
      districtname: previousdistrictname,
      districtarea: districtarea,
      subdivweights: subdivweights,
      numberofstations: numberofstations,
      stationrainfallsum: stationrainfallsum,
      dailyrainfall: stationrainfallsum / numberofstations,
      stateid: previousstateid,
      statename: previousstatename,
      stateorder : prevstateorder,
      subdivid: previoussubdivid,
      subdivname: previoussubdivname,
      subdivorder : prevsubdivorder,
      regionid: previousregionid,
      regionname: previousregionname,
      regionorder : prevregionorder,
      stationrainfallsumcum: districtcumdata,
      dailyrainfallcum: districtcumdata / numberofstations,
    });
  })

    // Calculate total daily rainfall for each district
    const result = this.stationtodistrictdata.reduce((acc, current) => {
      const { districtid, dailyrainfall } = current;

      // If the districtid is already in the accumulator, add the dailyrainfall to the existing total
      if (acc[districtid]) {
        acc[districtid] += dailyrainfall;
      } else {
        // If the districtid is not in the accumulator, create a new entry
        acc[districtid] = dailyrainfall;
      }

      return acc;
    }, {});

    this.stationtodistrictdata.forEach((obj: any) => {
      if (result.hasOwnProperty(obj.districtid)) {
        obj.dailyrainfall = result[obj.districtid];
      }
    });
  }

  dailyRainFallCumulative() {
    const districtSumCount: any = {};
    this.fetchedMasterData.forEach((entry: any) => {
      const districtId = entry.district_code;
      const octValues = this.date();
      if (!districtSumCount[districtId]) {
        districtSumCount[districtId] = {};
        octValues.forEach(oct => districtSumCount[districtId][oct] = { sum: 0, count: 0 });
      }
      octValues.forEach(oct => {
        if (entry[oct] != undefined) {
          districtSumCount[districtId][oct].sum += entry[oct] == -999.9 ? 0 : entry[oct];
          entry[oct] == -999.9 ? districtSumCount[districtId][oct].count + 0 : districtSumCount[districtId][oct].count++;
        }
      });
    });

    // Calculate the average for each districtId and each Oct value
    const districtAverage: any = {};
    for (const districtId in districtSumCount) {
      districtAverage[districtId] = {};
      const octValues = this.date();
      octValues.forEach(oct => {
        districtAverage[districtId][oct] = districtSumCount[districtId][oct].sum == 0 ? 0 : districtSumCount[districtId][oct].sum / districtSumCount[districtId][oct].count;
      });
    }

    // Convert the result object into an array
    const resultArray = Object.entries(districtAverage).map(([districtId, averages]) => ({
      districtId,
      ...averages as {}
    }));
    // Calculate the total sum for each districtId and add the total value to the array
    const totalByDistrict: any = {};
    resultArray.forEach((entry: any) => {
      const districtId = entry.districtId;
      const octValues = this.date();

      if (!totalByDistrict[districtId]) {
        totalByDistrict[districtId] = { total: 0 };
      }

      octValues.forEach(oct => {
        totalByDistrict[districtId][oct] = (totalByDistrict[districtId][oct] || 0) + entry[oct];
        totalByDistrict[districtId].total += entry[oct];
      });
    });

    resultArray.forEach((entry: any) => {
      const districtId = entry.districtId;
      const totalValue = totalByDistrict[districtId].total;
      entry.total = totalValue;
    });
    return resultArray;
  }

  date() {
    let currentEndDay = this.previousWeekWeeklyEndDate ? new Date(this.previousWeekWeeklyEndDate).getDate() : this.today.getDate();
    let startMonth = this.previousWeekWeeklyEndDate ? this.months[new Date(this.previousWeekWeeklyEndDate).getMonth()] : this.months[this.today.getMonth()];
    let startDay = 1;
    let endDay = currentEndDay.toString().length == 1 ? 0 + currentEndDay : currentEndDay;
    let allDates = [];
    for (let day = startDay; day <= endDay; day++) {
      const year = this.today.getFullYear();
      const selectedYear = String(year).slice(-2);
      const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}_${selectedYear}`;
      allDates.push(currentDateStrdaily);
    }
    return allDates;
  }

  processFetchedData(): void {
    this.districtnormals = [];
    let districtcumnormal = 0;
    for (const item of this.fetchedData) {
      let normal1: number
      if (this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' || this.currentDateNormal === 'Jun1' || this.currentDateNormal === 'Oct1') {
        normal1 = item[this.currentDateNormal]
        if (normal1 == 0) {
          normal1 = 0.01
        }
      }
      else {
        normal1 = (item[this.currentDateNormal] - item[this.currentDateNormaly])
        if (normal1 == 0) {
          normal1 = 0.01
        }
      }
      districtcumnormal = item[this.currentDateNormal]
      this.districtnormals.push({
        districtID: item.district_code,
        normalrainfall: normal1,
        cummnormal: districtcumnormal
      });
    }
    this.mergedistrictdailyandnormal();
  }

  mergedistrictdailyandnormal(): void {
    this.districtdatacum = [];
    this.districtnormals.forEach((item1) => {
      const matchingItem = this.stationtodistrictdata.find((item2) => item1.districtID == item2.districtid);
      let matcheddailyrainfall = 0;
      let matcheddailyrainfallcum = 0;
      if (matchingItem) {
        if (matchingItem.dailyrainfall !== undefined && !Number.isNaN(matchingItem.dailyrainfall)) {
          matcheddailyrainfall = matchingItem.dailyrainfall;
        }
        if (matchingItem.dailyrainfallcum !== undefined && !Number.isNaN(matchingItem.dailyrainfallcum)) {
          matcheddailyrainfallcum = matchingItem.dailyrainfallcum;
        }
      }

      const dailydeparturerainfall = ((matcheddailyrainfall - item1.normalrainfall) / item1.normalrainfall) * 100;
           if(item1.normalrainfall == 0.01){
        //console.log(item1.normalrainfall, matchingItem.districtname,dailydeparturerainfall)
      }
      const cumdeparture = ((matcheddailyrainfallcum - item1.cummnormal) / item1.cummnormal) * 100
      if (matchingItem) {
        this.districtdatacum.push({ ...item1, ...matchingItem, dailydeparturerainfall, cumdeparture });
      } else {
        // console.log("data not found")
      }
    });

    var dailyRainFallCumulativeArray = this.dailyRainFallCumulative();
    var array2Map = dailyRainFallCumulativeArray.reduce((acc: any, obj: any) => {
      acc[obj.districtId] = obj.total;
      return acc;
    }, {});

    this.districtdatacum.forEach((obj: any) => {
      if (array2Map.hasOwnProperty(obj.districtid)) {
        let decimalPlaces = 1;
        let roundedNumber = Math.round(array2Map[obj.districtid] * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

        obj.dailyrainfallcum = roundedNumber;
        obj.cumdeparture = (Number(roundedNumber.toFixed(1)) - obj.cummnormal) / obj.cummnormal * 100;
      }
    });
  }

 

 



  private initMap(): void {
    this.map = L.map('map', {
      center: [24, 76.9629],
      zoom: this.initialZoom,
      scrollWheelZoom: false,
    });

    this.map.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map.setZoom(this.initialZoom+1);
      } else {
        this.map.setZoom(this.initialZoom);
      }
    });
    const fullscreenControl = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },
      content: '<i class="bi bi-arrows-fullscreen"></i>'
    });
    this.map.addControl(fullscreenControl);
  }
  private isFullscreen(): boolean {
    return !!(document.fullscreenElement || document.fullscreenElement ||
      document.fullscreenElement || document.fullscreenElement);
  }

  public month = this.months[this.today.getMonth()];
  public day = String(this.today.getDate()).padStart(2, '0');
  public sortedDataArray: any[] = [];
  public regions: any[] = [];
  public sortedSubDivisions: any[] = [];
  async pushDistrict(item: any, name: string) {
    if (item.statename == name) {
      this.sortedDataArray.push(item);
    }
  }

  async pushDistrict1(item: any, name: string) {
    if (item.subdivname == name) {
      this.sortedDataArray.push(item);
    }
  }

  async pushRegion(item: any, name: string) {
    if (item.regionname == name) {
      this.regions.push(item);
    }
  }

  async pushSubDivision(item: any, name: string) {
    if (item.subdivname == name) {
      this.sortedSubDivisions.push(item);
    }
  }

  currentStateLayer:any
  loadGeoJSON(): void {
      if (this.currentStateLayer) {
        this.map.removeLayer(this.currentStateLayer);
      }
    this.http.get(`assets/geojson/state/${this.selectedState}.json`).subscribe((res: any) => {
      const newStateLayer = L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);

          let rainfall: any;

          if(matchedData){

            if(Number.isNaN(matchedData.dailyrainfall)){
              rainfall = ' ';
            }
            else{
              rainfall = matchedData.dailydeparturerainfall;
            }

          }
          else{
            rainfall = -100
          }

          // const rainfall = matchedData ? matchedData.dailydeparturerainfall : -100;

          // const actual = matchedData && matchedData.dailyrainfall == 'NaN' ? ' ' : "notnull";
          const color = this.getColorForRainfall1(rainfall);
          return {
            fillColor: color,
            weight: 0.5,
            opacity: 2,
            color: 'black',
            fillOpacity: 2

          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const id1 = feature.properties['district'];
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);

          let rainfall: any;

          if(matchedData){

            if(Number.isNaN(matchedData.dailyrainfall)){
              rainfall = "NA";
            }
            else{
              rainfall = Math.round(matchedData.dailydeparturerainfall);
            }

          }
          else{
            rainfall = -100
          }



          //const rainfall = matchedData && matchedData.dailydeparturerainfall !== null && matchedData.dailydeparturerainfall !== undefined && !Number.isNaN(matchedData.dailydeparturerainfall) ? matchedData.dailydeparturerainfall.toFixed(2) : 'NA';
          const dailyrainfall = matchedData && matchedData.dailyrainfall !== null && matchedData.dailyrainfall != undefined && !Number.isNaN(matchedData.dailyrainfall) ? matchedData.dailyrainfall.toFixed(2) : 'NA';
          const normalrainfall = matchedData && !Number.isNaN(matchedData.normalrainfall) ? matchedData.normalrainfall.toFixed(2) : 'NA';
          const popupContent = `
            <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${dailyrainfall}</div>
              <div style="color: #002467; font-weight: bold; font-size: 10px;">NORMAL RAINFALL: ${normalrainfall}</div>
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DEPARTURE: ${rainfall}% </div>
            </div>
          `;
          layer.bindPopup(popupContent);
          layer.on('mouseover', () => {
            layer.openPopup();
          });
          layer.on('mouseout', () => {
            layer.closePopup();
          });
        }
      }).addTo(this.map);
      this.currentStateLayer = newStateLayer;
    });
  }

  getColorForRainfall1(rainfall: any): string {
    const numericId = rainfall;
    let cat = '';
    if (numericId == ' ') {
      return '#c0c0c0';
    }
    if (numericId > 60) {
      cat = 'LE';
      return '#0096ff';
    }
    if (numericId >= 20 && numericId <= 59) {
      cat = 'E';
      return '#32c0f8';
    }
    if (numericId >= -19 && numericId <= 19) {
      cat = 'N';
      return '#00cd5b';
    }
    if (numericId >= -59 && numericId <= -20) {
      cat = 'D';
      return '#ff2700';
    }
    if (numericId >= -99 && numericId <= -60) {
      cat = 'LD';
      return '#ffff20';
    }

    if (numericId == -100) {
      cat = 'NR';
      return '#ffffff';
    }

    else {
      cat = 'ND';
      return '#c0c0c0';
    }

  }

  getColorForRainfall(rainfall: any, actual?: string): string {
    const numericId = rainfall;
    let cat = '';
    if (actual == ' ') {
      return '#c0c0c0';
    }
    if (numericId >= 60) {
      cat = 'LE';
      return '#0096ff';
    }
    if (numericId >= 20 && numericId <= 59) {
      cat = 'E';
      return '#32c0f8';
    }
    if (numericId >= -19 && numericId <= 19) {
      cat = 'N';
      return '#00cd5b';
    }
    if (numericId >= -59 && numericId <= -20) {
      cat = 'D';
      return '#ff2700';
    }
    if (numericId >= -99 && numericId <= -60) {
      cat = 'LD';
      return '#ffff20';
    }
    if (numericId == -100) {
      cat = 'NR';
      return '#ffffff';
    }
    if (numericId == ' ') {
      return '#c0c0c0';
    }

    else {
      cat = 'ND';
      return '#c0c0c0';
    }

  }
  getCatForRainfall(rainfall: number, actual?: string): string {
    const numericId = rainfall;
    if (actual == ' ') {
      return 'ND';
    }
    if (numericId >= 60) {
      return 'LE';
    }
    if (numericId >= 20 && numericId <= 59) {
      return 'E';
    }
    if (numericId >= -19 && numericId <= 19) {
      return 'N';
    }
    if (numericId >= -59 && numericId <= -20) {
      return 'D';
    }
    if (numericId >= -99 && numericId <= -60) {
      return 'LD';
    }
    if (numericId == -100) {
      return 'NR';
    }
    else {
      return 'ND';
    }
  }

  filter = (node: HTMLElement) => {
    const exclusionClasses = ['download', 'downloadpdf', 'leaflet-control-zoom', 'leaflet-control-fullscreen', 'leaflet-control-zoomin'];
    return !exclusionClasses.some((classname) => node.classList?.contains(classname));
  }

  downloadMapImage(name: any): void {
    const element = document.getElementById('map') as HTMLElement;
    
    if (element) {
      const aspectRatio = element.offsetWidth / element.offsetHeight;
      const width = 1920; // For 1080p resolution
      const height = 1080;
      
      htmlToImage.toJpeg(element, { quality: 1.0, filter: this.filter, width: width, height: height })
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = `District Rainfall Map ${name}.jpeg`;
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          console.error('Failed to download image:', error);
        });
    } else {
      console.error('Element not found');
    }
  }
  

  StateList: { name: string, value: string, initZoom : number, lat:number , long:number }[] = [
    {name : 'ANDAMAN & NICOBAR', value : "ST_ANDAMAN_&_NICOBAR_ISLANDS_(UT)", initZoom:6, lat : 10.941450,long :92.878067 },
     {name : 'ANDHRA PRADESH' , value : "ST_ANDHRA_PRADESH", initZoom:6,  lat :15,long :82},
    {name : 'ARUNACHAL PRADESH' , value : "ST_ARUNACHAL_PRADESH", initZoom:7,lat :28,long :95.3},
    {name :   'ASSAM' , value : "ST_ASSAM", initZoom:7, lat :26,long :93},
    {name : 'BIHAR' , value : "ST_BIHAR", initZoom:7, lat :26,long :85},
    {name : 'CHANDIGARH' , value : "ST_CHANDIGARH_(UT)", initZoom:11,lat :30.7,long :76.8},
    {name : 'CHHATTISGARH' , value : "ST_CHHATTISGARH", initZoom:6, lat :21,long :83},
    {name : 'DADAR & NAGAR HAVELI' , value : "ST_DADRA_&_NAGAR_HAVELI_AND_DAMAN_&_DIU_(UT)", initZoom:8, lat :21.0,long :72},
    // // {name : 'DAMAN & DIU' , value : "ST_DELHI_(UT)", initZoom:6, center : [24,76]},
    {name : 'DELHI' , value : "ST_DELHI_(UT)", initZoom:9, lat :28.6,long :77.1},
    {name : 'GOA' , value : "ST_GOA", initZoom:9, lat :15.299326,long :74.12},
    {name : 'GUJARAT' , value : "ST_GUJARAT", initZoom:7, lat :22.2,long :71.12},
    {name : 'HARYANA' , value : "ST_HARYANA", initZoom:7, lat :29,long :76},
    {name : 'HIMACHAL PRADESH' , value : "ST_HIMACHAL_PRADESH", initZoom:7, lat :31.8,long :77.3},
    {name : 'JAMMU AND KASHMIR' , value : "ST_JAMMU_&_KASHMIR_(UT)", initZoom:7, lat :33.7,long :76.5},
    {name : 'JHARKHAND' , value : "ST_JHARKHAND", initZoom:7, lat :24,long :86},
    {name : 'KARNATAKA' , value : "ST_KARNATAKA", initZoom:6, lat :15.3,long :75.7},
    {
      name: 'KERALA',
      value: "ST_KERALA",
      initZoom: 6,
      lat: 10.8505,
      long: 76.2711
  },
  {
      name: 'LADAKH',
      value: "ST_LADAKH_(UT)",
      initZoom: 6,
      lat: 34.1526,
      long: 77.5771
  },
  {
      name: 'LAKSHADWEEP',
      value: "ST_LAKSHADWEEP_(UT)",
      initZoom: 7,
      lat: 10.328,
      long: 72.7847
  },
  {
      name: 'MADHYA PRADESH',
      value: "ST_MADHYA_PRADESH",
      initZoom: 6,
      lat: 22.9734,
      long: 78.6569
  },
  {
      name: 'MAHARASHTRA',
      value: "ST_MAHARASHTRA",
      initZoom: 6,
      lat: 19.7515,
      long: 75.7139
  },
  {
      name: 'MANIPUR',
      value: "ST_MANIPUR",
      initZoom: 7,
      lat: 24.6637,
      long: 93.9063
  },
  {
      name: 'MEGHALAYA',
      value: "ST_MEGHALAYA",
      initZoom: 7,
      lat: 25.467,
      long: 91.3662
  },
  {
      name: 'MIZORAM',
      value: "ST_MIZORAM",
      initZoom: 7,
      lat: 23.1645,
      long: 92.9376
  },
  {
      name: 'NAGALAND',
      value: "ST_NAGALAND",
      initZoom: 7,
      lat: 26.1584,
      long: 94.5624
  },
  {
      name: 'ODISHA',
      value: "ST_ODISHA",
      initZoom: 6,
      lat: 20.9517,
      long: 85.0985
  },
  {
      name: 'PONDICHERRY',
      value: "ST_PUDUCHERRY_(UT)",
      initZoom: 7,
      lat: 11.9416,
      long: 79.8083
  },
  {
      name: 'PUNJAB',
      value: "ST_PUNJAB",
      initZoom: 7,
      lat: 31.1471,
      long: 75.3412
  },
  {
      name: 'RAJASTHAN',
      value: "ST_RAJASTHAN",
      initZoom: 6,
      lat: 27.0238,
      long: 74.2179
  },
  {
      name: 'SIKKIM',
      value: "ST_SIKKIM",
      initZoom: 7,
      lat: 27.533,
      long: 88.5122
  },
  {
      name: 'TAMIL NADU',
      value: "ST_TAMILNADU",
      initZoom: 7,
      lat: 11.1271,
      long: 78.6569
  },
  {
      name: 'TELANGANA',
      value: "ST_TELANGANA",
      initZoom: 7,
      lat: 17.1232,
      long: 79.2088
  },
  {
      name: 'TRIPURA',
      value: "ST_TRIPURA",
      initZoom: 7,
      lat: 23.9408,
      long: 91.9882
  },
  {
      name: 'UTTARAKHAND',
      value: "ST_UTTAR_PRADESH",
      initZoom: 6,
      lat: 28.0668,
      long: 79.0193
  },
  {
      name: 'UTTAR PRADESH',
      value: "ST_UTTARAKHAND",
      initZoom: 7,
      lat: 30.8467,
      long: 80.9462
  },
  {
      name: 'WEST BENGAL',
      value: "ST_WEST_BENGAL",
      initZoom: 6,
      lat: 22.9868,
      long: 87.855
  }
];

selectedState:string='../INDIA_DISTRICT';

lat = 24;
long =77;
onChangeState() {
    // this.selectedState = event.target.value;
    const data = this.StateList.find((d)=>d.value === this.selectedState )
    // this.selectedState = event.target.value;
  
    this.selectedStateName = data?data.name:'';
  
    this.initialZoom =  data ? data.initZoom: this.initialZoom;
    this.lat =  data ? data.lat: this.lat;
    this.long =  data ? data.long: this.long;
    // this.map.setZoom(this.initialZoom)
    // this.initMap();
    this.map.setView([this.lat,this.long],this.initialZoom);
    this.loadGeoJSON();
 
    console.log('Selected value:', this.selectedState);
  }

}

