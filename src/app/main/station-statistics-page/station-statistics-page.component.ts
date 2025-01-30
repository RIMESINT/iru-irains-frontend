import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-draw';
import { DatePipe } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { DataService

 } from 'src/app/data.service';
import { getRegionService } from 'src/app/services/region/getregion.service';
import { CenterService } from 'src/app/services/centre/centre.service';
import { getStateService } from 'src/app/services/state/getState.service';
import { getDistrictService } from 'src/app/services/district/getdistrict.service';
import { FetchStationDataService } from 'src/app/services/station/station.service';
import { EMPTY, concatMap, lastValueFrom, of, takeWhile } from 'rxjs';
import { defaultUrlMatcher } from '@angular/router';
import { Constants } from 'src/app/services/constants';
import { color } from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import FullScreen from 'highcharts/modules/full-screen';
// import { Radar } from 'leaflet-radar';

@Component({
  selector: "app-station-statistics-page",
  templateUrl: "./station-statistics-page.component.html",
  styleUrls: ["./station-statistics-page.component.css"],
})
export class StationStatisticsPageComponent implements OnInit, OnDestroy {
  // ------------------------------------------------------
  currDate: any = new Date();
  selectedRegion: any[] = [];
  currentUserType: any;
  loggedInUserObject: any;
  currentUserName: any;
  regions: any[] = []; // Array to hold region data fetched from API
  regionName: any;
  selectedMC: any;
  centersMC1: any[] = [];
  mcDisabled: boolean = false;
  rmcDisabled: boolean = false;
  selectedRMC: any;
  centersRMC1: any[] = [];
  selectedState: any;
  filterStates: any;
  filterDistrict: any;
  centersMC: any[] = [];
  centersRMC: any[] = [];
  selectedMCData: any[] = [];
  states: any[] = [];
  selectedStateData: any[] = [];
  districts: any[] = [];
  selectedDistrictData: any[] = [];
  isLoading: boolean = false;
  stationData: any; // Variable to hold the fetched data
  filteredStations: any[] = [];
  comparefilteredStations: any[] = [];
  selectedStation: any;
  comparingselectedStations: any;
  selectedDistrict: any;
  selectedstations: any[] = [];
  filteredData: any;
  isAwsSelected: boolean = true;
  isOrgSelected: boolean = true;
  isArgSelected: boolean = true;
  dayStatistics: any = {
    veryLightRainFallStations: {
      count: 0,
      isVeryLightRainFall: true,
    },
    lightRainfallStations: {
      count: 0,
      isLightRainfall: true,
    },
    modrateRainFallStations: {
      count: 0,
      isModrateRainFall: true,
    },
    heavyRainFallStations: {
      count: 0,
      isHeavyRainFall: true,
    },
    veryHeavyRainfallStations: {
      count: 0,
      isVeryHeavyRainfall: true,
    },
    extremelyHeavyRainfallStations: {
      count: 0,
      isExtremelyHeavyRainfall: true,
    },
  };
  maxStationRainfall: any = 0;
  minStationRainfall: any = 0;
  TotalStationsRecieved: any = 0;
  TotalStationsPending: any = 0;

  seriesDailyData: any[] = [];
  showSelectedStation: any = "";
  seriesHistoricalData: any[] = [];
  StationTotalEntries: any = "";
  StationsMissingEntries: any = "";
  StationHighestRecord: any = "";
  StationFirstDate: any = "";

  // ------------------------------------------------------
  toCompareStationCircleLayer: any;
  isloadingSurrondingStations: any = false;

  showStationDetails: boolean = false;
  showCompareData: boolean = false;
  showStatistics: boolean = false;
  showFirstMap: boolean = true;
  showSecondMap: boolean = false;
  stationType: any;
  selectedRMCData: any;
  markers: any[] = [];
  StationLowestRecord: any;
  showChart: boolean = true;

  stationWeatherParametersnew = [
    {
      text: "Daily Data",
    },
    // {
    //   text : 'Historical Data',
    // }
  ];

  stationWeatherParametersCompareChartsnew = [
    {
      text: "Daily Data",
    },
    // {
    //   text : 'Historical Data',
    // }
  ];

  showSelectedStationCode: any;
  DatabaseRecordedStartDate: any = "01-01-2024";
  maxSeasonalStationRainfall: any;
  minSeasonalStationRainfall: any;
  TotalStationsRecievedSeasonal: any;
  TotalStationsPendingSeasonal: any;
  maxSeasonalStationname: any;
  maxStationname: any;
  maxRecordedDataDateofSelectedStation: any;
  showSelectedStationObject: any;
  maxStationStatename: any;
  showSelectedState_name: any;
  currSeasonStartDate: any;
  currentSeasonEndDate: any;
  compareBUttonClickedForTestPuporse: any = false;
  selectedRadius: any = 50;

  compareCharts(): void {
    this.selectedOption = "compare_charts";
    // this.updateChart(this.stationWeatherParameters[0]);
    // this.updateChart(this.stationWeatherParameters[0]);
    this.toggleBottomNav();
    this.showCompareData = true;
  }

  viewStatistics(): void {
    this.showChart = false;
    this.selectedOption = "view_statistics";
    this.toggleBottomNav();
  }

  @ViewChild("timeMenuTrigger") trigger: MatMenuTrigger | undefined;
  selectedRegions: string[] = [];
  selectedStates: string[] = [];
  selectedMcs: string[] = [];
  tempfilteredStations: any[] = [];
  regionList: any[] = [];
  filteredMcs: any[] = [];
  filteredStates: any[] = [];
  // selectedRegion: string = '';
  // selectedState: string = '';
  filteredDistricts: any[] = [];
  totalstations: number = 0;
  notreceivedata: number = 0;
  receivedata: number = 0;
  pendingdata: number = 0;
  highestrecorded: number = 0;
  lowestrecorded: number = 0;

  loading = false;
  private stationObservationMap: any;
  type: any = "rainfall";
  countryList: any;
  levelList: any;
  sourceList: any;
  parameterList: any[] = [];
  categoryList: any;
  thresholdList: any[] = [];
  currentHeavyThreshold: any | null = null;
  currentExtremeThreshold: any | null = null;
  weatherDataList: any[] = [];
  displayedWeatherDataListColumns: string[] = ["date", "max", "avg", "min"];
  selectedLevel: any;
  shapeFilePath: any = "";
  selectedSource: any;
  parameterId: any = 1;
  alertCategoryId: any = 1;
  parameterName = "rf";
  selectedWeatherParameterDetails: any | null = null;
  form: FormGroup = new FormGroup({});

