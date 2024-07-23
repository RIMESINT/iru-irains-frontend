import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { CountryDownloadStatistics } from 'src/app/services/country/pdfStatisticsDownloadCountry.service';
import { DownloadPdf } from 'src/app/services/district/pdfdownload.service';
import { RegionDownloadStatistics } from 'src/app/services/region/downloadStatisticsRegion.service';
import { StateDownloadStatistics } from 'src/app/services/state/statisticsdownload.service';
import { SubdivDownloadStatistics } from 'src/app/services/subDivision/statisticsdownload.service';

@Component({
  selector: 'app-rainfall-statistics-weekly',
  templateUrl: './rainfall-statistics-weekly.component.html',
  styleUrls: ['./rainfall-statistics-weekly.component.css']
})
export class RainfallStatisticsWeeklyComponent implements OnInit{

    // @Input() category: any;
    fromDate: Date = new Date();
    toDate: Date = new Date();
    // months: { name: string, weeks: string[] }[] = [];

    months: { name: string, weeks: { label: string, range: string }[] }[] = [];


    loading: boolean = false; // Variable to track loading state

    category: string = 'Your Category'; // Replace with actual category
    weeks: string[] = [];
    selectedWeek: string | undefined;
    // loading: boolean = false;
  
    constructor(
      private route: ActivatedRoute,
      private dataService: DataService,
      private stateStatisticsService: StateDownloadStatistics,
      private districtsStatisticsService : DownloadPdf,
      private subdivisionStatisticsService : SubdivDownloadStatistics,
      private countryStatisticsService : CountryDownloadStatistics,
      private regionStatisticsService : RegionDownloadStatistics
    ){}
  
    ngOnInit(): void {
      this.route.data.subscribe(data => {
        this.category = data['category'];
      });

      this.generateWeeklyOptions();
    }

    // generateWeeklyOptions() {
    //   const startDate = new Date(2024, 0, 1); // January 1, 2024
    //   const endDate = new Date(2024, 11, 31); // December 31, 2024
  
    //   let currentDate = startDate;
    //   while (currentDate <= endDate) {
    //     if (currentDate.getDay() === 4) { // Thursday
    //       let startOfWeek = new Date(currentDate);
    //       let endOfWeek = new Date(currentDate);
    //       endOfWeek.setDate(endOfWeek.getDate() + 6);
  
    //       this.weeks.push(`${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`);
    //     }
    //     currentDate.setDate(currentDate.getDate() + 1);
    //   }
    // }
  
    // generateWeeklyOptions() {
    //   const monthNames = [
    //     'January', 'February', 'March', 'April', 'May', 'June', 
    //     'July', 'August', 'September', 'October', 'November', 'December'
    //   ];
  
    //   const startDate = new Date(2024, 0, 1); // January 1, 2024
    //   const endDate = new Date(2024, 11, 31); // December 31, 2024
  
    //   let currentDate = startDate;
    //   while (currentDate <= endDate) {
    //     if (currentDate.getDay() === 4) { // Thursday
    //       let startOfWeek = new Date(currentDate);
    //       let endOfWeek = new Date(currentDate);
    //       endOfWeek.setDate(endOfWeek.getDate() + 6);
  
    //       let monthIndex = startOfWeek.getMonth();
    //       let weekRange = `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
  
    //       if (!this.months[monthIndex]) {
    //         this.months[monthIndex] = { name: monthNames[monthIndex], weeks: [] };
    //       }
    //       this.months[monthIndex].weeks.push(weekRange);
    //     }
    //     currentDate.setDate(currentDate.getDate() + 1);
    //   }
    // }

    generateWeeklyOptions() {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      const startDate = new Date(2024, 0, 1); // January 1, 2024
      const endDate = new Date(2024, 11, 31); // December 31, 2024
  
      let currentDate = startDate;
      while (currentDate <= endDate) {
        if (currentDate.getDay() === 4) { // Thursday
          let startOfWeek = new Date(currentDate);
          let endOfWeek = new Date(currentDate);
          endOfWeek.setDate(endOfWeek.getDate() + 6);
  
          let monthIndex = startOfWeek.getMonth();
          let weekRange = `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
  
          if (!this.months[monthIndex]) {
            this.months[monthIndex] = { name: monthNames[monthIndex], weeks: [] };
          }
  
          let weekNumber = this.months[monthIndex].weeks.length + 1;
          let weekLabel = `Week ${weekNumber}`;
          this.months[monthIndex].weeks.push({ label: weekLabel, range: weekRange });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    formatDate(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  
    onWeekChange() {
      // Handle the week change if necessary
    }
  
    viewWeeklyStatistics() {
      this.loading = true;
      // Logic to fetch and display the statistics
      // Once done, set this.loading to false
    }
  
    async setFromAndToDateAndView() {
      let data = {
        fromDate: this.fromDate,
        toDate: this.toDate
      }
      this.dataService.setfromAndToDate(JSON.stringify(data));
  
      this.loading = true; // Start loading
  
      if(this.category == 'STATE') {
        await this.stateStatisticsService.updateandViewpdf()
        this.loading = false; // Stop loading when data is loaded
      } else if(this.category =='SUBDIVISION') {
        await this.subdivisionStatisticsService.updateandViewpdf()
        this.loading = false; // Stop loading when data is loaded
        // Handle other categories
      } else if(this.category =='DISTRICT') {
        await this.districtsStatisticsService.updateandViewpdf()
        this.loading = false; // Stop loading when data is loaded
        // Handle other categories
      } else if(this.category =='COUNTRY') {
        await this.countryStatisticsService.updateandViewpdf()
        this.loading = false; // Stop loading when data is loaded
        // Handle other categories
      } else if(this.category =='REGION') {
        await this.regionStatisticsService.updateandViewpdf()
        this.loading = false; // Stop loading when data is loaded
      }
    }
  
    validateDateRange() {
      var fromDate = this.fromDate;
      var toDate = this.toDate
  
      if (fromDate > toDate) {
        alert('From date cannot be greater than To date');
        this.fromDate = toDate;
      }
    }
  }