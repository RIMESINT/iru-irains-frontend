import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, concatMap, lastValueFrom } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Constants } from '../constants';
import autoTable, { Column } from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { RegionService } from '../region/region.service';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})

export class StateDownloadStatistics {
  isView : boolean = false
  private baseUrl: string = environment.baseUrl;

  statedepCurrdate: any[] = [];
  regiondepCurrdate: any[] = [];

  statedepSeasondate: any[] = [];
  regiondepSeasondate: any[] = [];

  rows :any[][] = [];
  data: any;
  seasonPeriodDate: any;

  constructor(private http: HttpClient, private constants: Constants, private regionService:RegionService, private stateservice:StateService) {
  }

  convertToIndianDateFormat = (dateString: string) => dateString.split('-').reverse().join('-');


  async updateanddownloadpdf(){
    const currDate = new Date();
    this.data = this.constants.getRangeFromDateRange();
    this.seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodate(currDate);
    await this.updateCurrDateData(this.data, this.seasonPeriodDate)
  }

  async updateanddownloadpdfFromDataEntry(){
    const currDate = new Date();
    this.data = this.constants.getRangeFromDateRange();
    this.seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodate(currDate);
    await this.updateCurrDateDataFromDataEntry(this.data, this.seasonPeriodDate)
  }

  async updateandViewpdf(){
    this.isView = true
    const currDate = new Date();
    this.data = this.constants.getRangeFromDateRange();
    this.seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodate(currDate);
    await this.updateCurrDateData(this.data, this.seasonPeriodDate)
  }

  async updateandViewpdfFromDataEntry(){
    this.isView = true
    const currDate = new Date();
    this.data = this.constants.getRangeFromDateRange();
    this.seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodate(currDate);
    await this.updateCurrDateDataFromDataEntry(this.data, this.seasonPeriodDate)
  }


  async updateanddownloadpdfCustom(fromDate : any, toDate : any){
    const currDate = new Date();
    // this.data = this.constants.getRangeFromDateRange();
    this.data  = {
      startDate : fromDate, // 2024-09-18 format
      endDate : toDate
    }
    
    this.seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodateCustom(new Date(toDate));
    await this.updateCurrDateData(this.data, this.seasonPeriodDate)
  }

  async updateanddownloadpdfFromDataEntryCustom(fromDate : any, toDate : any){
    const currDate = new Date();
    // this.data = this.constants.getRangeFromDateRange();
    this.data  = {
      startDate : fromDate, // 2024-09-18 format
      endDate : toDate
    }
    
    this.seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodateCustom(new Date(toDate));
    await this.updateCurrDateDataFromDataEntry(this.data, this.seasonPeriodDate)
  }

  async updateandViewpdfCustom(fromDate : any, toDate : any){
    this.isView = true
    const currDate = new Date();
    // this.data = this.constants.getRangeFromDateRange();
    this.data  = {
      startDate : fromDate, // 2024-09-18 format
      endDate : toDate
    }
    
    this.seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodateCustom(new Date(toDate));
    await this.updateCurrDateData(this.data, this.seasonPeriodDate)
  }

  async updateandViewpdfFromDataEntryCustom(fromDate : any, toDate : any){
    this.isView = true
    const currDate = new Date();
    // this.data = this.constants.getRangeFromDateRange();
    this.data  = {
      startDate : fromDate, // 2024-09-18 format
      endDate : toDate
    }
    
    this.seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodateCustom(new Date(toDate));
    await this.updateCurrDateDataFromDataEntry(this.data, this.seasonPeriodDate)
  }



    
 
