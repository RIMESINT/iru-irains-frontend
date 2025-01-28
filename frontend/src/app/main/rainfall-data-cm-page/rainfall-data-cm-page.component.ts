import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import * as FileSaver from 'file-saver';
import { format } from 'date-fns';
import { FetchStationDataService } from 'src/app/services/station/station.service';

@Component({
  selector: 'app-rainfall-data-cm-page',
  templateUrl: './rainfall-data-cm-page.component.html',
  styleUrls: ['./rainfall-data-cm-page.component.css']
})
export class RainfallDataCmPageComponent implements OnInit{

    loggedInUser: any;  
    date: string = String(new Date().getDate());
    month: string = String((new Date().getMonth() + 1).toString().length == 1 ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1));
    year: string = '2024'
    sortedData: any[] = [];
    filteredStations: any[] = [];
    filteredItems: any[] = [];
    filterDate: string = '';
    mcName: string = '';
    filterRainfall: number = 0;
    selectedUnit: string = 'mm';  // Added to track selected unit
    filteredDataForRainfall: any[] = [];
    existingstationdata: any[] = [];
    tempfilteredStations: any[] = [];
    regionList: any[] = [];
    selectedDate: Date = new Date();
    fromDate: Date = new Date();
    toDate: Date = new Date();
    selectedFile: File | null = null;
    sortDirection: 'asc' | 'desc' = 'asc';
    sortKey: string = '';
    enteredDate: string = "" ;
    isLoading: boolean = false;
    stationData: any[] = []; 
    centreType : string = "";
    centreName : string = "";
    fromRange: number | null = null;
    toRange: number | null = null;

    isCustomRange: boolean = false; 
    predefinedRange: string = '';  

    minRange: number | null = null;  
    maxRange: number | null = null;

    customRangeUnit: 'mm' | 'cm' = 'mm'; // Default to mm


      constructor(
      private router: Router,
      private http: HttpClient,
      private dataService: DataService,
      private fetchStationDataService: FetchStationDataService,
    ) {
      // this.setDateMonth();
      // this.getAllDaysInMonth();
    }
  
    ngOnInit(): void {
      // this.getAllData();

      let loggedInUser: any = localStorage.getItem("isAuthorised");
      this.loggedInUser = JSON.parse(loggedInUser);
      // console.log(this.loggedInUser);
      
      const regex = /^(RMC|MC)\s(\w+)/;
      const match = this.loggedInUser.data[0].name.match(regex);
      // console.log('match', match)

      if(match){
        this.centreType = match[1];
        this.centreName = match[2];
      }

    }

    onDateChange (event: any): void {
      console.log('event.target.value', event.target.value);
      this.enteredDate = event.target.value;
      this.fetchStationData(this.enteredDate);
    }

    fetchStationData(date: any): void{
      this.isLoading = true;  

      const selectedMode = localStorage.getItem('selectedMode');
      const parsedSelectedMode = JSON.parse(selectedMode ?? '');
      console.log('parsedSelectedMode',parsedSelectedMode.selectedMode)

      if(parsedSelectedMode.selectedMode != 'Unified'){
        this.fetchStationDataService.fetchStationData(date?? "")
          .subscribe(
            (response : any) => {
              this.stationData = response?.data; 
              this.isLoading = false;  
              console.log('Data fetched successfully:', this.stationData);
            },
            (error : any) => {
              this.isLoading = false;  
              console.error('Error fetching data:', error);
            }
          );
      }
    }

    goBack() {
        window.history.back();
    }
      
    exportAsXLSX(): void {
      console.log(this.filteredItems)
      this.exportAsExcelFile(this.sampleFile(), 'Significant_RainFall_Data');
      // this.exportAsExcelFile(this.filteredStations, 'export-to-excel');
    }
    
      exportAsExcelFile(json: any[], excelFileName: string): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      console.log('worksheet', worksheet);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    
      saveAsExcelFile(buffer: any, fileName: string): void {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }

      sampleFile() {
        let data: any[] = [];
        this.filteredItems.forEach(x => {
          // Convert data to cm if the selected unit is cm
          let convertedData = this.selectedUnit === 'cm' ? (x.data / 10) : x.data;
      
          let station: any = {
            Metsubdivision: x.subdiv_name,
            Station_Name: x.station_name,
            District_Name: x.district_name,
            // Use the selected unit to determine the key
            [this.selectedUnit === 'mm' ? 'Rainfall_mm' : 'Rainfall_cm']: convertedData,
          };
      
          data.push(station);
          console.log('station', station);
        });
        return data;
      }
      onFileSelected(event: any) {
      this.selectedFile = event.target.files[0];
    }
  
      showMessage(elementRef: any) {
      const value = elementRef.value.trim();
      const regex = /^\d+(\.\d)?$|^\d+(\.\d)?$/;
      if (regex.test(value)) {
        elementRef.style.background = '';
      } else {
        elementRef.style.background = 'red';
        // alert("Please enter a valid number with only one decimal place");
      }
      if (Number(elementRef.value) > 100) {
        elementRef.style.background = 'red'
        alert("Rainfall is greater than 100mm")
      } else {
        elementRef.style.background = ''
      }
    }
    
     sortData(key: string) {
      this.sortKey = key;
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.filteredItems.sort((a, b) => {
        const isAsc = this.sortDirection === 'asc';
        return (a[key] < b[key] ? -1 : 1) * (isAsc ? 1 : -1);
      });
    }

      validateRainfall() {
        if (this.filterRainfall < 0) {
          this.filterRainfall = 0; // Reset to 0 if the value is negative
          alert("Rainfall value cannot be below 0");
        }
      }          

  setRangeMode(customRange: boolean): void {
  this.isCustomRange = customRange;
  this.filterRainfall = 0;      // Reset manual input
  this.predefinedRange = '';    // Reset predefined range selection
}

