import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { StateDownloadStatistics } from 'src/app/services/state/statisticsdownload.service';
import { DownloadPdf } from 'src/app/services/district/pdfdownload.service';
import { SubdivDownloadStatistics } from 'src/app/services/subDivision/statisticsdownload.service';
import { CountryDownloadStatistics } from 'src/app/services/country/pdfStatisticsDownloadCountry.service';
import { RegionDownloadStatistics } from 'src/app/services/region/downloadStatisticsRegion.service';


@Component({
  selector: 'app-rainfall-statistics-weekly',
  templateUrl: './rainfall-statistics-weekly.component.html',
  styleUrls: ['./rainfall-statistics-weekly.component.css']
})
export class RainfallStatisticsWeeklyComponent implements OnInit{

   
    fromDate: Date = new Date();
    toDate: Date = new Date();
     category: string = 'STATE'; // Default category
     selectedCategory: string = 'STATE'; // Track selected category
     selectedWeek: string | undefined;
     months: { name: string, weeks: { label: string, range: string, displayRange: string }[] }[] = [];
     loading: boolean = false;
  
    constructor(
      private route: ActivatedRoute,
      private router: Router,  // Inject Router to navigate programmatically
      private dataService: DataService,
      private stateStatisticsService: StateDownloadStatistics,
      private districtsStatisticsService : DownloadPdf,
      private subdivisionStatisticsService : SubdivDownloadStatistics,
      private countryStatisticsService : CountryDownloadStatistics,
      private regionStatisticsService : RegionDownloadStatistics,
      private cdr: ChangeDetectorRef
    ){}
  
    ngOnInit(): void {
      this.route.data.subscribe(data => {
        this.category = data['category'];
        this.selectedCategory = data['category']; // Ensure dropdown is updated
      });
    
      this.generateWeeklyOptions();
    }
    

     // Method to handle category change
    onCategoryChange(category: string) {
      this.selectedCategory = category;

    // Navigate to the route based on selected category
    switch (category) {
      case 'STATE':
        this.router.navigate(['/weekly-state-rf-distribution']);
        break;
      case 'SUBDIVISION':
        this.router.navigate(['/weekly-subdivision-rf-distribution']);
        break;
      case 'DISTRICT':
        this.router.navigate(['/weekly-district-rf-distribution']);
        break;
      case 'REGION':
        this.router.navigate(['/weekly-homogenous-rf-distribution']);
        break;
      case 'COUNTRY':
        this.router.navigate(['/weekly-country-rf-distribution']);
        break;
      default:
        break;
    }
  }


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
    //       let weekRangeForDisplay = `${this.formatDateForDisplay(startOfWeek)} - ${this.formatDateForDisplay(endOfWeek)}`;
    
    //       if (!this.months[monthIndex]) {
    //         this.months[monthIndex] = { name: monthNames[monthIndex], weeks: [] };
    //       }
    
    //       let weekNumber = this.months[monthIndex].weeks.length + 1;
    //       let weekLabel = `Week ${weekNumber}`;
    //       this.months[monthIndex].weeks.push({ label: weekLabel, range: weekRange, displayRange: weekRangeForDisplay });
    //     }
    //     currentDate.setDate(currentDate.getDate() + 1);
    //   }
    // }