  async updateCurrDateData(data:any, seasonPeriodDate:any ){
    try{
      await lastValueFrom(
        this.stateservice.fetchDataFtp(data).pipe(
          concatMap(stateData => {
            this.statedepCurrdate = stateData.data;
            console.log('indownloading---->',this.statedepCurrdate)
            return this.regionService.fetchDataFtp(data);
          }),
          concatMap(region => {
            this.regiondepCurrdate = region.data;
            console.log('indownloading---->',this.regiondepCurrdate)
            return this.stateservice.fetchDataFtp(seasonPeriodDate); // or any observable to complete the chain
          }),
          concatMap(seasonstateData => {
            this.statedepSeasondate = seasonstateData.data;
            console.log('indownloading---->',this.statedepSeasondate)
            return this.regionService.fetchDataFtp(seasonPeriodDate);
          }),    
          concatMap(seasonregionData => {
            this.regiondepSeasondate = seasonregionData.data;
            console.log('indownloading---->', this.regiondepSeasondate)
            this.downloadPdf()
            return EMPTY
          }),
    
        )
      );
    }

    catch (error) {
      console.error('Error fetching data:', error);
    }



    
    // this.stateservice.fetchDataFtp(data).pipe(
    //   concatMap(stateData => {
    //     this.statedepCurrdate = stateData.data;
    //     console.log('indownloading---->',this.statedepCurrdate)
    //     return this.regionService.fetchDataFtp(data);
    //   }),
    //   concatMap(region => {
    //     this.regiondepCurrdate = region.data;
    //     console.log('indownloading---->',this.regiondepCurrdate)
    //     return this.stateservice.fetchDataFtp(seasonPeriodDate); // or any observable to complete the chain
    //   }),

    //   concatMap(seasonstateData => {
    //     this.statedepSeasondate = seasonstateData.data;
    //     console.log('indownloading---->',this.statedepSeasondate)

    //     return this.regionService.fetchDataFtp(seasonPeriodDate);
    //   }),    
    //   concatMap(seasonregionData => {
    //     this.regiondepSeasondate = seasonregionData.data;
    //     console.log('indownloading---->', this.regiondepSeasondate)
    //     this.downloadPdf()
    //     return EMPTY
    //   }),

    // ).subscribe(
    //   () => { },
    //   (error:any) => console.error('Error fetching data:', error)
    // );
  }


   
  async updateCurrDateDataFromDataEntry(data:any, seasonPeriodDate:any ){
    try{
      await lastValueFrom(
        this.stateservice.fetchData(data).pipe(
          concatMap(stateData => {
            this.statedepCurrdate = stateData.data;
            console.log('indownloading---->',this.statedepCurrdate)
            return this.regionService.fetchData(data);
          }),
          concatMap(region => {
            this.regiondepCurrdate = region.data;
            console.log('indownloading---->',this.regiondepCurrdate)
            return this.stateservice.fetchData(seasonPeriodDate); // or any observable to complete the chain
          }),
    
          concatMap(seasonstateData => {
            this.statedepSeasondate = seasonstateData.data;
            console.log('indownloading---->',this.statedepSeasondate)
    
            return this.regionService.fetchData(seasonPeriodDate);
          }),    
          concatMap(seasonregionData => {
            this.regiondepSeasondate = seasonregionData.data;
            console.log('indownloading---->', this.regiondepSeasondate)
            this.downloadPdf()
            return EMPTY
          }),
    
        )
      );
    }

    catch (error) {
      console.error('Error fetching data:', error);
    }



    
    // this.stateservice.fetchDataFtp(data).pipe(
    //   concatMap(stateData => {
    //     this.statedepCurrdate = stateData.data;
    //     console.log('indownloading---->',this.statedepCurrdate)
    //     return this.regionService.fetchDataFtp(data);
    //   }),
    //   concatMap(region => {
    //     this.regiondepCurrdate = region.data;
    //     console.log('indownloading---->',this.regiondepCurrdate)
    //     return this.stateservice.fetchDataFtp(seasonPeriodDate); // or any observable to complete the chain
    //   }),

    //   concatMap(seasonstateData => {
    //     this.statedepSeasondate = seasonstateData.data;
    //     console.log('indownloading---->',this.statedepSeasondate)

    //     return this.regionService.fetchDataFtp(seasonPeriodDate);
    //   }),    
    //   concatMap(seasonregionData => {
    //     this.regiondepSeasondate = seasonregionData.data;
    //     console.log('indownloading---->', this.regiondepSeasondate)
    //     this.downloadPdf()
    //     return EMPTY
    //   }),

    // ).subscribe(
    //   () => { },
    //   (error:any) => console.error('Error fetching data:', error)
    // );
  }


  

  exportAsExcelFile(json: any[], excelFileName: string, columns: any, columns1: any): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    
    // Define the range of cells you want to merge
    const startCell = 'C1'; // Start cell for the first merge
    const endCell = 'F1'; // End cell for the first merge
    const startCell1 = 'G1'; // Start cell for the second merge
    const endCell1 = 'J1'; // End cell for the second merge

    // Merge the cells
    worksheet['!merges'] = [
        { s: XLSX.utils.decode_cell(startCell), e: XLSX.utils.decode_cell(endCell) },
        { s: XLSX.utils.decode_cell(startCell1), e: XLSX.utils.decode_cell(endCell1) }
    ];

