import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import * as FileSaver from 'file-saver';
import { format } from 'date-fns';
import { FetchStationDataService } from 'src/app/services/station/station.service';
import { saveAs } from 'file-saver';
// import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";

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
      // console.log('centreType', this.centreType);
      // console.log('centreName', this.centreName.toUpperCase());
    }

    onDateChange (event: any): void {
      console.log('event.target.value', event.target.value);
      this.enteredDate = event.target.value;
      this.fetchStationData(this.enteredDate);
    }

    fetchStationData(date: any): void{
      this.isLoading = true;  // Set loading to true before starting the API call
      this.fetchStationDataService.fetchStationData(date?? "")
        .subscribe(
          (response : any) => {
            this.stationData = response?.data;  // Store the fetched data
            this.isLoading = false;  // Set loading to false once data is fetched
            console.log('Data fetched successfully:', this.stationData);
          },
          (error : any) => {
            this.isLoading = false;  // Set loading to false in case of error
            console.error('Error fetching data:', error);
          }
        );
    }
  
    goBack() {
        window.history.back();
    }
    exportAsDOCX(): void {
      console.log(this.filteredItems)
      this.exportAsWordFile(this.sampleFile(), 'Significant_RainFall_Data');
    }

    exportAsWordFile(json: any[], docFileName: string): void {
      const table = new Table({
          width: {
              size: 100,
              type: WidthType.PERCENTAGE
          },
          rows: [
              new TableRow({
                  children: [
                      new TableCell({
                          children: [new Paragraph('Met Subdivision')],
                          width: { size: 25, type: WidthType.PERCENTAGE },
                          margins: { top: 100, bottom: 100, left: 100, right: 100 } // Adding margins to the cell
                      }),
                      new TableCell({
                          children: [new Paragraph('District Name')],
                          width: { size: 25, type: WidthType.PERCENTAGE },
                          margins: { top: 100, bottom: 100, left: 100, right: 100 }
                      }),
                      new TableCell({
                          children: [new Paragraph('Station Name')],
                          width: { size: 25, type: WidthType.PERCENTAGE },
                          margins: { top: 100, bottom: 100, left: 100, right: 100 }
                      }),
                      new TableCell({
                          children: [new Paragraph('Rainfall (cm)')],
                          width: { size: 25, type: WidthType.PERCENTAGE },
                          margins: { top: 100, bottom: 100, left: 100, right: 100 }
                      }),
                  ]
              }),
              ...json.map(item => new TableRow({
                  children: [
                      new TableCell({
                          children: [new Paragraph(item.Metsubdivision)],
                          width: { size: 25, type: WidthType.PERCENTAGE },
                          margins: { top: 100, bottom: 100, left: 100, right: 100 }
                      }),
                      new TableCell({
                          children: [new Paragraph(item.District_Name)],
                          width: { size: 25, type: WidthType.PERCENTAGE },
                          margins: { top: 100, bottom: 100, left: 100, right: 100 }
                      }),
                      new TableCell({
                          children: [new Paragraph(item.Station_Name)],
                          width: { size: 25, type: WidthType.PERCENTAGE },
                          margins: { top: 100, bottom: 100, left: 100, right: 100 }
                      }),
                      new TableCell({
                          children: [new Paragraph(item.Rainfall_CM.toString())],
                          width: { size: 25, type: WidthType.PERCENTAGE },
                          margins: { top: 100, bottom: 100, left: 100, right: 100 }
                      }),
                  ]
              }))
          ]
      });
    
      const doc = new Document({
        sections: [{
          properties: {},
          children: [table],
        }],
      });
  
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, docFileName + '.docx');
      });
    }
  
    sampleFile(){
      let data: any[] = [];
      this.filteredItems.forEach(x => {
        let station: any = {
          Metsubdivision: x.subdiv_name,
          Station_Name: x.station_name,
          District_Name: x.district_name,
          Rainfall_CM: x.data,
        }
        data.push(station);
      });
      return data;
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
  
      // sampleFile(){
      // let data:any[] = [];
      // this.filteredItems.forEach(x => {
      //   let station:any = {
      //     Metsubdivision: x.subdiv_name,
      //     Station_Name: x.station_name,
      //     District_Name: x.district_name,
      //     Rainfall_CM: x.data,
      //   }
      //   data.push(station);
      // })
      // return data;
      // }
    
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

  

      // filterData() {
      //   this.filteredItems = this.stationData
      //     .filter(station => (station.data/10) >= this.filterRainfall)
      //     .map(station => ({
      //       subdiv_name: station.subdiv_name,
      //       district_name: station.district_name,
      //       station_name: station.station_name,
      //       data: station.data / 10,
      //     }));

      //     if(this.filteredItems.length == 0){
      //       alert("For Entered Range Data is not available");
      //     }

      // }


      validateRainfall() {
        if (this.filterRainfall < 0) {
          this.filterRainfall = 0; // Reset to 0 if the value is negative
          alert("Rainfall value cannot be below 0");
        }
      }
      
      
      filterData() {
        console.log(this.filteredItems.length);
        this.filteredItems = this.stationData
            .filter(station => {
                // Always filter by rainfall
                let isValid = (station.data / 10) >= this.filterRainfall;

                // Apply additional constraints if centreType and centreName are present
                if (this.centreType == 'MC' || this.centreType == 'RMC') {
                    isValid = isValid && station.centre_type === this.centreType && station.centre_name === this.centreName.toUpperCase();
                }
                
                return isValid;
            })
            .map(station => ({
                subdiv_name: station.subdiv_name,
                district_name: station.district_name,
                station_name: station.station_name,
                data: station.data / 10,
            }));
     
        if (this.filteredItems.length === 0) {
            alert("For Entered Range Data is not available");
        }
      
      }
    
}