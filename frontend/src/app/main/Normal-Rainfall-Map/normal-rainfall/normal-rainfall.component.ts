import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DataService } from "src/app/data.service";
import { SubdivisionService } from "src/app/services/subDivision/subDivision.service";
import { SubdivDownloadStatistics } from "src/app/services/subDivision/statisticsdownload.service";
import { CountryService } from "src/app/services/country/country.service";
import { StateService } from "src/app/services/state/state.service";
import * as moment from 'moment';

@Component({
  selector: "app-normal-rainfall",
  templateUrl: "./normal-rainfall.component.html",
  styleUrls: ["./normal-rainfall.component.css"],
})
export class NormalRainfallComponent {
  seasons: string[] = [
    "Winter",
    "Pre Monsoon",
    "Post Monsoon",
    "Monsoon",
    "Annual",
    "Daily"
  ];
  maps: string[] = ["State", "Subdivision"];

  selectedSeason: string = "Winter";
  selectedMap: string = "State";
  selectedDate: Date | null = null; // Holds the selected date for 'Daily' season
  mapData: any = null;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private subdivisionService: SubdivisionService,
    private downlaodStatistics: SubdivDownloadStatistics,
    private countryService: CountryService,
    private stateService: StateService
  ) {}

  ngOnInit() {
    // Fetch initial data for Winter and State
    this.onSubmit();  // Call submit to get the default data
  }

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

  onSeasonChange() {
    this.onSubmit();
    console.log('THIS IS on SEASON CHANGE');
    console.log(this.selectedMap, this.selectedSeason, this.selectedDate);
  }

  onSubmit() {
    let requestData: any = {};
  
    // If "Daily" is selected, process date picker selection
    if (this.selectedSeason === "Daily") {
      if (this.selectedDate) {
        // Format the selected date as 'YY-MM-DD'
        const formattedDate = moment(this.selectedDate).format('YYYY-MM-DD');
        requestData = { date: formattedDate };
        console.log('requestData', requestData);
      } else {
        console.error("No date selected for 'Daily'");
        return;
      }
  
      // Check which map type is selected and call the appropriate API
      if (this.selectedMap === "State") {
        // Fetch data for "State"
        this.stateService.fetchData(requestData).subscribe(
          (response) => {
            this.mapData = response; // Set new data
            console.log(this.mapData, 'STATE MAPDATA');
            console.log('State API response', response);
          },
          (error) => {
            console.error("State API Error:", error);
          }
        );
      } else if (this.selectedMap === "Subdivision") {
        // Fetch data for "Subdivision"
        this.subdivisionService.fetchData(requestData).subscribe(
          (response) => {
            this.mapData = response; // Set new data
            console.log('Subdivision API response', response);
          },
          (error) => {
            console.error("Subdivision API Error:", error);
          }
        );
      } else {
        console.error("No valid map type selected for 'Daily'");
      }
  
    } else {
      // For other seasons, fetch the respective date range
      const seasonDateRanges: any = {
        Winter: { startDate: "2024-01-01", endDate: "2024-02-29" },
        "Pre Monsoon": { startDate: "2024-03-01", endDate: "2024-05-31" },
        Monsoon: { startDate: "2024-06-01", endDate: "2024-09-29" },
        "Post Monsoon": { startDate: "2024-10-01", endDate: "2024-12-31" },
        Annual: { startDate: "2024-01-01", endDate: "2024-12-31" },
      };
  
      requestData = seasonDateRanges[this.selectedSeason] || {};
  
      if (Object.keys(requestData).length > 0) {
        // Reset mapData before fetching new data
        this.mapData = null;
  
        if (this.selectedMap === "State") {
          this.stateService.fetchData(requestData).subscribe(
            (response) => {
              this.mapData = response; // Set new data
            },
            (error) => {
              console.error("State API Error:", error);
            }
          );
        } else if (this.selectedMap === "Subdivision") {
          this.subdivisionService.fetchData(requestData).subscribe(
            (response) => {
              this.mapData = response; // Set new data
            },
            (error) => {
              console.error("Subdivision API Error:", error);
            }
          );
        }
      } else {
        console.error("No valid season selected");
        this.mapData = null; // Ensure the map is cleared if no valid season is selected
      }
    }
  }
  
  
  
}