  admEn: any;
  admPcode: any;

  sources: any;
  levels: any;

  dataTypeSlider: boolean = false;

  zoom_level: any = 7;

  defaultDataSourceDetails!: any;
  defaultLevelDetails!: any;
  endTime: any;
  arrowRotation = 0;
  existingstationdata: any[] = [];

  chart: any;
  chartCompare: any;
  selectedOption: string = "station_details";
  selectedParameter: any;
  selectedCategory: any;
  selected_Date: any = this.formatDate(new Date());
  current_Date: any;
  manual_date_time: any;
  isSideNavOpen: boolean = true;
  isBottomNavOpen: boolean = false;
  selectedWeatherOption: string = "Temperature";

  selectedWeatherOptionForCompareCharts = "Tempartaure";
  // selectedWeatherData: any[] = this.stationWeatherParameters[0].data;
  mcdata = [
    { id: 101, name: "mc1" },
    { id: 101, name: "mc1" },
    { id: 101, name: "mc1" },
    { id: 101, name: "mc1" },
    { id: 101, name: "mc1" },
  ];
  startNumber: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dataService: DataService,
    private http: HttpClient,
    private regionService: getRegionService,
    private centerService: CenterService,
    private getStateService: getStateService,
    private getDistrictService: getDistrictService,
    private fetchStationDataService: FetchStationDataService,
    private constants: Constants
  ) {
    let loggedInUser: any = localStorage.getItem("isAuthorised");
    this.loggedInUserObject = JSON.parse(loggedInUser);
    this.currentUserType = this.loggedInUserObject.data[0].mcorhq;
    this.currentUserName = this.loggedInUserObject.data[0].name.replace(
      /^\S+\s/,
      ""
    );
  }

  Start() {
    const getCSSVal = (e: any, v: any) => e.style.getPropertyValue(v);
    const mod = (n: any, m: any) => ((n % m) + m) % m; // Fix negative Modulo
    const PI = Math.PI;
    const TAU = PI * 2;

    const radar = (elRadar: any) => {
      const elBeam = elRadar.querySelector(".beam");
      const elsDot = elRadar.querySelectorAll(".dot");

      const update = () => {
        const beamAngle =
          (parseFloat(getComputedStyle(elBeam).getPropertyValue("rotate")) *
            PI) /
            180 || 0;

        elsDot.forEach((elDot: any) => {
          const x = getCSSVal(elDot, "--x") - 0.5;
          const y = getCSSVal(elDot, "--y") - 0.5;
          const dotAngle = mod(Math.atan2(y, x), TAU);
          const opacity = mod(dotAngle - beamAngle, TAU) / TAU;
          elDot.style.opacity = opacity;
        });

        requestAnimationFrame(update);
      };

      update();
    };

    document.querySelectorAll(".radar").forEach(radar);
  }

  ngOnInit(): void {
    this.Start();
    this.form = this.formBuilder.group({
      level: [0, Validators.required],
      source: [0, Validators.required],
    });

    this.initStationObservationMap();
    this.getCurrentDate();
    this.loadGeoJSON();
    this.fetchStationData(this.selected_Date);
    this.fetchSeasonalStationData(this.selected_Date);
    this.fetchRegionData();
    this.getAllMCData();
    this.getAllRMCData();
    this.getAllStates();
    this.getAllDistricts();

    Exporting(Highcharts);
    FullScreen(Highcharts);
  }

  getCurrentDate() {
    const date = new Date();
    const curr_Date = this.datePipe.transform(date, "d MMM yyyy, h:mm a");
    if (curr_Date) {
      const [formattedDate, formattedTime]: string[] = curr_Date.split(", ");

      this.current_Date = {
        date: formattedDate,
        time: formattedTime,
      };
    }
  }

  onChangeRegion(checkedValues: any) {
    this.selectedRegions = checkedValues;
    let tempMcs = this.existingstationdata.filter((item) => {
      return checkedValues.some((value: any) => {
        return item.region == value;
      });
    });
    let tempfilteredMcs = Array.from(new Set(tempMcs.map((a) => a.rmc_mc)));
    this.filteredMcs = tempfilteredMcs.map((a) => {
      return { name: a };
    });
  }

  onChangeMc(checkedValues: any) {
    this.selectedMcs = checkedValues;
    let tempStates = this.existingstationdata.filter((item) => {
      return checkedValues.some((value: any) => {
        return item.rmc_mc == value;
      });
    });
    let tempfilteredStates = Array.from(
      new Set(tempStates.map((a) => a.state))
    );
    this.filteredStates = tempfilteredStates.map((a) => {
      return { name: a };
    });
  }

  onChangeState(checkedValues: any) {
    let tempDistricts = this.existingstationdata.filter((item) => {
      return checkedValues.some((value: any) => {
        return item.state == value;
      });
    });
    let tempfilteredDistricts = Array.from(
      new Set(tempDistricts.map((a) => a.district))
    );
    this.filteredDistricts = tempfilteredDistricts.map((a) => {
      return { name: a };
    });
    this.selectedDistrict = "";
  }

  onChangeDistrict(checkedValues: any) {
    let tempStations = this.existingstationdata.filter((item) => {
      return checkedValues.some((value: any) => {
        return item.district == value;
      });
    });
    let tempfilteredStations = Array.from(
      new Set(tempStations.map((a) => a.station))
    );
    this.filteredStations = tempfilteredStations.map((a) => {
      return { name: a };
    });

    this.selectedStation = "";
  }


  ngOnDestroy(): void {
    this.stationObservationMap.remove();
  }

  get formControls() {
    return this.form.controls;
  }

  shareCheckedList(item: any[]) {}
  shareIndividualCheckedList(item: any) {}


  updateMapAttribution(specialText: string) {
    const mapContainer = this.stationObservationMap.getContainer();

    // Find the existing attribution element within the container
    const existingAttributionElement = mapContainer.querySelector(
      ".leaflet-control-attribution"
    );

    if (existingAttributionElement) {
      // Append your custom text to the existing attribution element
      existingAttributionElement.innerHTML += ` | ${specialText}`;
    }
  }

  sourceChanged(sourceId: number) {
    this.selectedSource = this.sources.find((s: any) => s.id === sourceId);
  }

  alertCodeList: any = [];
  alertTypeList: any = [];

  currentAlertType: any = "rain";




  changeDate() {
    this.manual_date_time = this.formatDate(this.selected_Date);
  }

  changeTimeToggle(event: any) {
    this.dataTypeSlider = event.checked;

    if (!this.dataTypeSlider) {
    } else {
    }
  }

  confirmTimeDate(event: Event): void {
    if (this.trigger) {
      this.trigger.closeMenu();
    }
  }

  formatDate(date: any) {
    const dateObject = new Date(date);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;

    // const formattedDateString = this.datePipe.transform(
    //   dateObject,
    //   'dd MMM yyyy'
    // );

    // const formattedTimeString = this.datePipe.transform(dateObject, 'h:mm a');

    // return {
    //   date: formattedDateString,
    //   time: formattedTimeString,
    // };
  }

  preventButtonBehaviour(event: Event) {
    event.preventDefault();
  }

  selectParameter(parameterObj: any) {
    this.selectedParameter = parameterObj;
    this.selectCategory(parameterObj.categoryOptions[0].text);
  }

  selectCategory(category: String) {
    this.selectedCategory = category;
  }
  toggleBottomNav() {
    this.isBottomNavOpen = true;
  }
  dateCalculation() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let newDate = new Date(this.selected_Date);
    let dd = String(newDate.getDate());
    const year = newDate.getFullYear();
    const currmonth = months[newDate.getMonth()];
    const selectedYear = String(year).slice(-2);
    return `${dd.padStart(2, "0")}_${currmonth}_${selectedYear}`;
  }

  toggleMapDisplay(): void {
    this.showFirstMap = !this.showFirstMap;
    this.showSecondMap = !this.showSecondMap;
    if (this.showFirstMap) {
      // this.loadGeoJSON();
    } else {
      // this.loadGeoJSON1();
    }
  }

  findMatchingData(id: string): any | null {
    const matchedData = this.filteredStations.find(
      (data: any) => data.district_code == id
    );
    if (matchedData) {
      return matchedData;
    } else {
      return null;
    }
  }

  getColorForRainfall1(rainfall: any): string {
    const numericId = rainfall;
    let cat = "";
    if (numericId == " ") {
      return "#c0c0c0";
    }
    if (numericId > 60) {
      cat = "LE";
      return "#0096ff";
    }
    if (numericId >= 20 && numericId <= 59) {
      cat = "E";
      return "#32c0f8";
    }
    if (numericId >= -19 && numericId <= 19) {
      cat = "N";
      return "#00cd5b";
    }
    if (numericId >= -59 && numericId <= -20) {
      cat = "D";
      return "#ff2700";
    }
    if (numericId >= -99 && numericId <= -60) {
      cat = "LD";
      return "#ffff20";
    }

    if (numericId == -100) {
      cat = "NR";
      return "#ffffff";
    } else {
      cat = "ND";
      return "#c0c0c0";
    }
  }

  submitParameterForm() {
    // this.filterByDate();
    // const observationForm = {
    //   weatherParam: this.selectedParameter,
    //     ? this.manual_date_time.date
    //     : this.current_Date.date,
    //     ? this.manual_date_time.time
    //     : this.current_Date.time,
    // };
    this.toggleBottomNav();
    // this.loadGeoJSON();
    // this.updateChart(this.stationWeatherParameters[0]);
    // this.showMarkerOnMap();
  }

  // submitParameterForm() {
  //   // this.filterByDate();
  //   // const observationForm = {
  //   //   weatherParam: this.selectedParameter,
  //   //     ? this.manual_date_time.date
  //   //     : this.current_Date.date,
  //   //     ? this.manual_date_time.time
  //   //     : this.current_Date.time,
  //   // };
  //   this.toggleBottomNav();
  //   // this.loadGeoJSON();
  //   this.updateChart(this.stationWeatherParameters[0]);
  //   // this.showMarkerOnMap();
  // }

  closePopup() {
    this.isBottomNavOpen = false;
    this.showChart = true;

    if (this.compareCircle) {
      this.stationObservationMap.removeLayer(this.compareCircle);
    }
  }

  selectStationDataOption(option: string): void {
    this.selectedOption = option;
  }

  updateChart(weatherOptions: any) {
    if (this.selectedOption === "station_details") {
      var hoursArray;
      var valuesArray;

      hoursArray = weatherOptions.hourWisedata.map(
        (dataPoint: any) => dataPoint.hour
      );
      valuesArray = weatherOptions.hourWisedata.map(
        (dataPoint: any) => dataPoint.value
      );

      const unit = weatherOptions.data[0].unit;
      this.chart = new Chart({
        chart: {
          type: "line",
        },
        title: {
          text: "",
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: hoursArray,
        },
        yAxis: {
          title: {
            text: unit,
          },
        },
        series: [
          {
            type: "line",
            name: weatherOptions.text,
            data: valuesArray,
          },
        ],
      });

      // this.selectedWeatherData = weatherOptions.data;
    } else if (this.selectedOption === "compare_charts") {
      const hoursArray = weatherOptions.data.map(
        (dataPoint: any) => dataPoint.hour
      );
      const valuesArray = weatherOptions.data.map(
        (dataPoint: any) => dataPoint.value
      );
      const valuesArray1 = weatherOptions.data1.map(
        (dataPoint: any) => dataPoint.value
      );
      const unit = weatherOptions.data[0].unit;
      this.chart = new Chart({
        chart: {
          type: "line",
        },
        title: {
          text: "",
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: hoursArray,
        },
        yAxis: {
          title: {
            text: unit,
          },
        },
        series: [
          {
            type: "line",
            name: weatherOptions.text,
            data: valuesArray,
          },
          {
            type: "line",
            name: weatherOptions.text + " 1",
            data: valuesArray1,
          },
        ],
      });

      this.selectedWeatherOption = weatherOptions.text;
      // this.selectedWeatherData = weatherOptions.data;
    }
  }

  toggleDataParameter(param: string) {
    return param === this.selectedWeatherOption;
  }

  toggleDataParameterCompareCharts(param: string) {
    return param === this.selectedWeatherOptionForCompareCharts;
  }

  async fetchSeasonalStationData(date: any) {
    const fromAndTodate =
      this.constants.getCurrentMonthSeasonFromAndToCurrentDate(new Date(date));

    (this.currSeasonStartDate = fromAndTodate.startDate),
      (this.currentSeasonEndDate = fromAndTodate.endDate),
      console.log("dhvsuhdvh", fromAndTodate);

    const param = {
      fromDate: fromAndTodate.startDate,
      toDate: fromAndTodate.endDate,
    };

    try {
      const response = await this.fetchStationDataService
        .fetchInRangeStationdata(fromAndTodate.startDate, fromAndTodate.endDate)
        .toPromise();
      const fetchedData = response.data;

      const initialResult = {
        maxStation: fetchedData[0],
        minStation: fetchedData[0],
        validCount: 0,
        invalidCount: 0,
      };

      const result = fetchedData.reduce((acc: any, station: any) => {
        if (station.data !== -999.9 && station.data !== 0) {
          if (!acc.maxStation || station.data > acc.maxStation.data) {
            acc.maxStation = station;
          }
          if (!acc.minStation || station.data < acc.minStation.data) {
            acc.minStation = station;
          }
          acc.validCount++;
        } else {
          acc.invalidCount++;
        }
        return acc;
      }, initialResult);

      this.maxSeasonalStationRainfall =
        result.maxStation.data == -999.9
          ? "No Data"
          : result.maxStation.data.toFixed(1) + "mm";
      this.maxSeasonalStationname = result.maxStation.station_name;
      this.minSeasonalStationRainfall =
        result.minStation.data == -999.9
          ? "No Data"
          : result.minStation.data + "mm";
      this.TotalStationsRecievedSeasonal = result.validCount;
      this.TotalStationsPendingSeasonal = result.invalidCount;
    } catch (e) {
      console.log(e);
    }
  }

  fetchStationData(date: any): void {
    this.isLoading = true;
    try{
      this.fetchStationDataService.fetchStationDataTemp(date ?? "").subscribe(
        (response: any) => {
          this.stationData = response?.data;
          const initialResult = {
            maxStation: this.stationData[0],
            minStation: this.stationData[0],
            validCount: 0,
            invalidCount: 0,
          };
          const result = this.stationData.reduce((acc: any, station: any) => {
            if (station.data !== -999.9 && station.data !== 0) {
              if (!acc.maxStation || station.data > acc.maxStation.data) {
                acc.maxStation = station;
              }
              if (!acc.minStation || station.data < acc.minStation.data) {
                acc.minStation = station;
              }
              acc.validCount++;
            } else {
              acc.invalidCount++;
            }
            return acc;
          }, initialResult);
  
          this.maxStationRainfall =
            result.maxStation.data == -999.9
              ? "No Data"
              : result.maxStation.data + "mm";
          this.maxStationname = result.maxStation.station_name;
          this.maxStationStatename = result.maxStation.state_name;
          this.minStationRainfall =
            result.minStation.data == -999.9
              ? "No Data"
              : result.minStation.data + "mm";
          this.TotalStationsRecieved = result.validCount;
          this.TotalStationsPending = result.invalidCount;
  
          //--------------------------------------------------------------
  
          this.comparefilteredStations = this.stationData;
  
          this.filteredData = this.stationData;
  
          this.getDayStatistics();
          this.loadStations();
          this.isLoading = false;
        },
        (error: any) => {
          this.isLoading = false;
          alert('Data not found for the selected date')
          console.error("Error fetching data:", error);
        }
      );
    }catch{
    }

  }

  fetchRegionData() {
    this.regionService.fetchData().subscribe(
      (response) => {
        if (response && response.data) {
          this.regions = response.data.map((region: any) => ({
            label: region.region_name,
            value: region.region_code,
          }));
        } else {
          console.error("Unexpected response format:", response);
          alert("Data is not coming in the expected format");
        }
      },
      (error) => {
        console.error("Error fetching region data:", error);
        alert("Data is not available for today");
      }
    );
  }

  getAllMCData(): void {
    this.centerService.fetchData("MC").subscribe(
      (response) => {
        this.centersMC.push(response.data);
      },
      (error) => {
        console.error("Error fetching center details:", error);
      }
    );
  }

  // RMC Data
  getAllRMCData(): void {
    this.centerService.fetchData("RMC").subscribe(
      (response) => {
        this.centersRMC.push(response.data);
      },
      (error) => {
        console.error("Error fetching center details:", error);
      }
    );
  }

  // Get all States
  getAllStates(): void {
    this.getStateService.fetchData().subscribe(
      (response) => {
        this.states.push(response);
      },
      (error) => {
        console.error("Error fetching center details:", error);
      }
    );
  }

  getAllDistricts(): void {
    this.getDistrictService.fetchData().subscribe(
      (response) => {
        this.districts.push(response);
      },
      (error) => {
        console.error("Error fetching center details:", error);
      }
    );
  }

  // getAllStations() : void{

  // }

  onRegionChange(): void {
    if (this.selectedRegion && this.selectedRegion.length > 0) {
      const filteredCenters = this.centersMC[0]?.filter((center: any) =>
        this.selectedRegion.includes(center.region_code)
      );

      this.centersMC.push(filteredCenters);

      let lenOfCenterMC = this.centersMC.length;
      this.centersMC1 = this.centersMC[lenOfCenterMC - 1];

      // <- RMC ->
      const filteredCentersRMC = this.centersRMC[0]?.filter((center: any) =>
        this.selectedRegion.includes(center.region_code)
      );

      this.centersRMC.push(filteredCentersRMC);

      let lenOfCenterRMC = this.centersRMC.length;
      this.centersRMC1 = this.centersRMC[lenOfCenterRMC - 1];
    }
  }

  onMcChange(event: any): void {
    this.selectedMCData = event.value;

    this.rmcDisabled = this.selectedMC.length > 0;

    const filteredStates = this.states[0].data.filter((state: any) => {
      return this.selectedMC.some(
        (mc: any) => mc.centre_name == state.centre_name
      );
    });

    this.filterStates = filteredStates;
  }

  onRMcChange(event: any): void {
    this.selectedRMCData = event.value;

    this.mcDisabled = this.selectedRMC.length > 0;

    const filterStatesRMC = this.states[0].data.filter((state: any) => {
      return this.selectedRMC.some(
        (rmc: any) => rmc.centre_name == state.centre_name
      );
    });

    this.filterStates = filterStatesRMC;
  }

  onStateChange(event: any): void {
    this.selectedStateData = event.value;

    const filteredDistricts = this.districts[0].data.filter((dist: any) => {
      return this.selectedState.some(
        (mc: any) => mc.state_code == dist.state_code
      );
    });
    this.filterDistrict = filteredDistricts;
  }

  onDistrictChange(event: any): void {
    this.selectedDistrictData = event.value;

    const filteredStations = this.stationData.filter((dist: any) => {
      return this.selectedDistrictData.some(
        (st: any) => dist.district_code == st.district_code
      );
    });

    this.filteredStations = filteredStations;
  }

  onStationChange(event: any): void {
    this.selectedstations = event.value;
  }

  filterStationData(): void {
    this.isLoading = true;
    if (this.selectedstations.length == 0) {
      this.filteredData = this.stationData;
      if (this.selectedRegion && this.selectedRegion.length > 0) {
        this.filteredData = this.filteredData.filter((station: any) =>
          this.selectedRegion.includes(station.region_code)
        );
      }
      if (this.selectedMCData && this.selectedMCData.length > 0) {
        const selectedMCNames = this.selectedMCData.map((mc) => mc.centre_name);
        this.filteredData = this.filteredData.filter((station: any) =>
          selectedMCNames.includes(station.centre_name)
        );
      }
      if (this.selectedRMCData && this.selectedRMCData.length > 0) {
        const selectedRMCNames = this.selectedRMCData.map(
          (rmc: any) => rmc.centre_name
        );
        this.filteredData = this.filteredData.filter((station: any) =>
          selectedRMCNames.includes(station.centre_name)
        );
      }
      if (this.selectedStateData && this.selectedStateData.length > 0) {
        const selectedStateCodes = this.selectedStateData.map(
          (state: any) => state.state_code
        );

        this.filteredData = this.filteredData.filter((item: any) =>
          selectedStateCodes.includes(item.state_code)
        );
      }

      if (this.selectedDistrictData && this.selectedDistrictData.length > 0) {
        const selectedDistrictCodes = this.selectedDistrictData.map(
          (item: any) => item.district_code
        );

        this.filteredData = this.filteredData.filter((item: any) =>
          selectedDistrictCodes.includes(item.district_code)
        );
      }
    } else {
      this.filteredData = this.selectedstations;
    }

    this.filteredData = this.filteredData.filter((x: any) => {
      return (
        (this.isAwsSelected && x.station_type === "AWS") ||
        (this.isOrgSelected && x.station_type === "ORG") ||
        (this.isArgSelected && x.station_type === "ARG")
      );
    });

    this.getDayStatistics();

    //preparing day statistic counts
    this.filteredData = this.filteredData.filter((x: any) => {
      const data = x.data;
      return (
        (this.dayStatistics.veryLightRainFallStations.isVeryLightRainFall &&
          data >= 0.1 &&
          data <= 2.4) ||
        (this.dayStatistics.lightRainfallStations.isLightRainfall &&
          data > 2.4 &&
          data <= 15.5) ||
        (this.dayStatistics.modrateRainFallStations.isModrateRainFall &&
          data > 15.5 &&
          data <= 64.4) ||
        (this.dayStatistics.heavyRainFallStations.isHeavyRainFall &&
          data > 64.4 &&
          data <= 115.5) ||
        (this.dayStatistics.veryHeavyRainfallStations.isVeryHeavyRainfall &&
          data > 115.5 &&
          data <= 204.4) ||
        (this.dayStatistics.extremelyHeavyRainfallStations
          .isExtremelyHeavyRainfall &&
          data > 204.4)
      );
    });

    //consoloing
    let cout = 0;
    for (const key in this.dayStatistics) {
      cout = cout + this.dayStatistics[key].count;
    }
    // console.log('consoling',cout, this.filteredData.length, this.filteredData)
    this.loadStations();
    this.isLoading = false;
  }

  getDayStatistics() {
    // resetting previous changes
    for (const key in this.dayStatistics) {
      this.dayStatistics[key].count = 0;
    }
    // updating
    for (let i = 0; i < this.filteredData.length; i++) {
      const data = this.filteredData[i].data;
      if (data >= 0.1 && data <= 2.4) {
        this.dayStatistics.veryLightRainFallStations.count++;
      } else if (data > 2.4 && data <= 15.5) {
        this.dayStatistics.lightRainfallStations.count++;
      } else if (data > 15.5 && data <= 64.4) {
        this.dayStatistics.modrateRainFallStations.count++;
      } else if (data > 64.4 && data <= 115.5) {
        this.dayStatistics.heavyRainFallStations.count++;
      } else if (data > 115.5 && data <= 204.4) {
        this.dayStatistics.veryHeavyRainfallStations.count++;
      } else if (data > 204.4) {
        this.dayStatistics.extremelyHeavyRainfallStations.count++;
      }
    }
  }

  //-----------------------------------------------------------------------------------------
  isDraggingEnabled = false;

  toggleDragging(): void {
    this.isDraggingEnabled = !this.isDraggingEnabled;

    if (this.isDraggingEnabled) {
      this.stationObservationMap.dragging.enable();
    } else {
      this.stationObservationMap.dragging.disable();
    }
  }

  isPlottingEnabled: boolean = false;
  private drawnCoordinates: any[] = [];

  plotArea(): void {
    this.isPlottingEnabled = true; // Enable storing coordinates after clicking this button
    console.log("Plotting enabled");
    this.selectedOption = "custom_hand_polygon"
    this.toggleBottomNav()
  }

  private initStationObservationMap(): void {
    this.stationObservationMap = L.map("map_observations", {
      center: [23, 85.9629],
      zoom: 5.2,
      zoomControl: true,
      scrollWheelZoom: true,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
      minZoom: 5,
      dragging: false, // Disable map dragging
    });

    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
      }
    );

    osmLayer.addTo(this.stationObservationMap);

    const satelliteLayer = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      {
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "© Google",
      }
    );

    osmLayer.addTo(this.stationObservationMap);

    const baseLayers = {
      OpenStreet: osmLayer,
      SatelliteView: satelliteLayer,
    };

    L.control
      .layers(baseLayers, undefined, { position: "topright" })
      .addTo(this.stationObservationMap);

    L.control
      .zoom({ position: "bottomright" })
      .addTo(this.stationObservationMap);

    const drawnItems = new L.FeatureGroup();
    this.stationObservationMap.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
      draw: {
        // polyline: false, // Allow drawing polylines
        // polygon: false,  // Allow drawing polygons
        // rectangle: false,
        // circle: false,
        // marker: false,
      },
    });

    this.stationObservationMap.addControl(drawControl);

    // Event listener for when a shape is drawn
    this.stationObservationMap.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;

      if (this.isPlottingEnabled) {
        // Store the coordinates of the drawn shape when plotting is enabled
        const coordinates = layer.getLatLngs();
        this.drawnCoordinates.push(coordinates);
        console.log("Coordinates drawn:", this.drawnCoordinates);
      }

      drawnItems.addLayer(layer);
    });
  }

  loadGeoJSON(): void {
    this.http.get("assets/geojson/INDIA_STATE.json").subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          return {
            weight: 1,
            opacity: 1,
            color: "black",
          };
        },
        onEachFeature: (feature: any, layer: any) => {},
      }).addTo(this.stationObservationMap);
    });
  }
  private getIconForData(data: number): L.Icon {
    let iconUrl = "assets/images/EHR.png";

    if (data >= 0.1 && data <= 2.4) {
      iconUrl = "assets/images/VLR.png";
    } else if (data > 2.4 && data <= 15.5) {
      iconUrl = "assets/images/LR.png";
    } else if (data > 15.5 && data <= 64.4) {
      iconUrl = "assets/images/MR.png"; // light blue
    } else if (data > 64.4 && data <= 115.5) {
      iconUrl = "assets/images/HR.png"; // yellow
    } else if (data > 115.5 && data <= 204.4) {
      iconUrl = "assets/images/VHR.png"; // orange
    } else if (data > 204.4) {
      iconUrl = "assets/images/EHR.png";
    }

    return L.icon({
      iconUrl: iconUrl,
      iconSize: [13, 13], // Adjust the size here
      iconAnchor: [10, 20], // Adjust anchor if needed
      popupAnchor: [0, -20], // Adjust popup anchor if needed
    });
  }

  async updateRadius(): Promise<void> {
    if (this.compareCircle) {
      const radiusInKm = this.selectedRadius;
      const radiusToPass = radiusInKm * 1000;
      this.compareCircle.setRadius(radiusToPass);

      this.isloadingSurrondingStations = true;

      const response = await this.fetchStationDataService
        .fetchStationDataInRadius(
          this.selected_Date,
          this.selectedLatitute,
          this.selectedLongitute,
          radiusInKm
        )
        .toPromise();
      const fetchedData = response.data;
      console.log("radiusdata", fetchedData);

      this.stationsRadisuDataToDisplay = [];
      this.stationsRadisuDataToDisplay = fetchedData.map((x: any) => {
        return {
          selected: false,
          station_name: x.station_name,
          state_name: x.state_name,
          distance: x.distance_km.toFixed(2) + "km",
          data: x.data + "mm",
          station_code: x.station_code,
        };
      });

      console.log("radiusdataFilterd", this.stationsRadisuDataToDisplay);

      this.isloadingSurrondingStations = false;
    }
  }

  circleMarkers = [];
  compareCircle: any;
  stationsRadisuDataToDisplay: any = [];
  selectedLatitute: any;
  selectedLongitute: any;

  selectAllChecked = false;
  stationsToBeDisplayedIncharts: Array<{
    station_name: string;
    state_name: string;
    distance: number;
    data: any;
    selected?: boolean;
  }> = [];

  toggleSelectAll(event: any) {
    this.selectAllChecked = event.target.checked;
    this.stationsRadisuDataToDisplay.forEach(
      (station: any) => (station.selected = this.selectAllChecked)
    );
  }

  onStationSelectChange(station: any) {
    // Update the selectAllChecked status based on individual selection
    this.selectAllChecked = this.stationsRadisuDataToDisplay.every(
      (station: any) => station.selected
    );
  }
  private loadStations(): void {
    this.isLoading = true;

    this.markers.forEach((marker) => {
      this.stationObservationMap.removeLayer(marker);
    });
    this.markers = [];

    // Add new markers
    this.filteredData.forEach((station: any) => {
      const lat = parseFloat(station.latitude);
      const lng = parseFloat(station.longitude);
      const dataValue = station.data;

      if (dataValue >= 0.1) {
        const icon = this.getIconForData(dataValue);

        if (lat !== 0 && lng !== 0 && !isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng], { icon: icon });

          const popupContent = `
            <div>
              <strong>Station Name:</strong> ${station.station_name}<br>
              <strong>Rainfall:</strong> ${dataValue + "mm"}<br>
              <button class="popup-button" data-station="${
                station.station_name
              }" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; cursor: pointer;">More info</button>
              <button class="compare-button" data-station="${
                station.station_name
              }" style="padding: 5px 10px; background-color: #28a745; color: #fff; border: none; cursor: pointer;">Compare</button>
            </div>
          `;

          marker.bindPopup(popupContent).addTo(this.stationObservationMap);

          marker.on("popupopen", (e) => {
            const button = document.querySelector(
              `.popup-button[data-station="${station.station_name}"]`
            );
            const compareButton = document.querySelector(
              `.compare-button[data-station="${station.station_name}"]`
            );

            if (button) {
              button.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevents the popup from closing
                this.showStationData(
                  station.station_code,
                  station.station_name,
                  station
                );
              });
            }

            if (compareButton) {
              compareButton.addEventListener("click", async (event) => {
                event.stopPropagation(); // Prevents the popup from closing
                this.compareBUttonClickedForTestPuporse = true;

                // Ensure the popup is defined before trying to update it
                const popup = marker.getPopup();
                marker.closePopup();
                if (popup) {
                  const radarContent = `
                    <div class="radar" id="radar">
                    fbfuchi
                      <div class="beam"></div>
                      <div class="dot" style="--x:0.7; --y:0.2"></div>
                      <div class="dot" style="--x:0.2; --y:0.3"></div>
                      <div class="dot" style="--x:0.6; --y:0.1"></div>
                      <div class="dot" style="--x:0.4; --y:0.6"></div>
                      <div class="dot" style="--x:0.9; --y:0.7"></div>
                    </div>
                  `;

                  this.selectedLatitute = lat;
                  this.selectedLongitute = lng;

                  const radiusInKm = this.selectedRadius;
                  const radiusToPass = radiusInKm * 1000;
                  if (this.compareCircle) {
                    this.stationObservationMap.removeLayer(this.compareCircle);
                  }

                  this.isloadingSurrondingStations = true;

                  const response = await this.fetchStationDataService
                    .fetchStationDataInRadius(
                      this.selected_Date,
                      lat,
                      lng,
                      radiusInKm
                    )
                    .toPromise();
                  const fetchedData = response.data;
                  console.log("radiusdata", fetchedData);

                  this.stationsRadisuDataToDisplay = [];
                  this.stationsRadisuDataToDisplay = fetchedData.map(
                    (x: any) => {
                      console.log("df", x.distance_km.toFixed(2));
                      return {
                        station_name: x.station_name,
                        state_name: x.state_name,
                        distance: x.distance_km.toFixed(2) + "km",
                        data: x.data + "mm",
                        station_code: x.station_code,
                        selected: false,
                      };
                    }
                  );

                  console.log(
                    "radiusdataFilterd",
                    this.stationsRadisuDataToDisplay
                  );

                  this.isloadingSurrondingStations = false;

                  this.compareCircle = L.circle([lat, lng], radiusToPass);
                  this.compareCircle
                    .bringToBack()
                    .addTo(this.stationObservationMap);
                  this.compareCircle.openPopup();
                  marker.openPopup();

                  this.Start();
                }

                this.compareCharts();
              });
            }
          });

          marker.on("popupclose", (e) => {
            const button = document.querySelector(
              `.popup-button[data-station="${station.station_name}"]`
            );
            const compareButton = document.querySelector(
              `.compare-button[data-station="${station.station_name}"]`
            );

            if (button) {
              button.removeEventListener("click", () =>
                this.showStationData(
                  station.station_code,
                  station.station_name,
                  station
                )
              );
            }
            if (compareButton) {
              compareButton.removeEventListener("click", () =>
                this.compareCharts()
              );
            }
          });

          this.markers.push(marker);
        }
      }
    });

    this.isLoading = false;
  }

  // getCurrentMonthDates(date: any): string[] {
  //   const dates: string[] = [];
  //   date = new Date(date)
  //   const year = date.getFullYear();
  //   const month = date.getMonth();
  //   const today = date.getDate();

  //   // Loop from the 1st of the month to today
  //   for (let day = 1; day <= today; day++) {
  //     const currentDate = new Date(year, month, day);
  //     const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  //     dates.push(formattedDate);
  //   }
  //   console.log(dates)
  //   return dates;
  // }

  filterCurrentMonthData(data: any) {
    const filteredData = data.filter((item: any) => {
      const collectionDate = new Date(item.collection_date);
      const selectedDate = new Date(this.selected_Date);

      const thirtyDaysBack = new Date(this.selected_Date);

      thirtyDaysBack.setDate(thirtyDaysBack.getDate() - 30);

      // console.log(selectedDate.getFullYear())
      // const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

      return collectionDate >= thirtyDaysBack && collectionDate <= selectedDate;
    });
    return filteredData;
  }

  filterHistoricalMonthData(data: any, monthsBack: number) {
    const currentDate = new Date();
    console.log("filterHistoricalMonthData", currentDate.getFullYear());
    currentDate.setMonth(currentDate.getMonth() - monthsBack);
    console.log(currentDate.getFullYear());

    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - monthsBack,
      1
    );

    const filteredData = data.filter((item: any) => {
      const collectionDate = new Date(item.collection_date);
      return collectionDate >= startDate && collectionDate <= currentDate;
    });

    return filteredData;
  }

  async showStationData(
    station_code: any,
    station_name: any,
    station: any
  ): Promise<void> {
    this.seriesDailyData = [];
    this.seriesHistoricalData = [];
    this.selectedOption = "station_details";

    const body = {
      station_id: +station_code,
    };

    const response = await this.fetchStationDataService
      .fetchAllDatesAndDataOfStation(body)
      .toPromise();
    const data = response.data;

    console.log(data);

    this.showSelectedStation = station_name;
    this.showSelectedState_name = station.state_name;
    this.showSelectedStationObject = station;
    this.showSelectedStationCode = station_code;

    this.StationTotalEntries = data.filter((x: any) => {
      return x.data != -999.9;
    }).length;

    this.StationsMissingEntries = data.filter((x: any) => {
      return x.data == -999.9;
    }).length;

    let maxi = -999.9,
      mini = 1000,
      date = new Date(),
      maxRecordedDate: any = "";

    data.forEach((element: any) => {
      if (element.data > maxi) {
        maxi = element.data;
        maxRecordedDate = this.formatDate(new Date(element.collection_date));
      }
      if (element.data < mini) {
        mini = element.data;
      }
      if (new Date(element.collection_date) < date) {
        date = new Date(element.collection_date);
      }
    });

    this.StationHighestRecord =
      maxi !== -999.9 && maxi !== null ? maxi + "mm" : 0;
    this.StationLowestRecord = mini;
    this.StationFirstDate = this.formatDate(date);
    this.maxRecordedDataDateofSelectedStation = maxRecordedDate;

    // graph pro
    this.toggleBottomNav();
    this.updateChartNew(this.stationWeatherParametersnew[0]);

    // this.submitParameterForm();
  }

  onDateChange(event: any) {
    this.selected_Date = event.target.value;
    this.fetchStationData(this.selected_Date);

    // if(this.selectedOption=='station_details'){

    //   this.showStationData(this.showSelectedStationCode, this.showSelectedStation, this.showSelectedStationObject)

    // }
  }

  onCompareStationChange(event: any) {
    this.comparingselectedStations = event.value;

    // console.log('comparing selected stations', this.comparingselectedStations)
  }

  async updateChartNew(weatherOptions: any) {
    if (weatherOptions.text === "Daily Data") {
      const { dateIntervals, datum } = await this.showStationDailyCharts(
        this.showSelectedStationCode
      );

      const combinedData = dateIntervals.map((date, index) => ({
        date,
        datum: datum[index],
      }));
      combinedData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Unpack sorted data
      const sortedDateIntervals = combinedData.map((item) => item.date);
      const sortedDatum = combinedData.map((item) => item.datum);

      console.log(dateIntervals, datum);

      this.chart = new Chart({
        chart: {
          type: "line",
        },
        title: {
          text: "",
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          // tickInterval : 5,
          categories: sortedDateIntervals,
          // categories: [],

          title: {
            text: `<${Array(50).fill("-").join("")} Dates ${Array(50)
              .fill("-")
              .join("")}>`,
          },
        },
        series: [
          {
            name: "Station Data",
            type: "line",
            // data: [],
            data: sortedDatum.map((value) => (value !== null ? value : 0)),
            color: "darkblue",
          },
        ],
        exporting: {
          enabled: true,
          buttons: {
            contextButton: {
              menuItems: ["viewFullscreen", "printChart"], // Only show Fullscreen and Print options
            },
          },
        },
        yAxis: {
          title: {
            text: `<${Array(4).fill("-").join("")} mm ${Array(4)
              .fill("-")
              .join("")}>`,
          },
        },
      });
      this.selectedWeatherOption = weatherOptions.text;
    } else if (weatherOptions.text === "Historical Data") {
      this.selectedWeatherOption = weatherOptions.text;
    }
  }
  async showStationHistoricStationCharts(station_code: any, months: any) {
    let HistoricalIntervals: any[] = [];
    let Historicaldatum: any[] = [];

    try {
      const data = {
        station_id: station_code,
      };

      console.log(data);

      // Convert observable to promise using toPromise()
      const response = await this.fetchStationDataService
        .fetchAllDatesAndDataOfStation(data)
        .toPromise();
      const fetchedData = response.data;

      // Filter and process the data
      const filteered_data = this.filterCurrentMonthData(fetchedData);
      this.filterHistoricalMonthData(fetchedData, 54);

      // const month = currentDate.getMonth() + 1

      for (let i = 0; i < filteered_data.length; i++) {
        HistoricalIntervals.push(
          this.formatDate(new Date(filteered_data[i].collection_date))
        );
        Historicaldatum.push(
          filteered_data[i].data === -999.9 ? null : filteered_data[i].data
        );
      }

      console.log("filteered_data", HistoricalIntervals, Historicaldatum);

      // Return the result
      return { HistoricalIntervals, Historicaldatum };
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Data fetching error");
      // Return empty arrays or handle error as needed
      return { dateIntervals: [], datum: [] };
    }
  }

  async showStationDailyCharts(
    station_code: any
  ): Promise<{ dateIntervals: any[]; datum: any[] }> {
    let dateIntervals: any[] = [];
    let datum: any[] = [];

    try {
      const data = {
        station_id: station_code,
      };

      console.log(data);

      const response = await this.fetchStationDataService
        .fetchAllDatesAndDataOfStation(data)
        .toPromise();
      const fetchedData = response.data;

      // Filter and process the data
      const filteered_data = this.filterCurrentMonthData(fetchedData);

      for (let i = 0; i < filteered_data.length; i++) {
        dateIntervals.push(
          this.formatDate(new Date(filteered_data[i].collection_date))
        );
        datum.push(
          filteered_data[i].data === -999.9 ? null : filteered_data[i].data
        );
      }

      console.log("filteered_data", dateIntervals, datum);

      // Return the result
      return { dateIntervals, datum };
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Data fetching error");
      // Return empty arrays or handle error as needed
      return { dateIntervals: [], datum: [] };
    }
  }

  async updateChartCompareNew(weatherOptions: any) {
    if (weatherOptions === "Daily Data") {
      const stationsToDisplayInGraph = this.stationsRadisuDataToDisplay.filter(
        (station: any) => {
          return station.selected;
        }
      );
      const { dateIntervals, series } = await this.CompareStationDailyCharts(
        stationsToDisplayInGraph
      );

      this.chartCompare = new Chart({
        chart: {
          type: "line",
          events: {
            load: function () {
              const chart = this;
            },
          },
        },
        title: {
          text: "",
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: dateIntervals,
          title: {
            text: `Dates`,
          },
        },
        series: series,
        exporting: {
          enabled: true, // Ensure exporting is enabled
          buttons: {
            contextButton: {
              menuItems: [
                "viewFullscreen", // Fullscreen option
                "printChart", // Print option
                "separator", // Adds a separator
                "downloadPNG", // Option to download as PNG
                "downloadJPEG", // Option to download as JPEG
                "downloadPDF", // Option to download as PDF
                "downloadSVG", // Option to download as SVG
              ],
            },
          },
        },
        yAxis: {
          title: {
            text: "Rainfall (mm)",
          },
        },
      });

      this.selectedWeatherOption = weatherOptions;
    } else if (weatherOptions === "Historical Data") {
      this.selectedWeatherOption = weatherOptions;
    }
  }

  async CompareStationDailyCharts(
    stationsToDisplay: any
  ): Promise<{ dateIntervals: any[]; series: any[] }> {
    let series: any[] = [];
    let dateIntervals: any[] = [];

    try {
      for (let j = 0; j < stationsToDisplay.length; j++) {
        const data = {
          station_id: stationsToDisplay[j].station_code,
        };

        const response = await this.fetchStationDataService
          .fetchAllDatesAndDataOfStation(data)
          .toPromise();
        const fetchedData = response.data;

        const filteredData = this.filterCurrentMonthData(fetchedData);
        let stationData: any[] = [];
        let stationDates: any[] = [];

        filteredData.forEach((item: any) => {
          stationDates.push(this.formatDate(new Date(item.collection_date)));
          stationData.push(item.data === -999.9 ? null : item.data);
        });

        const combinedData = stationDates.map((date, index) => ({
          date,
          data: stationData[index],
        }));
        combinedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const sortedDates = combinedData.map((item) => item.date);
        const sortedData = combinedData.map((item) => item.data);

        series.push({
          name: `${stationsToDisplay[j].station_name}`,
          type: "line",
          data: sortedData.map((value) => (value !== null ? value : 10)),
        });

        if (j === 0) {
          dateIntervals = sortedDates; // Assuming all stations have the same date range
        }
      }

      console.log(
        "Fetched and sorted data for stations:",
        dateIntervals,
        series
      );
      return { dateIntervals, series };
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Data fetching error");
      return { dateIntervals: [], series: [] };
    }
  }

  months = Array.from({ length: 12 }, (_, i) => `${i + 1} month(s) ago`); // Example months
  selectedMonth: string = "";

  submitHistoricalData() {
    if (this.selectedMonth) {
      console.log("Selected Month:", this.selectedMonth);
      // Add logic to process the selected month here
    }
  }

  isResizing = false;
  chartHeight: string = "232px"; // Default height

  onMouseDown(event: MouseEvent): void {
    this.isResizing = true;
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isResizing) {
      const resizableBox = document.querySelector(
        ".resizable-box"
      ) as HTMLElement;
      const newHeight = window.innerHeight - event.clientY;

      // Set the new height for the resizable box
      resizableBox.style.height = `${newHeight}px`;

      // Update the chart height dynamically based on the new height
      this.chartHeight = `${newHeight * 10}px`; // Adjust the factor as needed

      // If the chart is already created, update its height
      if (this.chartCompare) {
        this.chartCompare.update({
          chart: {
            height: this.chartHeight,
          },
        });
      }
    }
  }

  onMouseUp(): void {
    this.isResizing = false;
    window.removeEventListener("mousemove", this.onMouseMove.bind(this));
    window.removeEventListener("mouseup", this.onMouseUp.bind(this));
  }


  //------------------------------------------------------------------------------------------------------
  //Notes and custop-polyhgon
  userNotes = '';
  notesExpanded = false;
  additionalTableData = [
    { detail: 'Temperature', value: '30°C' },
    { detail: 'Humidity', value: '60%' },
    { detail: 'Pressure', value: '1015 hPa' }
  ];

  
  expandNotes(): void {
    this.notesExpanded = !this.notesExpanded;
    const notesElement = document.querySelector('.notes-container textarea');
    if (notesElement) {
      notesElement.setAttribute('rows', this.notesExpanded ? '5' : '2');
    }
  }
}










