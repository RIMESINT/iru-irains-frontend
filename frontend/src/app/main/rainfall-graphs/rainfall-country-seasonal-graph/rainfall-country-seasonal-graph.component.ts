import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { EMPTY, concatMap, lastValueFrom } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { Constants } from 'src/app/services/constants';
import { RegionService } from 'src/app/services/region/region.service';
import Exporting from 'highcharts/modules/exporting';
import { NONE_TYPE } from '@angular/compiler';
import { CountryService } from 'src/app/services/country/country.service';


@Component({
  selector: 'app-rainfall-country-seasonal-graph',
  templateUrl: './rainfall-country-seasonal-graph.component.html',
  styleUrls: ['./rainfall-country-seasonal-graph.component.css']
})
export class RainfallCountrySeasonalGraphComponent implements OnInit {


  isLoading = false;

  seasons = ['Winter', 'PreMonsoon', 'Monsoon', 'PostMonsoon'];
  selectedSeason = this.seasons[0];


  selectedYear = new Date().getFullYear();
  years = this.getYears();

  maps = ['Pan India', 'Central India', 'North West India', 'East And North East India', 'South Peninsula'];
  selectedMap = this.maps[1];


  Season = this.seasons[0].toUpperCase();
  Map = this.maps[1].toUpperCase();
  Year: any = this.selectedYear;

  dataRange: { startDate: any; endDate: any; } | undefined;


  chart: any;
  graphaData = { actual: [], normal: [], departure : [], date:[]};
  graphaDataCummulative = { actual: [], normal: [], departure : [], date:[]};
  graphDataNonCummulative = { actual: [], normal: [], departure : [], date:[]};
  dateIntervals: any = [];
  regiondata: any;
  toDate: any;
  fromDate: any;
  selectedMode: any;
  selectedModeCummOrNonCumm: any = 'Non-Cummulative';

  selectCumulativeOrNonCumulative(mode: string) {
    this.selectedModeCummOrNonCumm = mode;
    if(this.selectedModeCummOrNonCumm=='Non-Cummulative'){
      this.graphaData = this.graphDataNonCummulative
    }else{
      this.graphaData = this.graphaDataCummulative
    }
    this.updateCharts()
  }
  
  async ngOnInit() {
    Exporting(Highcharts)
    await this.fetchData()
    this.filterData()
    this.updateCharts();  
  }

  getYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1700; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  }

  async onSubmit() {
    this.Season = this.selectedSeason.toUpperCase();
    this.Year = this.selectedYear.toString();
    this.Map = this.selectedMap.toUpperCase();
    await this.fetchData()
    this.filterData()
    this.updateCharts();
  }

  // onMapChange(event: MatSelectChange) {
  //   this.filterData()
  //   this.updateCharts()
  //   console.log('Selected Map:', event.value);
  // }


  // Other properties...

  async onMapChange(event: MatSelectChange) {
    this.selectedMap = event.value;
  
    // if (this.selectedMap === 'Pan India') {
    //   // Fetch data specifically for Pan India every time
    //   await this.fetchData();
    // } else if (!this.cacheData) {
    //   // If regional data is not cached, fetch it once
    //   await this.fetchData();
    //   this.cacheData = this.regiondata;  // Store fetched data in cache
    // } else {
    //   // Use cached data for region maps to avoid repeated API calls
    //   this.regiondata = this.cacheData;
    // }

    // this.filterData();
    // this.updateCharts();
    // console.log('Selected Map:', this.selectedMxap);
  }

  async fetchData() {
    this.isLoading = true;
    const { start, end } = this.constants.getSeasonDatesUptoCurrentDate(this.selectedSeason.toLowerCase(), this.selectedYear);
    const data = {
      startDate: this.formatDate(start),
      endDate: this.formatDate(end)
    };
    this.fromDate = data.startDate.split('-').reverse().join('-')
    this.toDate = data.endDate.split('-').reverse().join('-')

    try {

      
      if (this.selectedMap === 'Pan India') {
        if(this.selectedMode.selectedMode == 'Unified'){
          this.regiondata = await lastValueFrom(
            this.countryService.fetchDataCummulativeFtp(data).pipe(
              concatMap((p:any) => {
                this.regiondata = p.data
                console.log('Country Date', this.regiondata)
                return EMPTY;
              })
            )
          );
        }else{
          this.regiondata = await lastValueFrom(
            this.countryService.fetchDataCummulative(data).pipe(
              concatMap((p:any) => {
                this.regiondata = p.data
                console.log('Country Date', this.regiondata)
                return EMPTY;
              })
            )
          );
        }

      } else {
        if(this.selectedMode.selectedMode == 'Unified'){
          this.regiondata = await lastValueFrom(
            this.regionService.fetchCummulativeDataFtp(data).pipe(
              concatMap((region) => {
                this.regiondata = region.data;
                return EMPTY;
              })
            )
          );          
        }
        this.regiondata = await lastValueFrom(
          this.regionService.fetchCummulativeData(data).pipe(
            concatMap((region) => {
              this.regiondata = region.data;
              return EMPTY;
            })
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.isLoading = false;
    }
  }




  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  

  filterData(){
    console.log('hi',this.selectedMap.toUpperCase())

    let filteredData = this.regiondata.filter((data: any) => data.name === this.selectedMap.toUpperCase());
    if(this.selectedMap.toLowerCase()=="pan india"){
      filteredData = this.regiondata
    }
    if (filteredData.length === 0) {
      alert('No data is available for the selected date range.');
    }

    this.graphaDataCummulative.actual = filteredData.map((data: { actual_rainfall: any; }) => this.constants.trimToOneDecimals(data.actual_rainfall));

    this.graphDataNonCummulative.actual = filteredData.map((data: { actual_rainfall: any }, index: number, arr: any[]) => {
      const current = data.actual_rainfall;
      const previous = index === 0 ? 0 : arr[index - 1].actual_rainfall;
      return current - previous;
    });

    console.log('Printing Cummulative and noncummu;ative', this.graphaDataCummulative.actual, this.graphDataNonCummulative.actual)
    
    this.graphaDataCummulative.normal = filteredData.map((data: { rainfall_normal_value: string; }) => parseFloat(data.rainfall_normal_value));

    this.graphDataNonCummulative.normal = filteredData.map((data: { rainfall_normal_value: string }, index: number, arr: any[]) => {
      const current = parseFloat(data.rainfall_normal_value);
      const previous = index === 0 ? 0 : parseFloat(arr[index - 1].rainfall_normal_value);
      return current - previous;
    });

    this.graphaDataCummulative.departure = filteredData.map((data: any) => 
      {
        const date = new Date(data.date)
        // check wednesday
        if(date.getDay() === 3 ){
          return this.constants.trimToZeroDecimals(data.departure);
        }else{
          return ;
        }
      });

    this.graphDataNonCummulative.departure = filteredData.map((data: any) => 
      {
        const date = new Date(data.date)
        // check wednesday
        if(date.getDay() === 3 ){
          return this.constants.trimToZeroDecimals(data.departure);
        }else{
          return ;
        }
      });

    this.graphaDataCummulative.date = filteredData.map((data: { date: string | number | Date; }) => new Date(data.date).toLocaleDateString());
    this.graphDataNonCummulative.date = filteredData.map((data: { date: string | number | Date; }) => new Date(data.date).toLocaleDateString());

    if(this.selectedModeCummOrNonCumm=='Non-Cummulative'){
      this.graphaData = this.graphDataNonCummulative
    }else{
      this.graphaData = this.graphaDataCummulative
    }
    console.log('this.graphaData', this.graphaData)
  }

  formatDates(dates: string[]): string[] {
    return dates.map((date) => {
      const [month, day, year] = date.split('/'); // Split the MM/DD/YYYY string
      return `${day}-${month}-${year}`; // Rearrange to DD-MM-YYYY
    });
  }
  

  updateCharts() {
    const titleStyle = {
      color: '#333',
      fontSize: '15px',
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif'
    };


    console.log('Chart data', this.graphaData)
  
    const departureData = this.graphaData.departure; // Store departure data separately
    const formattedDates = this.formatDates(this.graphaData.date);


    const maxActual = Math.max(...this.graphaData.actual);
    const maxNormal = Math.max(...this.graphaData.normal);
    const maxValue = Math.max(maxActual, maxNormal);
  
    // Round up to the nearest 10
    const roundedMax = Math.ceil(maxValue);
  
    // Set tick interval dynamically
    const tickInterval = roundedMax / 5;
  
    const chart = new Chart({

      chart: {
        type: 'column',
        height: 600,
        events: {
          load: function () {
            const chart = this;
          }
        }
      },
      title: {
        style: titleStyle,
        text: `Actual and Normal for the period ${this.fromDate} to ${this.toDate} for ${this.selectedMap} in ${this.selectedYear} ${this.selectedSeason}`
      },
      credits: { enabled: false },
      xAxis: {
        // categories: this.graphaData.date,  formattedDates
        categories: formattedDates,
        title: { text: 'Period' }
      },
      yAxis: {
        max: roundedMax,
        tickInterval: tickInterval,
        title: { text: 'Rainfall [mm]' }
      },
      series: [
        {
          name: 'Actual',
          type: 'column',
          data: this.graphaData.actual,
          color: 'green',
          dataLabels: {
            enabled: true,
            formatter: function () {
              const index = this.point.index; // Get the index of the current point
              const departure = departureData[index]; // Access departure data by index
              return departure ? `${departure}%` : '';  // Display departure as percentage
            },
            style: {
              color: 'black', // Red color for departure labels
              // fontWeight: 'bold',
              // fontSize : 2
            },
            inside: false, // Ensure label appears above the bar
            y: -10 // Adjust the position of the label
          }
        },
        {
          name: 'Normal',
          type: 'line',
          data: this.graphaData.normal,
          color:'darkblue'
        },
        {
          name: 'Departure',
          type: 'line',
          data: [], // No actual data points to plot for departure
          color: 'black',
          showInLegend: true, // Include this in the legend
          marker: {
            enabled: false // No markers visible on the plot
          },
          enableMouseTracking: false, // Disable hover events for this series
          events: {
            legendItemClick: function () {
              const chart = this.chart;
              const actualSeries = chart.series[0]; // Assuming Actual is the first series
              const visible = this.visible; // Check if Departure is visible
  
              // Toggle departure labels visibility
              actualSeries.update({
                dataLabels: {
                  enabled: !visible // Toggle based on current visibility
                },
                type: 'column'
              });
  
              return true; // Continue with the default legend toggle behavior
            }
          }
        }
      ],
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'printChart'] // Only show Fullscreen and Print options
          }
        }
      }
    });
  
    this.chart = chart;
  }
  
  
  
  
  





  constructor(
    private regionService : RegionService,
    private countryService : CountryService,
    private constants : Constants
  ) {

    let selectedMode: any = localStorage.getItem("selectedMode");
    this.selectedMode = JSON.parse(selectedMode);
    console.log('this.selected mOde', this.selectedMode)
  }
}
