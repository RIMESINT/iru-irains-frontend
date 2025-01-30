import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, concatMap, lastValueFrom } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Constants } from '../constants';
import autoTable, { Column } from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Injectable({
  providedIn: 'root'
})

export class DownloadPdf {

  private baseUrl: string = environment.baseUrl;
  isView : boolean = false

  districtdepCurrdate: any[] = [];
  statedepCurrdate: any[] = [];
  subdivdepCurrdate: any[] = [];

  districtdepSeasondate: any[] = [];
  statedepSeasondate: any[] = [];
  subdivdepSeasondate: any[] = [];

  rows :any[][] = [];
  data: any;
  seasonPeriodDate: any;

  constructor(private http: HttpClient, private constants: Constants) {
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
    console.log('custom date download', fromDate, toDate)
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









  
  
  async updateCurrDateData(data: any, seasonPeriodDate: any) {
    try {
      await lastValueFrom(
        this.fetchDistrictData(data).pipe(
          concatMap(districtData => {
            this.districtdepCurrdate = districtData.data;
            console.log('indownloading---->', this.districtdepCurrdate);
            return this.fetchStateData(data);
          }),
          concatMap(stateData => {
            this.statedepCurrdate = stateData.data;
            console.log('indownloading---->', this.statedepCurrdate);
            return this.fetchSubdivData(data);
          }),
          concatMap(subdiv => {
            this.subdivdepCurrdate = subdiv.data;
            console.log('indownloading---->', this.subdivdepCurrdate);
            return this.fetchDistrictData(seasonPeriodDate); // or any observable to complete the chain
          }),
          concatMap(seasondistrictData => {
            this.districtdepSeasondate = seasondistrictData.data;
            console.log('indownloading---->', this.districtdepSeasondate);
            return this.fetchStateData(seasonPeriodDate);
          }),    
          concatMap(seasonstateData => {
            this.statedepSeasondate = seasonstateData.data;
            console.log('indownloading---->', this.statedepSeasondate, this.subdivdepSeasondate);
            return this.fetchSubdivData(seasonPeriodDate);
          }),    
          concatMap(seasonstateData => {
            this.subdivdepSeasondate = seasonstateData.data;
            console.log('indownloading---->', this.subdivdepSeasondate);
            this.downloadPdf();
            return EMPTY;
          })
        )
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  async updateCurrDateDataFromDataEntry(data: any, seasonPeriodDate: any) {

    console.log('updateCurrDateDataFromDataEntry DATA', data);
    try {
      await lastValueFrom(
        this.fetchDistrictDataFromDataEntry(data).pipe(
          concatMap(districtData => {
            this.districtdepCurrdate = districtData.data;
            console.log('indownloading---->', this.districtdepCurrdate);
            return this.fetchStateDataFromDataEntry(data);
          }),
          concatMap(stateData => {
            this.statedepCurrdate = stateData.data;
            console.log('indownloading---->', this.statedepCurrdate);
            return this.fetchSubdivDataFromDataEntry(data);
          }),
          concatMap(subdiv => {
            this.subdivdepCurrdate = subdiv.data;
            console.log('indownloading---->', this.subdivdepCurrdate);
            return this.fetchDistrictDataFromDataEntry(seasonPeriodDate); // or any observable to complete the chain
          }),
          concatMap(seasondistrictData => {
            this.districtdepSeasondate = seasondistrictData.data;
            console.log('indownloading---->', this.districtdepSeasondate);
            return this.fetchStateDataFromDataEntry(seasonPeriodDate);
          }),    
          concatMap(seasonstateData => {
            this.statedepSeasondate = seasonstateData.data;
            console.log('indownloading---->', this.statedepSeasondate, this.subdivdepSeasondate);
            return this.fetchSubdivDataFromDataEntry(seasonPeriodDate);
          }),    
          concatMap(seasonstateData => {
            this.subdivdepSeasondate = seasonstateData.data;
            console.log('indownloading---->', this.subdivdepSeasondate);
            this.downloadPdf();
            return EMPTY;
          })
        )
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  fetchDistrictDataFromDataEntry(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchDistrictData`;
    return this.http.post<any>(url, data);
  }

  fetchStateDataFromDataEntry(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchStateData`;
    return this.http.post<any>(url, data);
  }

  fetchSubdivDataFromDataEntry(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchSubDivisionData`;
    return this.http.post<any>(url, data);
  }

  fetchDistrictData(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchDistrictDataFtp`;
    return this.http.post<any>(url, data);
  }

  fetchStateData(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchStateDataFtp`;
    return this.http.post<any>(url, data);
  }

  fetchSubdivData(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchSubDivisionDataFtp`;
    return this.http.post<any>(url, data);
  }

  getData(){
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

    console.log('ssssss', this.data.startDate, typeof this.data.startDate,  this.data.endDate, this.data.startDate==this.data.endDate);

    // Adjust season dates based on this.data.startDate to set the seasonal period
      const seasonRange = this.adjustSeasonForRange(this.data.startDate, this.data.endDate);
  
    // Set the season period start and end dates
     this.seasonPeriodDate.startDate = seasonRange.startDate;
     this.seasonPeriodDate.endDate = seasonRange.endDate;

    const columns1 = ['', '', 
      // {
      // content : this.data.startDate==this.data.endDate ? `DAY: ${this.convertToIndianDateFormat(this.data.startDate)}`:`DAY: ${this.convertToIndianDateFormat(this.data.startDate)} to ${this.convertToIndianDateFormat(this.data.endDate)}`, colSpan:4
      // },

      {
        content: this.data.startDate === this.data.endDate ? `DAY: ${this.convertToIndianDateFormat(this.data.startDate)}`: `DAY: ${this.convertToIndianDateFormat(this.data.startDate)} to ${this.convertToIndianDateFormat(this.data.endDate)}`, 
         colSpan: 4
      },

      {
        content : `PERIOD: ${this.convertToIndianDateFormat(this.seasonPeriodDate.startDate)} to ${(this.seasonPeriodDate.startDate, this.seasonPeriodDate.endDate)}`, colSpan:4
      },
      
    ]
    const columns1forexcel = ['', '',
    {
      content : this.data.startDate==this.data.endDate ? `DAY: ${this.convertToIndianDateFormat(this.data.startDate)}`:`DAY: ${this.convertToIndianDateFormat(this.data.startDate)} to ${this.convertToIndianDateFormat(this.data.endDate)}`, colSpan:4
    }, '', '', '',    
    {
      content : `PERIOD: ${this.convertToIndianDateFormat(this.seasonPeriodDate.startDate)} to ${(this.seasonPeriodDate.startDate, this.seasonPeriodDate.endDate)}`, colSpan:4
    }]

    const columns = ['S.No', 'MET.SUBDIVISION/UT/STATE/DISTRICT', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.'];

    this.loadTheRows();

    var newArr = this.rows.map((subArr) => {
      return subArr.map((item:any) => {
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
    const headingText1 = 'DISTRICT RAINFALL DISTRIBUTION';
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
    const filename = `DISTRIBUTION_DISTRICT_INDIA_cd.pdf`;

    if(this.isView){
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    }else{
      setTimeout(()=>{
        doc.save(filename);
        this.exportAsExcelFile(newArr, `DISTRICT_RAINFALL_DISTRIBUTION_COUNTRY_INDIA_cd`, columns, newcolumns1);
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

  getSeason(startDate: any): string {
    // Ensure startDate is a Date object
    if (!(startDate instanceof Date)) {
      startDate = new Date(startDate);
    }
    
    // Check if startDate is a valid date after conversion
    if (isNaN(startDate.getTime())) {
      throw new Error("Invalid date format provided to getSeason");
    }
  
    const month = startDate.getMonth(); // January is 0, December is 11
  
    if (month >= 0 && month <= 1) {
      return 'Jan-Feb';
    } else if (month >= 2 && month <= 4) {
      return 'Mar-May';
    } else if (month >= 5 && month <= 8) {
      return 'Jun-Sep';
    } else if (month >= 9 && month <= 11) {
      return 'Oct-Dec';
    }
    return '';
  }

  parseDate(date: any): Date {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
    
    // Attempt to parse if the date is a string
    if (typeof date === 'string') {
      // Use regular expression to validate the format YYYY-MM-DD
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (datePattern.test(date)) {
        return new Date(date);
      }
    }
  
    throw new Error("Invalid date format");
  }

  adjustSeasonForRange(startDate: any, endDate: any): { season: string, startDate: string, endDate: string } {
    // Parse and validate dates using the parseDate function

    console.log(startDate, endDate);
    startDate = this.parseDate(startDate);
    endDate = this.parseDate(endDate);
  
    console.log('startDate', startDate);
    console.log('endDate', endDate);
  
    const season = this.getSeason(startDate);
  
    let seasonStartDate: Date;
    let seasonEndDate: Date;
  
    switch (season) {
      case 'Jan-Feb':
        seasonStartDate = new Date(startDate.getFullYear(), 0, 1);
        seasonEndDate = new Date(startDate.getFullYear(), 1, 28);
        break;
      case 'Mar-May':
        seasonStartDate = new Date(startDate.getFullYear(), 2, 1);
        seasonEndDate = new Date(startDate.getFullYear(), 4, 31);
        break;
      case 'Jun-Sep':
        seasonStartDate = new Date(startDate.getFullYear(), 5, 1);
        seasonEndDate = new Date(startDate.getFullYear(), 8, 30);
        break;
      case 'Oct-Dec':
        seasonStartDate = new Date(startDate.getFullYear(), 9, 1);
        seasonEndDate = new Date(startDate.getFullYear(), 11, 31);
        break;
      default:
        seasonStartDate = startDate;
        seasonEndDate = endDate;
    }
  
    return {
      season,
      startDate: this.formatDate(seasonStartDate),
      endDate: this.formatDate(seasonEndDate),
    };
  }


  private loadTheRows() {
    // Group by Subdivision and then State
    this.rows = []
    const groupedBySubDivision = this.districtdepCurrdate.reduce((acc, item) => {
        const subDivision = item.sub_division_code;
        const subDivName = item.subdiv_name;
        const state = item.state_code;

        if (!acc[subDivision]) {
            acc[subDivision] = {};
        }

        if (!acc[subDivision][state]) {
            acc[subDivision][state] = [];
        }
        
        acc[subDivision][state].push(item);
        return acc;
    }, {});

    const subdivNames = this.subdivdepCurrdate.map((x:any)=> [x.s_code, x.subdiv_name])
    // const sortedSubDivisions = Object.keys(groupedBySubDivision).sort((a, b) => a.localeCompare(b));
    // console.group('heygeyye', groupedBySubDivision, sortedSubDivisions, subdivNames)
    // Create a mapping of codes to names
    const codeToNameMap = new Map(subdivNames.map(([code, name]) => [code, name]));
    const sortedSubDivisions = Object.keys(groupedBySubDivision).sort((a, b) => {
        const nameA = codeToNameMap.get(a) || '';
        const nameB = codeToNameMap.get(b) || '';
        return nameA.localeCompare(nameB);
    });

    console.group('heygeyye', groupedBySubDivision, sortedSubDivisions, subdivNames);
    let subdivColorCode = [72, 209, 204];
    let stateColorCode = [238, 130, 238];

    for (const subDivCode of sortedSubDivisions) {

        const subdivisionDate = this.subdivdepCurrdate.find(subdiv => subDivCode === subdiv.s_code);
        const subdivisionSeason = this.subdivdepSeasondate.find(subdiv => subDivCode === subdiv.s_code);

        const DateCat = this.constants.getColorAndCat(subdivisionDate.departure);
        const SeasonCat = this.constants.getColorAndCat(subdivisionSeason.departure);



        this.rows.push([
            { content: '', styles: { fillColor: subdivColorCode } },
            { content: `SUBDIVISION : ${subdivisionDate.subdiv_name}`, styles: { fillColor: subdivColorCode } },
            { content: subdivisionDate.actual_subdiv_rainfall != null ? this.constants.trimToOneDecimals(subdivisionDate.actual_subdiv_rainfall) : ' ', styles: { fillColor: subdivColorCode } },
            { content: this.constants.trimToOneDecimals(parseFloat(subdivisionDate.rainfall_normal_value)), styles: { fillColor: subdivColorCode } },
            { content: subdivisionDate.departure != null ? this.constants.trimToZeroDecimals(subdivisionDate.departure) : ' ', styles: { fillColor: subdivColorCode } },
            { content: DateCat.Cat, styles: { fillColor: DateCat.color } },
            { content: subdivisionSeason.actual_subdiv_rainfall != null ? this.constants.trimToOneDecimals(subdivisionSeason.actual_subdiv_rainfall) : ' ', styles: { fillColor: subdivColorCode } },
            { content: this.constants.trimToOneDecimals(parseFloat(subdivisionSeason.rainfall_normal_value)), styles: { fillColor: subdivColorCode } },
            { content: subdivisionSeason.departure != null ? this.constants.trimToZeroDecimals(subdivisionSeason.departure) : ' ', styles: { fillColor: subdivColorCode } },
            { content: SeasonCat.Cat, styles: { fillColor: SeasonCat.color } }
        ]);

        const states = groupedBySubDivision[subDivCode];
        const sortedStates = Object.keys(states).sort((a, b) => a.localeCompare(b));

        for (const stateCode of sortedStates) {
            const stateDate = this.statedepCurrdate.find(state => stateCode == state.state_code.toString());
            const stateSeason = this.statedepSeasondate.find(state => stateCode == state.state_code.toString());

            const DateCat = this.constants.getColorAndCat(stateDate.departure);
            const SeasonCat = this.constants.getColorAndCat(stateSeason.departure);

            this.rows.push([
                { content: '', styles: { fillColor: stateColorCode } },
                { content: `STATE : ${stateDate.state_name}`, styles: { fillColor: stateColorCode } },
                { content: stateDate.actual_state_rainfall != null ? this.constants.trimToOneDecimals(stateDate.actual_state_rainfall) : ' ', styles: { fillColor: stateColorCode } },
                { content: this.constants.trimToOneDecimals(parseFloat(stateDate.rainfall_normal_value)), styles: { fillColor: stateColorCode } },
                { content: stateDate.departure != null ? this.constants.trimToZeroDecimals(stateDate.departure) : ' ', styles: { fillColor: stateColorCode } },
                { content: DateCat.Cat, styles: { fillColor: DateCat.color } },
                { content: stateSeason.actual_state_rainfall != null ? this.constants.trimToOneDecimals(stateSeason.actual_state_rainfall) : ' ', styles: { fillColor: stateColorCode } },
                { content: this.constants.trimToOneDecimals(parseFloat(stateSeason.rainfall_normal_value)), styles: { fillColor: stateColorCode } },
                { content: stateSeason.departure != null ? this.constants.trimToZeroDecimals(stateSeason.departure) : ' ', styles: { fillColor: stateColorCode } },
                { content: SeasonCat.Cat, styles: { fillColor: SeasonCat.color } }
            ]);

            // Sort Districts within each State
            const districtsCurrDate = states[stateCode];
            const sortedDistrictsCurrDate = districtsCurrDate.sort((a:any, b:any) => a.district_name.localeCompare(b.district_name));

            for (let i = 0; i < sortedDistrictsCurrDate.length; i++) {
                const districtDate = sortedDistrictsCurrDate[i];
                const districtSeason = this.districtdepSeasondate.find(district => district.district_code == districtDate.district_code);

                const DateCat = this.constants.getColorAndCat(districtDate.departure);
                const SeasonCat = this.constants.getColorAndCat(districtSeason?.departure);

                // Add District Row
                this.rows.push([
                    i + 1,
                    districtDate.district_name,
                    districtDate.actual_rainfall != null ? this.constants.trimToOneDecimals(districtDate.actual_rainfall) : ' ',
                    this.constants.trimToOneDecimals(parseFloat(districtDate.normal_rainfall)),
                    districtDate.departure != null ? this.constants.trimToZeroDecimals(districtDate.departure) : ' ',
                    { content: DateCat.Cat, styles: { fillColor: DateCat.color } },
                    districtSeason?.actual_rainfall != null ? this.constants.trimToOneDecimals(districtSeason.actual_rainfall) : ' ',
                    this.constants.trimToOneDecimals(parseFloat(districtSeason?.normal_rainfall)),
                    districtSeason?.departure != null ? this.constants.trimToZeroDecimals(districtSeason.departure) : ' ',
                    { content: SeasonCat.Cat, styles: { fillColor: SeasonCat.color } }
                ]);
            }
        }
    }
}



  // constants.getColorAndCat(departure: any) {

    

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