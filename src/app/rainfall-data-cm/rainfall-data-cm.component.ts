import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import * as FileSaver from 'file-saver';
import { format } from 'date-fns';

@Component({
  selector: 'app-rainfall-data-cm',
  templateUrl: './rainfall-data-cm.component.html',
  styleUrls: ['./rainfall-data-cm.component.css']
})
export class RainfallDataCmComponent implements OnInit{

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

    constructor(
    private router: Router,
    private http: HttpClient,
    private dataService: DataService
  ) {
    // this.setDateMonth();
    // this.getAllDaysInMonth();
  }

  ngOnInit(): void {
    this.getAllData();
    let loggedInUser: any = localStorage.getItem("isAuthorised");
    this.loggedInUser = JSON.parse(loggedInUser);
    console.log(this.loggedInUser);
    console.log(this.loggedInUser.data[0].name);
  }

  goBack() {
      window.history.back();
  }
  
  validateDateRange() {
    var fromDate = this.fromDate;
    var toDate = this.toDate

    if (fromDate > toDate) {
      alert('From date cannot be greater than To date');
      this.fromDate = toDate;
    }
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

    sampleFile(){
    let data:any[] = [];
    this.filteredItems.forEach(x => {
      let station:any = {
        Metsubdivision: x.metsubdivision,
        Station_Name: x.station,
        District_Name: x.district,
        Rainfall: x.rainFall,
      }
      data.push(station);
    })
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

  getAllData() {
    // Call the fetchMasterFile() API here
    this.dataService.fetchMasterFile().subscribe(
      (data) => {
        // Process the data returned by the API
        console.log(data);
        if (this.loggedInUser.data[0].mcorhq === "mc") {
          this.filteredDataForRainfall = data.filter((it: any) => it.rmc_mc.toLowerCase() == this.loggedInUser.data[0].name.toLowerCase());
          console.log('if cond', this.filteredDataForRainfall)
        }
        else {
          this.filteredDataForRainfall = data;
          console.log('Data fetched:', data);
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        // Handle errors appropriately
      }
    );
  }

    filterData() {
     // Format the filter date to match the backend format (e.g., 02_Jan_24)
    const formattedDate = format(new Date(this.filterDate), 'dd_MMM_yy');
    console.log(formattedDate)
    const rainfallInMM = this.filterRainfall * 10; // Convert cm to mm

     this.filteredItems = this.filteredDataForRainfall.filter(x => {
          return  x[formattedDate] >= rainfallInMM;
     })
      
      this.filteredItems.map(x => {
        return x.rainFall = x[formattedDate];
    })
    // this.filteredItems = this.filteredDataForRainfall.filter(item => {
    //   return item.date === formattedDate && item.rainfall >= rainfallInMM;
    // });
      
      console.log(this.filteredItems)
    }
  
    dateCalculation() {
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      let newDate = new Date(this.selectedDate);
      let dd = String(newDate.getDate());
      const year = newDate.getFullYear();
      const currmonth = months[newDate.getMonth()];
      const selectedYear = String(year).slice(-2);
      return `${dd.padStart(2, '0')}_${currmonth}_${selectedYear}`;
    }
}