    // Add the first header row (with merged cells)
    XLSX.utils.sheet_add_aoa(worksheet, [columns1], { origin: 'A1' });

    // Add the second header row
    XLSX.utils.sheet_add_aoa(worksheet, [columns], { origin: 'A2' });

    // Adjust the starting point for the data rows
    XLSX.utils.sheet_add_json(worksheet, json, { origin: 'A3', skipHeader: true });

    // Create the workbook and add the worksheet
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    
    // Generate the Excel file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save the file
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

  
  public async downloadPdf(){

    console.log(this.data.startDate, this.data.endDate, 'Manu Test');

    const columns1 = ['', '', 
      {
        // content : this.data.startDate==this.data.endDate ? `DAY: ${this.convertToIndianDateFormat(this.data.startDate)}`:`DAY: ${this.convertToIndianDateFormat(this.data.startDate)} to ${this.convertToIndianDateFormat(this.data.endDate)}`, colSpan:4

        content: this.data.startDate === this.data.endDate 
        ? `DAY: ${this.convertToIndianDateFormat(this.data.startDate)}`
        : `DAY: ${this.convertToIndianDateFormat(this.data.startDate)} to ${this.getAdjustedEndDate(this.data.startDate, this.data.endDate)}`, 
      colSpan: 4
      },
      {
        content : `PERIOD: ${this.convertToIndianDateFormat(this.seasonPeriodDate.startDate)} to ${this.convertToIndianDateFormat(this.seasonPeriodDate.endDate)}`, colSpan:4
      },
    ]
    const columns1forexcel = ['', '',
    {
      content : this.data.startDate==this.data.endDate ? `DAY: ${this.convertToIndianDateFormat(this.data.startDate)}`:`DAY: ${this.convertToIndianDateFormat(this.data.startDate)} to ${this.convertToIndianDateFormat(this.data.endDate)}`, colSpan:4
    }, '', '', '',    
    {
      content : `PERIOD: ${this.convertToIndianDateFormat(this.seasonPeriodDate.startDate)} to ${this.convertToIndianDateFormat(this.seasonPeriodDate.endDate)}`, colSpan:4
    }]

    const columns = ['S.No', 'REGION/STATE', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.'];

        
    this.loadTheRows();


    var newArr = this.rows.map((subArr) => {
      return subArr.map((item:any) => {
        console.log('itemmmmmm,', item)
        if (typeof item === 'object' && item.hasOwnProperty('content')) {
          return item.content;
        }
        return item;
      });
    });

    

    var newcolumns1 = columns1forexcel.map((item) => {
      if (typeof item === 'object' && item.hasOwnProperty('content')) {
        return item.content;
      }
      return item;
    });

    let serialNumber = 1;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const tableWidth = 180;
    const cellWidth = 36;
    const cellHeight = 8;
    const marginLeft = 10;
    const marginTop = 10;
    const fontSize = 10;
    const options: any = {
      startY: marginTop,
      margin: { left: marginLeft },
    };
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = 15;
    const imgMargin = 10;
    const imgX = pageWidth - imgWidth - imgMargin;
    const imgData150 = '/assets/images/IMD150(BGR).png';
    doc.addImage(imgData150, 'PNG', imgX, marginTop, 15, 20);
    const imgData = '/assets/images/IMDlogo_Ipart-iris.png';
    doc.addImage(imgData, 'PNG', marginLeft, marginTop, 15, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Set font color to black
    const headingText = 'India Meteorological Department\nHydromet Division, New Delhi';
    const headingText1 = 'STATE-WISE RAINFALL DISTRIBUTION';
    doc.text(headingText, marginLeft + 25, marginTop + 8); // Adjust position as needed
    doc.text(headingText1, marginLeft + 100, marginTop + 28);
    autoTable(doc, {
      head: [columns1, columns],
      body: this.rows,
      theme: 'striped',
      startY: marginTop + cellHeight + 25, // Adjust the vertical position below the image and heading
      margin: { left: marginLeft },
      styles: { fontSize: 7 },
      headStyles: { halign: 'center' },
      didDrawCell: function (data: { cell: { text: any; x: number; y: number; width: any; height: any; }; }) {
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        doc.setDrawColor(0);
      },
      didParseCell: function (data: any) {
        data.cell.styles.fontStyle = 'bold';
      }
    });

    
    const columns2 = ['', 'LEGEND', ''];
    const columns3 = ['CATEGORY', '% DEPARTURES OF RAINFALL', 'COLOUR CODE']; // Update with your second table column names
    const rows2 = [
      ['Large Excess\n(LE or L.Excess)', '>= 60%', { content: '', styles: { fillColor: '#0096ff' } }],
      ['Excess (E)', '>= 20% and <= 59%', { content: '', styles: { fillColor: '#32c0f8' } }],
      ['Normal (N)', '>= -19% and <= +19%', { content: '', styles: { fillColor: '#00cd5b' } }],
      ['Deficient (D)', '>= -59% and <= -20%', { content: '', styles: { fillColor: '#ff2700' } }],
      ['Large Deficient\n(LD or L.Deficient)', '>= -99% and <= -60%', { content: '', styles: { fillColor: '#ffff20' } }],
      ['No Rain(NR)', '= -100%', { content: '', styles: { fillColor: '#ffffff' } }],
      ['Not Available', 'ND', { content: '', styles: { fillColor: '#c0c0c0' } }],
      ['Note : ', { content: 'The rainfall values are rounded off up to one place of decimal.', colSpan: 2 }]
    ];
    
    doc.addPage();
    autoTable(doc,{
      head: [columns2, columns3],
      body: rows2,
      theme: 'striped',
      didDrawCell: function (data: { cell: { text: any; x: number; y: number; width: any; height: any; }; }) {
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        doc.setDrawColor(0);
      },
    });
    // DISTRIBUTION_COUNTRY_INDIA_cd.pdf
    const filename = `DISTRIBUTION_STATE_INDIA_cd.pdf`;

    if(this.isView){
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    }else{
      setTimeout(()=>{
        doc.save(filename);
        this.exportAsExcelFile(newArr, `DISTRICT_RAINFALL_DISTRIBUTION_STATE_INDIA_cd`, columns, newcolumns1);
      },3000)
    }


    
   
  
  }

  getAdjustedEndDate(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // If the start and end dates fall in different months
    if (start.getMonth() !== end.getMonth()) {
      // Get the last day of the start month
      const lastDayOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  
      // Ensure the lastDayOfMonth is correct by explicitly constructing the date string
      const lastDayOfMonthStr = this.formatDate(lastDayOfMonth);
  
      return this.convertToIndianDateFormat(lastDayOfMonthStr);
    }
  
    // If they are in the same month, return the original end date
    return this.convertToIndianDateFormat(endDate);
  }
  
  /**
   * Helper function to format Date object as 'YYYY-MM-DD' without timezone issues
   */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
  
    return `${year}-${month}-${day}`;
  }
  


  private loadTheRows() {
    // Group by Subdivision and then State
    this.rows = []
    console.log('started', this.rows)
    const groupedByRegion = this.statedepCurrdate.reduce((acc, item) => {
        const region = item.region_code;
        const state = item.state_code;

        if (!acc[region]) {
            acc[region] = {};
        }

        if (!acc[region][state]) {
            acc[region][state] = [];
        }
        
        acc[region][state].push(item);
        return acc;
    }, {});

    // Sort subdivisions
    // const regionNames = this.regiondepCurrdate.map((x:any)=> {
    //   [x.r_code, x.name]
    // })
    // const sortedRegions = Object.keys(groupedByRegion).sort((a, b) => a.localeCompare(b));
    // console.group('heygeyye', sortedRegions)


    const regionNames = this.regiondepCurrdate.map((x: any) => [x.r_code, x.name]);
    const codeToRegionNameMap = new Map(regionNames.map(([code, name]) => [code, name]));

    // Sort the groupedByRegion keys based on the region names
    const sortedRegions = Object.keys(groupedByRegion).sort((a, b) => {
        const nameA = codeToRegionNameMap.get(a) || '';
        const nameB = codeToRegionNameMap.get(b) || '';
        return nameA.localeCompare(nameB);
    });

    console.group('heygeyye', sortedRegions);


    let subdivColorCode = [72, 209, 204];
    let stateColorCode = [255,255,255];

    for (const regionCode of sortedRegions) {
        // Find subdivision data
        const regionDate = this.regiondepCurrdate.find(region => regionCode === region.r_code);
        const regionSeason = this.regiondepSeasondate.find(region => regionCode === region.r_code);

        const DateCat = this.constants.getColorAndCat(regionDate.departure);
        const SeasonCat = this.constants.getColorAndCat(regionSeason.departure);

        // Add Subdivision Row
        this.rows.push([
            { content: '', styles: { fillColor: subdivColorCode } },
            { content: `REGION : ${regionDate.name.toUpperCase()}`, styles: { fillColor: subdivColorCode } },
            { content: regionDate.actual_rainfall != null ? this.constants.trimToOneDecimals(regionDate.actual_rainfall) : ' ', styles: { fillColor: subdivColorCode } },
            { content: this.constants.trimToOneDecimals(parseFloat(regionDate.rainfall_normal_value)), styles: { fillColor: subdivColorCode } },
            { content: regionDate.departure != null ? this.constants.trimToZeroDecimals(regionDate.departure) : ' ', styles: { fillColor: subdivColorCode } },
            { content: DateCat.Cat, styles: { fillColor: DateCat.color } },
            { content: regionSeason.actual_rainfall != null ? this.constants.trimToOneDecimals(regionSeason.actual_rainfall) : ' ', styles: { fillColor: subdivColorCode } },
            { content: this.constants.trimToOneDecimals(parseFloat(regionSeason.rainfall_normal_value)), styles: { fillColor: subdivColorCode } },
            { content: regionSeason.departure != null ? this.constants.trimToZeroDecimals(regionSeason.departure) : ' ', styles: { fillColor: subdivColorCode } },
            { content: SeasonCat.Cat, styles: { fillColor: SeasonCat.color } }
        ]);

        // Process States within each Subdivision
        const states = groupedByRegion[regionCode];
        const sortedStates = Object.keys(states).sort((a, b) => a.localeCompare(b));

        let index = 1;
        for (const stateCode of sortedStates) {
            // Find state data
            const stateDate = this.statedepCurrdate.find(state => stateCode == state.state_code.toString());
            const stateSeason = this.statedepSeasondate.find(state => stateCode == state.state_code.toString());

            const DateCat = this.constants.getColorAndCat(stateDate.departure);
            const SeasonCat = this.constants.getColorAndCat(stateSeason.departure);

            // Add State Row
            this.rows.push([
                { content: index++, styles: { fillColor: stateColorCode } },
                { content: `${stateDate.state_name}`, styles: { fillColor: stateColorCode } },
                { content: stateDate.actual_state_rainfall != null ? this.constants.trimToOneDecimals(stateDate.actual_state_rainfall) : ' ', styles: { fillColor: stateColorCode } },
                { content: this.constants.trimToOneDecimals(parseFloat(stateDate.rainfall_normal_value)), styles: { fillColor: stateColorCode } },
                { content: stateDate.departure != null ? this.constants.trimToZeroDecimals(stateDate.departure) : ' ', styles: { fillColor: stateColorCode } },
                { content: DateCat.Cat, styles: { fillColor: DateCat.color } },
                { content: stateSeason.actual_state_rainfall != null ? this.constants.trimToOneDecimals(stateSeason.actual_state_rainfall) : ' ', styles: { fillColor: stateColorCode } },
                { content: this.constants.trimToOneDecimals(parseFloat(stateSeason.rainfall_normal_value)), styles: { fillColor: stateColorCode } },
                { content: stateSeason.departure != null ? this.constants.trimToZeroDecimals(stateSeason.departure) : ' ', styles: { fillColor: stateColorCode } },
                { content: SeasonCat.Cat, styles: { fillColor: SeasonCat.color } }
            ]);
        }
    }
    console.log(this.rows)
}

  // getColorAndCat(departure: any) {

  //   let color = ''
  //   let Cat = ''

  //   if(departure==null){
  //     return {
  //       color:'#c0c0c0',
  //       Cat : 'ND'
  //     }
  //   }

  //   if(departure>=60){
  //     Cat = 'LE'
  //     color = '#0096ff'
  //   }
  //   else if(departure >= 20 && departure <= 59){
  //     Cat = 'E'
  //     color = '#32c0f8'
  //   }    
  //   else if(departure >= -19 &&  departure<= +19){
  //     Cat = 'N'
  //     color = '#00cd5b'
  //   }    
  //   else if(departure>= -59 && departure <= -20){
  //     Cat = 'D'
  //     color = '#ff2700'
  //   }    
  //   else if(departure >= -99 && departure<= -60){
  //     Cat = 'LD'
  //     color = '#ffff20'
  //   }    
  //   else if(departure= -100){
  //     Cat = 'NR'
  //     color = '#ffffff'
  //   }

  //   return {
  //     color : color,
  //     Cat : Cat
  //   };
  // }
}