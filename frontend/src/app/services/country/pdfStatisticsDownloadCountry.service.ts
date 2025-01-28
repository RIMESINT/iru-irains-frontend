import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, concatMap, lastValueFrom } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Constants } from '../constants';
import autoTable, { Column } from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { RegionService } from '../region/region.service';
import { CountryService } from './country.service';


@Injectable({
  providedIn: 'root'
})

export class CountryDownloadStatistics {

  private baseUrl: string = environment.baseUrl;
  isView : boolean = false;

  countrydepCurrdate: any[] = [];
  countrydepSeasondate: any[] = [];

  rows :any[][] = [];
  data: any;
  seasonPeriodDate: any;

  constructor(private http: HttpClient, private constants: Constants, private counrtryService : CountryService) {
  }

  convertToIndianDateFormat = (dateString: string) => dateString.split('-').reverse().join('-');

  async updateanddownloadpdf(){
    const currDate = new Date();
    this.data = this.constants.getRangeFromDateRange();
    this.seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodate(currDate);
    await this.updateCurrDateData(this.data, this.seasonPeriodDate)
  }


  async updateandViewpdf(){
    this.isView = true
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










  


  async updateCurrDateData(data:any, seasonPeriodDate:any ){

    try{
      await lastValueFrom(
        this.counrtryService.fetchDataFtp(data).pipe(
          concatMap(country => {
            this.countrydepCurrdate = country.data;
            console.log('indownloading---->',this.countrydepCurrdate)
            return this.counrtryService.fetchDataFtp(seasonPeriodDate);
          }),
    
          concatMap(seasoncountryData => {
            this.countrydepSeasondate = seasoncountryData.data;
            console.log('indownloading---->', this.countrydepSeasondate)
            this.downloadPdf()
            return EMPTY
          }),
    
        )
      )
    } catch (error) {
        console.error('Error fetching data:', error);
    }




    // this.counrtryService.fetchDataFtp(data).pipe(
    //   concatMap(country => {
    //     this.countrydepCurrdate = country.data;
    //     console.log('indownloading---->',this.countrydepCurrdate)
    //     return this.counrtryService.fetchDataFtp(seasonPeriodDate);
    //   }),

    //   concatMap(seasoncountryData => {
    //     this.countrydepSeasondate = seasoncountryData.data;
    //     console.log('indownloading---->', this.countrydepSeasondate)
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
        this.counrtryService.fetchData(data).pipe(
          concatMap(country => {
            this.countrydepCurrdate = country.data;
            console.log('indownloading---->',this.countrydepCurrdate)
            return this.counrtryService.fetchData(seasonPeriodDate);
          }),
    
          concatMap(seasoncountryData => {
            this.countrydepSeasondate = seasoncountryData.data;
            console.log('indownloading---->', this.countrydepSeasondate)
            this.downloadPdf()
            return EMPTY
          }),
    
        )
      )
    } catch (error) {
        console.error('Error fetching data:', error);
    }




    // this.counrtryService.fetchDataFtp(data).pipe(
    //   concatMap(country => {
    //     this.countrydepCurrdate = country.data;
    //     console.log('indownloading---->',this.countrydepCurrdate)
    //     return this.counrtryService.fetchDataFtp(seasonPeriodDate);
    //   }),

    //   concatMap(seasoncountryData => {
    //     this.countrydepSeasondate = seasoncountryData.data;
    //     console.log('indownloading---->', this.countrydepSeasondate)
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
    
    const startCell = 'C1'; // Start cell for the first merge
    const endCell = 'F1'; // End cell for the first merge
    const startCell1 = 'G1'; // Start cell for the second merge
    const endCell1 = 'J1'; // End cell for the second merge

    // Merge the cells
    worksheet['!merges'] = [
        { s: XLSX.utils.decode_cell(startCell), e: XLSX.utils.decode_cell(endCell) },
        { s: XLSX.utils.decode_cell(startCell1), e: XLSX.utils.decode_cell(endCell1) }
    ];

    XLSX.utils.sheet_add_aoa(worksheet, [columns1], { origin: 'A1' });

    XLSX.utils.sheet_add_aoa(worksheet, [columns], { origin: 'A2' });

    XLSX.utils.sheet_add_json(worksheet, json, { origin: 'A3', skipHeader: true });

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

  
  public async downloadPdf(){

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

    const columns = ['S.No', 'REGION', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.'];

        
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

    console.log('amma boabi', newArr, columns, newcolumns1)

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
    const headingText1 = 'COUNTRY RAINFALL DISTRIBUTION';
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
    const filename = `DISTRIBUTION_COUNTRY_INDIA_cd.pdf`;


    if(this.isView){
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    }else{
      setTimeout(()=>{
        doc.save(filename);
        this.exportAsExcelFile(newArr, `COUNTRY_RAINFALL_DISTRIBUTION_INDIA_cd`, columns, newcolumns1);
      },3000)
    }

    
   
  
  }

  getAdjustedEndDate(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If the start and end dates fall in different months
    if (start.getMonth() !== end.getMonth()) {
      // Get the last day of the start month
      const lastDayOfMonth = new Date(
        start.getFullYear(),
        start.getMonth() + 1,
        0
      );

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
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero for single-digit days

    return `${year}-${month}-${day}`;
  }

  private loadTheRows() {

    this.rows = []

    let countryColorCode = [255,255,255];

    let index = 1;

        // Find subdivision data
    const countryDate = this.countrydepCurrdate[0];
    const countrySeason = this.countrydepSeasondate[0];

    const DateCat = this.constants.getColorAndCat(countryDate.departure);
    const SeasonCat = this.constants.getColorAndCat(countrySeason.departure);

    // Add Subdivision Row
    this.rows.push([
        { content: index++, styles: { fillColor: countryColorCode } },
        { content: `${countryDate.name.toUpperCase()}`, styles: { fillColor: countryColorCode } },
        { content: countryDate.actual_rainfall != null ? this.constants.trimToOneDecimals(countryDate.actual_rainfall) : ' ', styles: { fillColor: countryColorCode } },
        { content: countryDate.rainfall_normal_value, styles: { fillColor: countryColorCode } },
        { content: countryDate.departure != null ? this.constants.trimToZeroDecimals(countryDate.departure) : ' ', styles: { fillColor: countryColorCode } },
        { content: DateCat.Cat, styles: { fillColor: DateCat.color } },
        { content: countrySeason.actual_rainfall != null ? this.constants.trimToOneDecimals(countrySeason.actual_rainfall) : ' ', styles: { fillColor: countryColorCode } },
        { content: countrySeason.rainfall_normal_value, styles: { fillColor: countryColorCode } },
        { content: countrySeason.departure != null ? this.constants.trimToZeroDecimals(countrySeason.departure) : ' ', styles: { fillColor: countryColorCode } },
        { content: SeasonCat.Cat, styles: { fillColor: SeasonCat.color } }
    ]);
    

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