onRangeSelect(): void {
  // Parse and store min and max values from selected range
  const [min, max] = this.predefinedRange.split('-').map(Number);
  this.minRange = min;
  this.maxRange = max;
}

onCustomRangeUnitChange(unit: 'mm' | 'cm'): void {
  this.customRangeUnit = unit;
  this.selectedUnit = unit; // Update the selectedUnit for the table header
  console.log(`Custom range unit changed to: ${unit}`);
}


// filterData(): void {
//   if (this.isCustomRange) {
//     if (this.fromRange === null || this.toRange === null) {
//       alert("Please enter both 'From' and 'To' range values.");
//       return;
//     }
//     if (this.fromRange >= this.toRange) {
//       alert("Invalid range: 'From' value should be less than 'To' value.");
//       return;
//     }
//   }

//   const min = this.isCustomRange ? this.fromRange! : 0;
//   const max = this.isCustomRange ? this.toRange! : Number.MAX_SAFE_INTEGER;

//   this.filteredItems = this.stationData.filter(station => {
//     let rainfall = this.selectedUnit === 'cm' ? station.data / 10 : station.data;
//     return rainfall >= min && rainfall <= max;
//   });

//   console.log(this.filteredItems);
//   if (this.filteredItems.length === 0) {
//     alert("No data available for the selected range.");
//   }
// }

filterData(): void {
  if (this.isCustomRange) {
    if (this.fromRange === null || this.toRange === null) {
      alert("Please enter both 'From' and 'To' range values.");
      return;
    }
    if (this.fromRange >= this.toRange) {
      alert("Invalid range: 'From' value should be less than 'To' value.");
      return;
    }
  }

  const minRange =
    this.customRangeUnit === 'cm'
      ? (this.fromRange ?? 0) * 10
      : this.fromRange ?? 0;
  const maxRange =
    this.customRangeUnit === 'cm'
      ? (this.toRange ?? Number.MAX_SAFE_INTEGER) * 10
      : this.toRange ?? Number.MAX_SAFE_INTEGER;

  this.filteredItems = this.stationData.filter(station => {
    const rainfall = station.data; // Data is in mm by default
    return rainfall >= minRange && rainfall <= maxRange;
  });

  console.log(this.filteredItems);
  if (this.filteredItems.length === 0) {
    alert("No data available for the selected range.");
  }
}
}