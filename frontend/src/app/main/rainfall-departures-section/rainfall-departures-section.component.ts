import {
  Component,
  Input,
  Renderer2,
  ElementRef,
  AfterViewInit,
  HostListener,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DataService } from "src/app/data.service";
import { SubdivisionService } from "src/app/services/subDivision/subDivision.service";
import { SubdivDownloadStatistics } from "src/app/services/subDivision/statisticsdownload.service";
import { CountryService } from "src/app/services/country/country.service";
import { StateService } from "src/app/services/state/state.service";
import { Constants } from "src/app/services/constants";
import { SubdivRainFallDeparture } from "src/app/services/subDivision/rainfalldeparturedownload.service";
import { style } from "@angular/animations";
import { DistrictRainFallDeparture } from "src/app/services/district/rainfalldeparturedownload.service";
import { PdfMakeService } from "src/app/services/pdfMake.service.ts/pdfFromHTML.service";

@Component({
  selector: 'app-rainfall-departures-section',
  templateUrl: './rainfall-departures-section.component.html',
  styleUrls: ['./rainfall-departures-section.component.css']
})
export class RainfallDeparturesSectionComponent {

  sortColumn: number | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  years: any[] = [];
  selectedYear: any;
  loading: boolean = false; // Add this line
  selectedModeUnifiedOrDataEntry: any;
  fromDate: any;
  enddate: any;
  title : any;
  periodTitle : any;



  // Sorting function
  sortTable(colIndex: number): void {
    if (this.sortColumn === colIndex) {
      // If clicking the same column, toggle the sorting direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new column as the sorting column
      this.sortColumn = colIndex;
      this.sortDirection = 'asc'; // Default to ascending order
    }

    this.rows.sort((a : any, b : any) => {
      const valueA = a[colIndex].content;
      const valueB = b[colIndex].content;

      // Handle numbers, strings, or any data type
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });
  }


  
    async onSubmitButton() {
      this.loading = true
      this.rows = []
      const date = new Date()
      let listofdata : any[] = []
      const {
        startDate,
        endDate
      } = this.constants.getCurrentMonthSeasonFromAndToCurrentDate(new Date())

      this.fromDate = startDate.split('-').reverse().join('-')
      this.enddate = endDate.split('-').reverse().join('-')



      this.title = `${ this.selectedMap } - Week By Week Departures (${ this.selectedMode })`
      this.periodTitle = `Period: ${this.fromDate} To ${this.enddate}`



      if(this.selectedMode == 'Weekly'){
        console.log('year......', date.getFullYear(), this.selectedYear)
        listofdata = this.constants.getWeeklyIntervals(this.selectedSeason.toLowerCase(), this.selectedYear)

      }else{
       listofdata = this.constants.getWeeklyByCummulative(this.selectedSeason.toLowerCase(),this.selectedYear)
      }
      this.columns = [
        { header: 'S.NO', style: 'border: 1px solid black' },
        { header: this.selectedMap, style: 'border: 1px solid black' },
      ];

      for(let i=0; i<listofdata.length; i++){
        this.columns.push(
           { header : listofdata[i].endDate.split('-').reverse().join('-'), style: 'border: 1px solid black'}
        )
      }

      if(this.selectedMap == 'Subdivision'){
        this.rows = []

        if(this.selectedModeUnifiedOrDataEntry.selectedMode=='Unified'){
          this.rows = await this.subDivRainFallDep.updateAndShowFromFTP(listofdata)

        }else{
          this.rows = await this.subDivRainFallDep.updateAndShowFromDataEnrty(listofdata)
        }
      }
      else{
        this.rows = []

        if(this.selectedModeUnifiedOrDataEntry.selectedMode=='Unified'){
          this.rows = await this.districtRainfallDep.updateAndShowFromFTP(listofdata)

        }else{
          this.rows = await this.districtRainfallDep.updateAndShowFromDataEntry(listofdata)
        }
      }
      this.loading = false
    }

    modes: string[] = [
      "Weekly",
      "Cummulative"
    ];
    maps: string[] = ["Subdivision", "District"];
    seasons : any [] = [
      "Winter",
      "PreMonsoon",
      "Monsoon",
      "PostMonsoon",
    ]
    
    selectedSeason: string = "Winter";
    selectedMode : string = "Weekly"
    selectedMap: string = "Subdivision"; 
    mapData: any = null; 
    filteredData: any;
    rows: any = [];
    columns: any[] = [];
  
    constructor(
      private http: HttpClient,
      private dataService: DataService,
      private renderer: Renderer2,
      private elRef: ElementRef,
      private subdivisionService: SubdivisionService,
      private downlaodStatistics: SubdivDownloadStatistics,
      private countryService: CountryService,
      private stateService: StateService, // Injecting the StateService
      private constants : Constants,
      private subDivRainFallDep : SubdivRainFallDeparture,
      private districtRainfallDep : DistrictRainFallDeparture,
      private pdfService : PdfMakeService
      
    ) {
      const currentYear = new Date().getFullYear();
      this.selectedYear = currentYear

      for (let year = 1700; year <= currentYear; year++) {
        this.years.push(year);
      }


      let selectedMode: any = localStorage.getItem("selectedMode");
      this.selectedModeUnifiedOrDataEntry = JSON.parse(selectedMode);
      console.log('this.selected mOde', this.selectedMode)


      this.selectedSeason = this.constants.getCurrentSeason(new Date())

      this.onSubmitButton()
    }
  
    // Add this method in your NormalRainfallComponent class
  
    getDateRange(season: string) {
      const dateRanges: any = {
        Winter: "Jan - Feb",
        "Pre Monsoon": "Mar - May",
        Monsoon: "Jun - Sep",
        "Post Monsoon": "Oct - Dec",
        Annual: "Jan - Dec",
      };
  
      return dateRanges[season] || "";
    }

    
    async onDownload() {
      const title = `${this.selectedMap} - ${this.selectedMode} in ${this.selectedSeason}`;
      this.pdfService.generatePdf(this.columns, this.rows, this.title, this.periodTitle);
    }

  }