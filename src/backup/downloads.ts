import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, concatMap } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Constants } from 'src/app/services/constants';
import autoTable, { Column } from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Injectable({
  providedIn: 'root'
})

export class DownloadPdf {

  private baseUrl: string = environment.baseUrl;

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

  updateanddownloadpdf(){
    const currDate = new Date();
    this.data = this.constants.getRangeFromDateRange();
    this.seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodate(currDate);
    this.updateCurrDateData(this.data, this.seasonPeriodDate)
  }


  async updateCurrDateData(data:any, seasonPeriodDate:any ){

    this.fetchDistrictData(data).pipe(
      concatMap(districtData => {
        this.districtdepCurrdate = districtData.data;
        console.log('indownloading---->',this.districtdepCurrdate)
        return this.fetchStateData(data);
      }),
      concatMap(stateData => {
        this.statedepCurrdate = stateData.data;
        console.log('indownloading---->',this.statedepCurrdate)
        return this.fetchSubdivData(data);
      }),
      concatMap(subdiv => {
        this.subdivdepCurrdate = subdiv.data;
        console.log('indownloading---->',this.subdivdepCurrdate)
        return this.fetchDistrictData(seasonPeriodDate); // or any observable to complete the chain
      }),

      concatMap(seasondistrictData => {
        this.districtdepSeasondate = seasondistrictData.data;
        console.log('indownloading---->',this.districtdepSeasondate)

        return this.fetchStateData(seasonPeriodDate);
      }),    
      concatMap(seasonstateData => {
        this.statedepSeasondate = seasonstateData.data;
        console.log('indownloading---->', this.statedepSeasondate, this.subdivdepSeasondate)

        return this.fetchSubdivData(seasonPeriodDate);
      }),    
      concatMap(seasonstateData => {
        this.subdivdepSeasondate = seasonstateData.data;
        console.log('indownloading---->',this.subdivdepSeasondate)
        this.downloadPdf()
        return EMPTY;
      }),
    ).subscribe(
      () => { },
      (error:any) => console.error('Error fetching data:', error)
    );
  }

  fetchDistrictData(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchDistrictData`;
    return this.http.post<any>(url, data);
  }

  fetchStateData(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchStateData`;
    return this.http.post<any>(url, data);
  }

