import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environment/environment';
// import { RegionService } from 'src/app/services/region/region.service';
import { getRegionService } from 'src/app/services/region/getregion.service';
import { CenterService } from 'src/app/services/center/center.service';
import { getStateService } from 'src/app/services/state/getState.service';
import { getDistrictService } from 'src/app/services/district/getdistrict.service';

interface Region {
  region_name: string;
  region_code: string;
  label: string,
  value: string
}

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css']
})
export class DataEntryComponent implements OnInit {

  currentUserType:any;
  loggedInUser: any;
  regions: any[] = []; // Array to hold region data fetched from API
  selectedRegion: any; 
  centersMC: any[] = [];
  centersRMC: any[] = [];
  states: any[] = [];
  selectedState: any;
  districts: any[] = [];

  StartDate: any;
  EndDate: any;

  constructor(private http: HttpClient, private regionService: getRegionService, private centerService: CenterService, private getStateService: getStateService, private getDistrictService: getDistrictService) {}

  ngOnInit(): void {
    this.loggedInUser = localStorage.getItem("isAuthorised");
    const obj  = JSON.parse(this.loggedInUser);
    this.currentUserType = obj.data[0].mcorhq
    // console.log('currentUserType',this.currentUserType)

    this.fetchRegionData();

  }

  fetchRegionData() {
    this.regionService.fetchData()
      .subscribe(
        response => {
          // console.log('Region data:', response);
          // Ensure response.data contains the expected array structure
          if (response && response.data) {
            this.regions = response.data.map((region: any) => ({
              label: region.region_name,
              value: region.region_code
            }));
            // console.log('Formatted regions:', this.regions);
          } else {
            console.error('Unexpected response format:', response);
            alert('Data is not coming in the expected format');
          }
        },
        error => {
          console.error('Error fetching region data:', error);
          alert('Data is not coming');
        }
      );
  }
  

  onRegionChange(): void {
    if (this.selectedRegion && this.selectedRegion.length > 0) {
      console.log(this.selectedRegion)
      const regionCodes = this.selectedRegion.map((region: Region) => region.value);
      console.log('regionCodes', regionCodes)

      this.centersMC = [];

      this.selectedRegion.forEach((code: string) => {
        this.centerService.fetchData('MC').subscribe(
          response => {
            // console.log('Center details MC', response);

            const filteredCenters = response.data.filter((center:any) => center.region_code === code);
            this.centersMC.push(...filteredCenters); // Append filtered centers to centers array

            // console.log('centers', this.centersMC)
            // console.log("after filtering MC", filteredCenters)
          },
          error => {
            console.error('Error fetching center details:', error);
          }
        );
      });

      this.selectedRegion.forEach((code:string)=>{
        this.centerService.fetchData('RMC').subscribe(
          response => {
            // console.log('center detail RMC', response);
            const filterContentRMC = response.data.filter((center:any)=>center.region_code === code);
            this.centersRMC.push(...filterContentRMC);

            // console.log('this.centersRMC',this.centersRMC)
            // console.log("after filtering RMC", filterContentRMC)

          },
          error=>{
            console.error('Error fetching center details:', error)
          }
        )
      })
    }
  }

  onMcChange(): void{
  
    this.selectedRegion.forEach((code:string) => {
      this.getStateService.fetchData().subscribe(
        response =>{
          console.log('state data MC', response);
          const filterStateByMC = response.data.filter((id: any)=> id.region_code === code);

          // this.states.push(...filterStateByMC);

          // Add only unique states based on state_name
        filterStateByMC.forEach((state: any) => {
          if (!this.states.some(existingState => existingState.state_name === state.state_name)) {
            this.states.push(state);
          }
        });
        // console.log('filterStateByMC', filterStateByMC);
        // console.log('states by MC', this.states);
        }
      )
    })
  }

  onRMcChange(): void {

    this.selectedRegion.forEach((code:string)=>{
      this.getStateService.fetchData().subscribe(
        response => {
          console.log('State Data RMC', response);
          const filterStateRMC = response.data.filter((id: any)=> id.region_code === code);

          // this.states.push(...filterStateRMC);

        // Add only unique states based on state_name
        filterStateRMC.forEach((state: any) => {
          if (!this.states.some(existingState => existingState.state_name === state.state_name)) {
            this.states.push(state);
          }
        });

        console.log('filterStateByRMC', filterStateRMC);
          console.log('state by RMC', this.states);
        }
      )
    })
  }

  onStateChange(): void {
  // console.log("onStateChange", this.states);

    this.districts = [];
    console.log('selectedState', this.selectedState);

    if (this.selectedState && this.selectedState.length > 0) {
      const selectedStateCodes = this.selectedState.map((state: any) => state.state_code);
      console.log('selectedStateCodes', selectedStateCodes);

      // Fetch districts based on selected states' state_code
      this.getDistrictService.fetchData().subscribe(
        response => {
          console.log('District Response', response);

          selectedStateCodes.forEach((code: any) => {
            const filterDistrict = response.data.filter((district: any) => district.state_code === code);
            console.log('filterDistrict', filterDistrict);
            this.districts.push(...filterDistrict);
          });

          console.log('Filtered districts:', this.districts);
        },
        error => {
          console.error('Error fetching district data:', error);
        }
      );
    } else {
      console.log('No states selected');
    }
  }
}

