import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Constants } from '../constants';
import autoTable, { Column } from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { ContentObserver } from '@angular/cdk/observers';
import { state } from '@angular/animations';
import { Color } from 'highcharts';

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

  rows :any[] = [];


  constructor(private http: HttpClient, private constants: Constants) {
    const currDate = new Date();
    const seasonPeriodDate = this.constants.getCurrentMonthSeasonFromAndTodate(currDate);

    let data = {
      startDate: seasonPeriodDate.startDate,
      endDate: currDate
    }

    this.updateCurrDateData(data);
    this.updateSeasonDateData(seasonPeriodDate);
  }


  updateCurrDateData(data:any){
    this.fetchDistrictData(data).subscribe(res => {
      this.districtdepCurrdate = res.data;
      console.log('district date->', this.districtdepCurrdate)
    });

    this.fetchStateData(data).subscribe(res => {
      this.statedepCurrdate = res.data;
    });

    this.fetchSubdivData(data).subscribe(res => {
      this.subdivdepCurrdate = res.data;
    });
  }


  updateSeasonDateData(data:any){
    this.fetchDistrictData(data).subscribe(res => {
      this.districtdepSeasondate = res.data;
    });

    this.fetchStateData(data).subscribe(res => {
      this.statedepSeasondate = res.data;
    });

    this.fetchSubdivData(data).subscribe(res => {
      this.subdivdepSeasondate = res.data;
      console.log('subdivdepSeasondate season->', this.subdivdepSeasondate)

    });

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
    console.log('+++++++++')
    console.log(this.districtdepCurrdate)
    console.log(this.statedepCurrdate)

    console.log(this.subdivdepCurrdate)

    console.log(this.districtdepSeasondate)

    console.log(this.statedepSeasondate)

    console.log(this.subdivdepSeasondate)
  }




  public downloadPdf() {
    console.log('downloading starung')
    const columns1 = ['', '', 
      {
        content : '239u9u34', colSpan:4},
      {
        content : 'Manu', colSpan:4
      },
    ]

    const columns = ['S.No', 'MET.SUBDIVISION/UT/STATE/DISTRICT', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.'];

        

    this.loadTheRows();

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
    // const options2: any = {
    //   startY: doc.autoTable.previous.finalY + 10, // Start below the first table
    //   margin: { left: marginLeft },
    // };
    
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
    doc.save(filename);
  
  }

  

  private getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }



  private loadTheRows(){

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
          {content : subdivisionDate.actual_subdiv_rainfall.toFixed(2), styles: { fillColor: subdivColorCode }},
          {content : subdivisionDate.rainfall_normal_value, styles: { fillColor: subdivColorCode }},
          {content : subdivisionDate.departure.toFixed(2), styles: { fillColor: subdivColorCode }},
          {content : DateCat.Cat, styles: { fillColor: DateCat.color }},

          {content : subdivisionSeason.actual_subdiv_rainfall.toFixed(2), styles: { fillColor: subdivColorCode }},
          {content : subdivisionSeason.rainfall_normal_value, styles: { fillColor: subdivColorCode }},
          {content : subdivisionSeason.departure.toFixed(2), styles: { fillColor: subdivColorCode }},
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
            {content : stateDate.actual_state_rainfall.toFixed(2), styles: { fillColor: stateColorCode }},
            {content : stateDate.rainfall_normal_value, styles: { fillColor: stateColorCode }},
            {content : stateDate.departure.toFixed(2), styles: { fillColor: stateColorCode }},
            {content : DateCat.Cat, styles: { fillColor: DateCat.color }},

            {content : stateSeason.actual_state_rainfall.toFixed(2), styles: { fillColor: stateColorCode }},
            {content : stateSeason.rainfall_normal_value, styles: { fillColor: stateColorCode }},
            {content : stateSeason.departure.toFixed(2), styles: { fillColor: stateColorCode }},
            {content : SeasonCat.Cat, styles: { fillColor: SeasonCat.color }},
          ]
        )

        let allTheDistrictsFromdistrictdepCurrdate = this.districtdepCurrdate .filter(Districtobj => stateKey == Districtobj.state_code.toString());
        let allTheDistrictsFromdistrictdepSeasondate = this.districtdepSeasondate .filter(Districtobj => stateKey == Districtobj.state_code.toString());


        for(let i=0; i<allTheDistrictsFromdistrictdepCurrdate.length; i++){

          // console.log(allTheDistrictsFromdistrictdepSeasondate[i].district_name, allTheDistrictsFromdistrictdepSeasondate[i].departure, typeof allTheDistrictsFromdistrictdepSeasondate[i].departure)

          const DateCat = this.getColorAndCat(allTheDistrictsFromdistrictdepCurrdate[i].departure)
          const SeasonCat = this.getColorAndCat(allTheDistrictsFromdistrictdepSeasondate[i].departure)
          this.rows.push(
            [
              i+1, 
              allTheDistrictsFromdistrictdepCurrdate[i].district_name, 
              allTheDistrictsFromdistrictdepCurrdate[i].actual_rainfall!=null ? allTheDistrictsFromdistrictdepCurrdate[i].actual_rainfall.toFixed(2) : allTheDistrictsFromdistrictdepCurrdate[i].actual_rainfall, 
              allTheDistrictsFromdistrictdepCurrdate[i].normal_rainfall, 
              allTheDistrictsFromdistrictdepSeasondate[i].departure!=null ? allTheDistrictsFromdistrictdepCurrdate[i].departure.toFixed(2) : allTheDistrictsFromdistrictdepCurrdate[i].departure,
              {content : DateCat.Cat, styles: { fillColor: DateCat.color }},
    
              allTheDistrictsFromdistrictdepSeasondate[i].actual_rainfall!=null ? allTheDistrictsFromdistrictdepSeasondate[i].actual_rainfall.toFixed(2) : allTheDistrictsFromdistrictdepSeasondate[i].actual_rainfall,
              allTheDistrictsFromdistrictdepSeasondate[i].normal_rainfall, 
              allTheDistrictsFromdistrictdepSeasondate[i].departure!=null ? allTheDistrictsFromdistrictdepSeasondate[i].departure.toFixed(2) : allTheDistrictsFromdistrictdepSeasondate[i].departure,
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

