  fetchSubdivData(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/v1/fetchSubDivisionData`;
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

    const columns1 = ['', '', 
      {
        content : `Selected Date ${this.data.startDate} to ${this.data.endDate}`, colSpan:4
      },
      {
        content : `Present Season ${this.seasonPeriodDate.startDate} to ${this.seasonPeriodDate.endDate}`, colSpan:4
      },
    ]
    const columns1forexcel = ['', '',
    {
      content : `Selected Date ${this.data.startDate} to ${this.data.endDate}`, colSpan:4
    }, '', '', '',    
    {
      content : `Present Season ${this.seasonPeriodDate.startDate} to ${this.seasonPeriodDate.endDate}`, colSpan:4
    }]

    const columns = ['S.No', 'MET.SUBDIVISION/UT/STATE/DISTRICT', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.'];

        
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
    const headingText1 = 'COUNTRY AS WHOLE RAINFALL DISTRIBUTION';
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

    setTimeout(()=>{
      doc.save(filename);
      this.exportAsExcelFile(newArr, `DISTRICT_RAINFALL_DISTRIBUTION_COUNTRY_INDIA_cd`, columns, newcolumns1);
    },15000)
    
   
  
  }

  private loadTheRows(){
    console.log('bfore reducing',this.districtdepCurrdate)
    const groupedBySubDivision = this.districtdepCurrdate.reduce((acc, item) => {
      const subDivision = item.sub_division_code;
      const state = item.state_code;
  
      if (!acc[subDivision]) {
          acc[subDivision] = {};
      }
  
      if (!acc[subDivision][state]) {
          acc[subDivision][state] = [];
      }
        acc[subDivision][state].push({
      });
      return acc;
  }, {});

    let subdivColorCode = [72,209,204]
    let stateColorCode = [238,130,238]

    for (const key in groupedBySubDivision) {

      const subdivisionDate = this.subdivdepCurrdate.find(subdiv => key === subdiv.s_code);
      const subdivisionSeason = this.subdivdepSeasondate.find(subdiv => key === subdiv.s_code);

      const DateCat = this.getColorAndCat(subdivisionDate.departure)
      const SeasonCat = this.getColorAndCat(subdivisionSeason.departure)

      this.rows.push(
        [
          {content : '', styles: { fillColor: subdivColorCode }},
          {content : `SUBDIVISION : ${subdivisionDate.state_name.toUpperCase()}`, styles: { fillColor: subdivColorCode }},
          {content : 
            subdivisionDate.actual_subdiv_rainfall!=null?
            subdivisionDate.actual_subdiv_rainfall.toFixed(2):
            // subdivisionDate.actual_subdiv_rainfall, 
            ' ',
            styles: { fillColor: subdivColorCode }},
          {content : subdivisionDate.rainfall_normal_value, styles: { fillColor: subdivColorCode }},
          {content : 
            subdivisionDate.departure!=null?
            subdivisionDate.departure.toFixed(2):
            // subdivisionDate.departure, 
            ' ',
            styles: { fillColor: subdivColorCode }},
          {content : DateCat.Cat, styles: { fillColor: DateCat.color }},

          {content : 
            subdivisionSeason.actual_subdiv_rainfall!=null?
            subdivisionSeason.actual_subdiv_rainfall.toFixed(2):
            // subdivisionSeason.actual_subdiv_rainfall, 
            ' ',
            styles: { fillColor: subdivColorCode }},
          {content : subdivisionSeason.rainfall_normal_value, styles: { fillColor: subdivColorCode }},
          {content : 
            subdivisionSeason.departure!=null?
            subdivisionSeason.departure.toFixed(2):
            // subdivisionSeason.departure,
            ' ', 
            styles: { fillColor: subdivColorCode }},
          {content : SeasonCat.Cat, styles: { fillColor: SeasonCat.color }},
        ]
      )

      let subdivisionObj = groupedBySubDivision[key]

      for(const stateKey in subdivisionObj){

        const stateDate = this.statedepCurrdate.filter(state => stateKey == state.state_code.toString())[0];
        const stateSeason = this.statedepSeasondate.filter(state => stateKey == state.state_code.toString())[0];

        const DateCat = this.getColorAndCat(stateDate.departure)
        const SeasonCat = this.getColorAndCat(stateSeason.departure)
        this.rows.push(
          [
            {content : '', styles: { fillColor: stateColorCode }},
            {content : `STATE : ${stateDate.state_name}`, styles: { fillColor: stateColorCode }},
            {content : 
              stateDate.actual_state_rainfall!=null?
              stateDate.actual_state_rainfall.toFixed(2):
              // stateDate.actual_state_rainfall, 
              ' ',
              styles: { fillColor: stateColorCode }},
            {content : stateDate.rainfall_normal_value, styles: { fillColor: stateColorCode }},
            {content : 
              stateDate.departure!=null?
              stateDate.departure.toFixed(2):
              // stateDate.departure,
              ' ',
              styles: { fillColor: stateColorCode }},
            {content : DateCat.Cat, styles: { fillColor: DateCat.color }},

            {content : 
              stateSeason.actual_state_rainfall!=null?
              stateSeason.actual_state_rainfall.toFixed(2):
              // stateSeason.actual_state_rainfall, 
              ' ',
              styles: { fillColor: stateColorCode }},
            {content : stateSeason.rainfall_normal_value, styles: { fillColor: stateColorCode }},
            {content : 
              stateSeason.departure!=null?
              stateSeason.departure.toFixed(2):
              // stateSeason.departure, 
              ' ',
              styles: { fillColor: stateColorCode }},
            {content : SeasonCat.Cat, styles: { fillColor: SeasonCat.color }},
          ]
        )
        let allTheDistrictsFromdistrictdepCurrdate = this.districtdepCurrdate .filter(Districtobj => stateKey == Districtobj.state_code.toString());
        let allTheDistrictsFromdistrictdepSeasondate = this.districtdepSeasondate .filter(Districtobj => stateKey == Districtobj.state_code.toString());


        for(let i=0; i<allTheDistrictsFromdistrictdepCurrdate.length; i++){

          const DateCat = this.getColorAndCat(allTheDistrictsFromdistrictdepCurrdate[i].departure)
          const SeasonCat = this.getColorAndCat(allTheDistrictsFromdistrictdepSeasondate[i].departure)
          console.log(allTheDistrictsFromdistrictdepCurrdate[i].departure)
          this.rows.push(
            [
              i+1, 
              allTheDistrictsFromdistrictdepCurrdate[i].district_name, 
                allTheDistrictsFromdistrictdepCurrdate[i].actual_rainfall!=null ? 
                allTheDistrictsFromdistrictdepCurrdate[i].actual_rainfall.toFixed(2) : 
                ' ',
                // allTheDistrictsFromdistrictdepCurrdate[i].actual_rainfall, 
              allTheDistrictsFromdistrictdepCurrdate[i].normal_rainfall, 
                allTheDistrictsFromdistrictdepCurrdate[i].departure!=null ? 
                allTheDistrictsFromdistrictdepCurrdate[i].departure.toFixed(2) : 
                ' ',
                // allTheDistrictsFromdistrictdepCurrdate[i].departure,
              {content : DateCat.Cat, styles: { fillColor: DateCat.color }},
    
                allTheDistrictsFromdistrictdepSeasondate[i].actual_rainfall!=null ? 
                allTheDistrictsFromdistrictdepSeasondate[i].actual_rainfall.toFixed(2) : 
                ' ',
                // allTheDistrictsFromdistrictdepSeasondate[i].actual_rainfall,
              allTheDistrictsFromdistrictdepSeasondate[i].normal_rainfall, 
                allTheDistrictsFromdistrictdepSeasondate[i].departure!=null ? 
                allTheDistrictsFromdistrictdepSeasondate[i].departure.toFixed(2) :
                ' ', 
                // allTheDistrictsFromdistrictdepSeasondate[i].departure,
              {content : SeasonCat.Cat, styles: { fillColor: SeasonCat.color }},
            ]
          )
        }
      }
      
    }
    return []
  }


  getColorAndCat(departure: any) {

    let color = ''
    let Cat = ''

    if(departure==null){
      return {
        color:'#c0c0c0',
        Cat : 'ND'
      }
    }

    if(departure>=60){
      Cat = 'LE'
      color = '#0096ff'
    }
    else if(departure >= 20 && departure <= 59){
      Cat = 'E'
      color = '#32c0f8'
    }    
    else if(departure >= -19 &&  departure<= +19){
      Cat = 'N'
      color = '#00cd5b'
    }    
    else if(departure>= -59 && departure <= -20){
      Cat = 'D'
      color = '#ff2700'
    }    
    else if(departure >= -99 && departure<= -60){
      Cat = 'LD'
      color = '#ffff20'
    }    
    else if(departure= -100){
      Cat = 'NR'
      color = '#ffffff'
    }

    return {
      color : color,
      Cat : Cat
    };
  }
}