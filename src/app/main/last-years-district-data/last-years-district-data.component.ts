import { Component, OnInit } from "@angular/core";
import { getDistrictService } from "src/app/services/district/getdistrict.service";
import { RainfallDataService } from "src/app/services/district/getpastyeardata.service";
import { getStateService } from "src/app/services/state/getState.service";

@Component({
  selector: 'app-last-years-district-data',
  templateUrl: './last-years-district-data.component.html',
  styleUrls: ['./last-years-district-data.component.css']
})
export class LastYearsDistrictDataComponent implements OnInit {
  States: any[] = [];       
  districts: any[] = [];    
  filteredDistricts: any[] = [];  // To store filtered districts based on state
  selectedState: string | undefined; // Selected state (state_name)
  selectedStateCode: number | undefined; // To store the state_code for filtering
  startDate: string = '2019-01-01'; 
  endDate: string = '2024-12-31';  

  selectedDistrict: string | undefined; 
  rainfallData: any; // Store the fetched rainfall data
  yearMonthData: any = {}; 
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // Month names
 
  constructor(
    private stateService: getStateService, 
    private getDistrictService: getDistrictService,
    private rainfallDataService: RainfallDataService,
  ) {}

  ngOnInit(): void {
    this.fetchStates();        // Fetch states
    this.getAllDistricts();     // Fetch all districts
  }

  onDistrictChange(district_code: string): void {
    this.selectedDistrict = district_code; // Now selectedDistrict holds the district_code
  
    // if (this.selectedDistrict) {
    //   this.fetchRainfallData(); // Call API to fetch data for the selected district
    // }
  }
  
  fetchRainfallData(): void {
    if (this.startDate && this.endDate && this.selectedDistrict) {
      this.rainfallDataService.getRainfallData(this.startDate, this.endDate, this.selectedDistrict)
        .subscribe(
          (response) => {
            if (response.success) {
              this.processRainfallData(response.data); // Process rainfall data on success
            } else {
              console.error('Error:', response.message);
            }
          },
          (error) => {
            console.error('Error fetching rainfall data:', error);
          }
        );
    } else {
      console.error('Start date, end date, or selected district is missing.');
    }
  }

  processRainfallData(data: any[]): void {
    const groupedData: any = {};

    data.forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth(); // Get month index (0-based)
      const monthName = this.months[monthIndex]; // Convert index to month name

      if (!groupedData[year]) {
        groupedData[year] = {};
      }

      // Assign rainfall data to the respective month
      groupedData[year][monthName] = {
        normal_rainfall: item.normal_rainfall,
        actual_rainfall: item.actual_rainfall,
        departure: item.departure
      };
    });

    this.yearMonthData = groupedData; // Store grouped data for use in the template
  }

  // Getter to return the years (keys of yearMonthData)
  get years(): string[] {
    return Object.keys(this.yearMonthData);
  }

  // Fetch all states
  fetchStates(): void {
    this.stateService.fetchData().subscribe(
      (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.States = response.data;
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      (error) => {
        console.error('Error fetching state details:', error);
      }
    );
  }

  // Fetch all districts
  getAllDistricts(): void {
    this.getDistrictService.fetchData().subscribe(
      (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.districts = response.data;
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      (error) => {
        console.error("Error fetching district details:", error);
      }
    );
  }

  // Handle state selection and filter districts
  onStateChange(state: any): void {
    this.selectedStateCode = state.state_code; // Store the selected state's code
    // Filter districts based on selected state's code
    this.filteredDistricts = this.districts.filter(district => district.state_code === this.selectedStateCode);
  }
}