    generateWeeklyOptions() {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
    
      const currentYear = new Date().getFullYear(); // Get the current year
      const startDate = new Date(currentYear, 0, 1); // January 1 of the current year
      const endDate = new Date(currentYear, 11, 31); // December 31 of the current year
    
      let currentDate = startDate;
      while (currentDate <= endDate) {
        if (currentDate.getDay() === 4) { // Thursday
          let startOfWeek = new Date(currentDate);
          let endOfWeek = new Date(currentDate);
          endOfWeek.setDate(endOfWeek.getDate() + 6);
    
          // Only add weeks that are completed
          if (endOfWeek <= new Date()) { // Check if the week is completed
            let monthIndex = startOfWeek.getMonth();
            let weekRange = `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
            let weekRangeForDisplay = `${this.formatDateForDisplay(startOfWeek)} - ${this.formatDateForDisplay(endOfWeek)}`;
    
            if (!this.months[monthIndex]) {
              this.months[monthIndex] = { name: monthNames[monthIndex], weeks: [] };
            }
    
            let weekNumber = this.months[monthIndex].weeks.length + 1;
            let weekLabel = `Week ${weekNumber}`;
            this.months[monthIndex].weeks.push({ label: weekLabel, range: weekRange, displayRange: weekRangeForDisplay });
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    

    formatDate(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }

    formatDateForDisplay(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  
    async viewWeeklyStatistics() {
      this.loading = true;

      if (this.selectedWeek) {
        const dates = this.selectedWeek.split(' - ');
        const fromDate = dates[0];
        const toDate = dates[1];
    
        let data = {
          fromDate: fromDate,
          toDate: toDate
        };
    
        this.dataService.setfromAndToDate(JSON.stringify(data));
        console.log('without the stringify', data);
        console.log('with the stringify', JSON.stringify(data));
    
    
        try {
          // console.log(data)
          if(this.category == 'STATE') {
            await this.stateStatisticsService.updateandViewpdf();
          } else if(this.category =='SUBDIVISION') {
            await this.subdivisionStatisticsService.updateandViewpdf();
          } else if(this.category =='DISTRICT') {
            await this.districtsStatisticsService.updateandViewpdf();
          } else if(this.category =='COUNTRY') {
            await this.countryStatisticsService.updateandViewpdf();
          } else if(this.category =='REGION') {
            await this.regionStatisticsService.updateandViewpdf();
          }
        } catch (error) {
          console.error('Error fetching statistics', error);
        } finally {
          this.loading = false;
        }
      } else {
        alert('No week selected');
        this.loading = false;
      }
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


  // old code TS FILE
//   import { Component, Input, OnInit } from '@angular/core';
// import { ChangeDetectorRef } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { DataService } from 'src/app/data.service';
// import { CountryDownloadStatistics } from 'src/app/services/country/pdfStatisticsDownloadCountry.service';
// import { DownloadPdf } from 'src/app/services/district/pdfdownload.service';
// import { RegionDownloadStatistics } from 'src/app/services/region/downloadStatisticsRegion.service';
// import { StateDownloadStatistics } from 'src/app/services/state/statisticsdownload.service';
// import { SubdivDownloadStatistics } from 'src/app/services/subDivision/statisticsdownload.service';

// @Component({
//   selector: 'app-rainfall-statistics-weekly',
//   templateUrl: './rainfall-statistics-weekly.component.html',
//   styleUrls: ['./rainfall-statistics-weekly.component.css']
// })
// export class RainfallStatisticsWeeklyComponent implements OnInit{

//     // @Input() category: any;
//     fromDate: Date = new Date();
//     toDate: Date = new Date();

//     // months: { name: string, weeks: { label: string, range: string }[] }[] = [];
//     months: { name: string, weeks: { label: string, range: string, displayRange: string }[] }[] = [];

//     loading: boolean = false; 
    
//     category: string = 'Your Category'; // Replace with actual category
//     weeks: string[] = [];
//     selectedWeek: string | undefined;
  
//     constructor(
//       private route: ActivatedRoute,
//       private dataService: DataService,
//       private stateStatisticsService: StateDownloadStatistics,
//       private districtsStatisticsService : DownloadPdf,
//       private subdivisionStatisticsService : SubdivDownloadStatistics,
//       private countryStatisticsService : CountryDownloadStatistics,
//       private regionStatisticsService : RegionDownloadStatistics,
//       private cdr: ChangeDetectorRef
//     ){}
  
//     ngOnInit(): void {

//       this.route.data.subscribe(data => {
//         this.category = data['category'];
//       });

//       this.generateWeeklyOptions();
//     }

//     generateWeeklyOptions() {
//       const monthNames = [
//         'January', 'February', 'March', 'April', 'May', 'June', 
//         'July', 'August', 'September', 'October', 'November', 'December'
//       ];
    
//       const startDate = new Date(2024, 0, 1); // January 1, 2024
//       const endDate = new Date(2024, 11, 31); // December 31, 2024
    
//       let currentDate = startDate;
//       while (currentDate <= endDate) {
//         if (currentDate.getDay() === 4) { // Thursday
//           let startOfWeek = new Date(currentDate);
//           let endOfWeek = new Date(currentDate);
//           endOfWeek.setDate(endOfWeek.getDate() + 6);
    
//           let monthIndex = startOfWeek.getMonth();
//           let weekRange = `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
//           let weekRangeForDisplay = `${this.formatDateForDisplay(startOfWeek)} - ${this.formatDateForDisplay(endOfWeek)}`;
    
//           if (!this.months[monthIndex]) {
//             this.months[monthIndex] = { name: monthNames[monthIndex], weeks: [] };
//           }
    
//           let weekNumber = this.months[monthIndex].weeks.length + 1;
//           let weekLabel = `Week ${weekNumber}`;
//           this.months[monthIndex].weeks.push({ label: weekLabel, range: weekRange, displayRange: weekRangeForDisplay });
//         }
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//     }
    

//     formatDate(date: Date): string {
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
//       const year = date.getFullYear();
//       return `${year}-${month}-${day}`;
//     }

//     formatDateForDisplay(date: Date): string {
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//       const year = date.getFullYear();
//       return `${day}-${month}-${year}`;
//     }
  
//     async viewWeeklyStatistics() {
//       this.loading = true;

//       if (this.selectedWeek) {
//         const dates = this.selectedWeek.split(' - ');
//         const fromDate = dates[0];
//         const toDate = dates[1];
    
//         let data = {
//           fromDate: fromDate,
//           toDate: toDate
//         };
    
//         this.dataService.setfromAndToDate(JSON.stringify(data));
//         console.log('without the stringify', data);
//         console.log('with the stringify', JSON.stringify(data));
    
    
//         try {
//           // console.log(data)
//           if(this.category == 'STATE') {
//             await this.stateStatisticsService.updateandViewpdf();
//           } else if(this.category =='SUBDIVISION') {
//             await this.subdivisionStatisticsService.updateandViewpdf();
//           } else if(this.category =='DISTRICT') {
//             await this.districtsStatisticsService.updateandViewpdf();
//           } else if(this.category =='COUNTRY') {
//             await this.countryStatisticsService.updateandViewpdf();
//           } else if(this.category =='REGION') {
//             await this.regionStatisticsService.updateandViewpdf();
//           }
//         } catch (error) {
//           console.error('Error fetching statistics', error);
//         } finally {
//           this.loading = false;
//         }
//       } else {
//         alert('No week selected');
//         this.loading = false;
//       }
//     }
      
//     async setFromAndToDateAndView() {
//       let data = {
//         fromDate: this.fromDate,
//         toDate: this.toDate
//       }
//       this.dataService.setfromAndToDate(JSON.stringify(data));
  
//       this.loading = true; // Start loading
  
//       if(this.category == 'STATE') {
//         await this.stateStatisticsService.updateandViewpdf()
//         this.loading = false; // Stop loading when data is loaded
//       } else if(this.category =='SUBDIVISION') {
//         await this.subdivisionStatisticsService.updateandViewpdf()
//         this.loading = false; // Stop loading when data is loaded
//         // Handle other categories
//       } else if(this.category =='DISTRICT') {
//         await this.districtsStatisticsService.updateandViewpdf()
//         this.loading = false; // Stop loading when data is loaded
//         // Handle other categories
//       } else if(this.category =='COUNTRY') {
//         await this.countryStatisticsService.updateandViewpdf()
//         this.loading = false; // Stop loading when data is loaded
//         // Handle other categories
//       } else if(this.category =='REGION') {
//         await this.regionStatisticsService.updateandViewpdf()
//         this.loading = false; // Stop loading when data is loaded
//       }
//     }
  
//     validateDateRange() {
//       var fromDate = this.fromDate;
//       var toDate = this.toDate
  
//       if (fromDate > toDate) {
//         alert('From date cannot be greater than To date');
//         this.fromDate = toDate;
//       }
//     }
//   }
