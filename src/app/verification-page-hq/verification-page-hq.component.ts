
//------------------------------------

import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { VerificationHq } from '../services/verification/verificationHq.service';
import { response } from 'express';
import { DataEntryService } from '../services/dataEntry/dataEntry.service';
import { coerceStringArray } from '@angular/cdk/coercion';

@Component({
  selector: 'app-verification-page-hq',
  templateUrl: './verification-page-hq.component.html',
  styleUrls: ['./verification-page-hq.component.css']
})
export class VerificationPageHQComponent {
  isLoading: boolean = false;
  filteredMCorRMCSArray: any[] = [];
  filteredMCorRMCS: any = {};
  dataToDisplay: any[] = [];
  filteredStations: any[] = [];
  selectedDate: any = this.formatDate(new Date());
  showIsUpdatesTable: boolean = false;
  showIsNotUpdatesTable: boolean = false;
  showIsVerifiedTable: boolean = false;
  showIsNotVerifiedTable: boolean = false;
  todayDate: string;
  existingstationdata: any[] = [];
  bottom_section: boolean = false;
  SortOrder: boolean = false;
  masterStationIds: any = {};
  currentSubmitType: string = '';
  currentSubmitMCorRMCName: string = '';
  fetcheddata: any;
  loggedInUser: any;
  currentUserType: any;

  constructor(
    private dataService: DataService,
    private verificationhq : VerificationHq,
    private dataEntryService : DataEntryService
  ) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    this.todayDate = yyyy + '-' + mm + '-' + dd;

    this.loggedInUser = localStorage.getItem("isAuthorised");
    const obj  = JSON.parse(this.loggedInUser);
    this.currentUserType = obj.data[0].userid;
    
  }

  ngOnInit(): void {
    // this.fetchDataFromBackend();
    this.backend();
  }

  private formatDate(date: Date): string {
    console.log(date)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async updateRainfallValueData(stationid:any, rainfall:any, serialNo:any){
    this.isLoading = true; // Show the spinner
    console.log(stationid, rainfall, typeof +stationid, typeof +rainfall)
    const data = 
      {
        "station_code": +stationid,
        "date": this.selectedDate,
        "value":+rainfall
      }
    try {
      const res = await this.dataEntryService.updateRainfallValue(data).toPromise()
      await this.backend();
      this.filterByDate();
      this.submit(this.currentSubmitType, this.currentSubmitMCorRMCName)

      // alert("Updated");
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false; // Hide the spinner
    }
  }

  async Verifyall() {
    this.isLoading = true;

    if (this.dataToDisplay.length > 0) {
      if (confirm("Do you want to verify these stations?") === true) {
        const filterStationIds = this.dataToDisplay.map((x: any) => {
          return Number(x.stationid);
        });

        const data = 
          {
            "date" : this.selectedDate,
            "station_ids" : filterStationIds,
            "userid" : +this.currentUserType
        }

        console.log(data)
      
        try {
          const res = this.verificationhq.verifyAll(data).subscribe(async ()=>{
            alert("Verified Successfully");
            await this.backend();
            // this.filterByDate();
  
            for (let i = 0; i < this.dataToDisplay.length; i++) {
              this.dataToDisplay[i]['status'] = 'Verified';
            }
          });

        } catch (err) {
          console.error(err);
        } finally {
          this.isLoading = false;
        }
      }
    }
  }

  goBack() {
    window.history.back();
  }

  async backend(): Promise<void>{
    const todayDate = new Date()
    // const date = this.formatDate(todayDate);
    const date = this.selectedDate
    console.log(date)
    console.log(date)

    this.filteredMCorRMCS = {};
    this.filteredStations = [];
    try {
      this.verificationhq.fetchStationData(date).subscribe((response)=>
        {
          console.log('fetchinf adata')
          this.fetcheddata = response.data
          console.log(response.data, response)

          for (let i = 0; i < this.fetcheddata.length; i++) {
            const currentMcOrRmc = this.fetcheddata[i]['centre_type']+' '+this.fetcheddata[i]['centre_name']
            if (currentMcOrRmc in this.filteredMCorRMCS) {
              this.filteredMCorRMCS[currentMcOrRmc]['Total_Stations'] = this.filteredMCorRMCS[currentMcOrRmc]['Total_Stations'] + 1;
            } else {
              this.filteredMCorRMCS[currentMcOrRmc] = {
                'Total_Stations': 1,
              };
            }
            
          }
          this.filterByDate()
          this.filteredMCorRMCSArray = Object.keys(this.filteredMCorRMCS).map(key => ({
            name: key,
            data: this.filteredMCorRMCS[key]
          }));
    
          console.log('flterdmcs', this.filteredMCorRMCS, this.filteredMCorRMCSArray)
        }
      );
      
    } catch (err) {
      console.error(err);
    }
  }



  sort(list: any[],key: string) {
    this.SortOrder=!this.SortOrder;

    return list.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
  
      if (typeof valueA === "number" && typeof valueB === "number") {
        return this.SortOrder === false ? valueA - valueB : valueB - valueA;
      } else if (typeof valueA === "string" && typeof valueB === "string") {
        return this.SortOrder === false ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        throw new Error("Cannot sort by key: values are not of the same type or unsupported type.");
      }
    }); 
   }


  async filterByDate() {
    const date = this.selectedDate
    for (let i = 0; i < this.fetcheddata.length; i++) {
      
      const currentMcOrRmc = this.fetcheddata[i]['centre_type']+' '+this.fetcheddata[i]['centre_name']
      this.filteredMCorRMCS[currentMcOrRmc]['isVerified'] = 0;
      this.filteredMCorRMCS[currentMcOrRmc]['isNotVerified'] = 0;
      this.filteredMCorRMCS[currentMcOrRmc]['isUpdated'] = 0;
      this.filteredMCorRMCS[currentMcOrRmc]['isNotUpdated'] = 0;
    }

    for (let i = 0; i < this.fetcheddata.length; i++) {


      const currentMcOrRmc = this.fetcheddata[i]['centre_type']+' '+this.fetcheddata[i]['centre_name']
      if (new Date(date) > new Date()) {
        this.filteredMCorRMCS[currentMcOrRmc]['isVerified'] = 'OutDated';
        this.filteredMCorRMCS[currentMcOrRmc]['isNotVerified'] = 'OutDated';
      } else {
        // const Verification = (this.existingstationdata[i][curr_date] == 'null' || this.existingstationdata[i][curr_date] == null) ? 0 : 1;
        const Verification = this.fetcheddata[i].is_verified
        if(this.fetcheddata[i].data!=-999.9){
          if (Verification == 1) {
            this.filteredMCorRMCS[currentMcOrRmc]['isVerified'] = this.filteredMCorRMCS[currentMcOrRmc]['isVerified'] + 1;
          } else {
            this.filteredMCorRMCS[currentMcOrRmc]['isNotVerified'] = this.filteredMCorRMCS[currentMcOrRmc]['isNotVerified'] + 1;
          }
        }
      }

      if (new Date(date) > new Date()) {
        this.filteredMCorRMCS[currentMcOrRmc]['isUpdated'] = 'OutDated';
        this.filteredMCorRMCS[currentMcOrRmc]['isNotUpdated'] = 'OutDated';
      } else {
        const Updation = (this.fetcheddata[i].data == -999.9) ? 0 : 1;
        if (Updation == 1) {
          this.filteredMCorRMCS[currentMcOrRmc]['isUpdated'] = this.filteredMCorRMCS[currentMcOrRmc]['isUpdated'] + 1;
        } else {
          this.filteredMCorRMCS[currentMcOrRmc]['isNotUpdated'] = this.filteredMCorRMCS[currentMcOrRmc]['isNotUpdated'] + 1;
        }
      }
    }

  }


  sendEmail(){

  }

  showMessage(elementRef: any) {
    const value = elementRef.value.trim();
    const regex = /^\d+(\.\d)?$|^\d+(\.\d)?$/;
    if (regex.test(value)) {
      elementRef.style.background = '';
    } else {
      elementRef.style.background = 'red';
      // alert("Please enter a valid number with only one decimal place");
    }
    if(Number(elementRef.value) > 400){
          elementRef.style.background = 'red'
          alert("Rainfall is greater than 400mm")
        }else{
          elementRef.style.background = ''
        }
  }

  submit(type:string, MCorRMCName:string){

    this.currentSubmitType = type;
    this.currentSubmitMCorRMCName = MCorRMCName

    this.showIsUpdatesTable = false;
    this.showIsNotUpdatesTable = false;
    this.showIsVerifiedTable = false;
    this.showIsNotVerifiedTable = false

    this.dataToDisplay = [];

    if(type=='isUpdated'){
      this.onIsUpdatedSubmit(MCorRMCName);
    }
    if(type=='isVerified'){
      this.onIsVerifiedSubmit(MCorRMCName);
    }
    if(type=='isNotVerified'){
      this.onIsNotVerifiedSubmit(MCorRMCName);
    }
    if(type=='isNotUpdated'){
      this.onIsNotUpdatedSubmit(MCorRMCName);
    }

    this.showIsUpdatesTable = type === 'isUpdated';
    this.showIsNotUpdatesTable = type === 'isNotUpdated';
    this.showIsVerifiedTable = type === 'isVerified';
    this.showIsNotVerifiedTable = type === 'isNotVerified'

    this.bottom_section = true;
    window.scrollTo({
      top: 1000,
      behavior: 'smooth'
    });

  }

  onIsUpdatedSubmit(MCorRMCName:String){
    let index = 1
    for(let i=0; i<this.fetcheddata.length; i++){
      const currentMcOrRmc = this.fetcheddata[i]['centre_type']+' '+this.fetcheddata[i]['centre_name']
      if(currentMcOrRmc==MCorRMCName){
        console.log('whtehr equal or not', currentMcOrRmc, MCorRMCName)

        if(this.fetcheddata[i].data != -999.9){
          const temprecord = {
            'SNo': index++,
            'district' : this.fetcheddata[i].district_name, 
            'stationname' : this.fetcheddata[i].station_name, 
            'stationid' : this.fetcheddata[i].station_code, 
            'rainfall' : this.fetcheddata[i].data,
            'status' : 'Updated' 
        }
        this.dataToDisplay.push(temprecord);
        }
      }
    }


  }

  onIsNotUpdatedSubmit(MCorRMCName: string){
    let index=1
    for(let i=0; i<this.fetcheddata.length; i++){
      const currentMcOrRmc = this.fetcheddata[i]['centre_type']+' '+this.fetcheddata[i]['centre_name']
      if(currentMcOrRmc==MCorRMCName){
        if(this.fetcheddata[i].data===-999.9){
          const temprecord = {
            'SNo': index++,
            'district' : this.fetcheddata[i].district_name, 
            'stationname' : this.fetcheddata[i].station_name, 
            'stationid' : this.fetcheddata[i].station_code, 
            'rainfall' : this.fetcheddata[i].data,
            'status' : 'Not Updated' 
        }
        this.dataToDisplay.push(temprecord);
        }
      }
    }


  }

  onIsVerifiedSubmit(MCorRMCName: string){
    let index=1
    for(let i=0; i<this.fetcheddata.length; i++){
      const currentMcOrRmc = this.fetcheddata[i]['centre_type']+' '+this.fetcheddata[i]['centre_name']
      if(currentMcOrRmc==MCorRMCName){
        if(this.fetcheddata[i].is_verified==1  && this.fetcheddata[i].data!=-999.9){
          console.log('balu')

          const temprecord = {
            'SNo': index++,
            'district' : this.fetcheddata[i].district_name, 
            'stationname' : this.fetcheddata[i].station_name, 
            'stationid' : this.fetcheddata[i].station_code, 
            'rainfall' : this.fetcheddata[i].data,
            'verifiedTime' : this.formatDate(new Date(this.fetcheddata[i].verified_at)),
            'status' : 'Verified' 
        }
        this.dataToDisplay.push(temprecord);
        }
      }
    }
  }    
  
  
  onIsNotVerifiedSubmit(MCorRMCName: string){

    let index=1
    for(let i=0; i<this.fetcheddata.length; i++){
      const currentMcOrRmc = this.fetcheddata[i]['centre_type']+' '+this.fetcheddata[i]['centre_name']
      if(currentMcOrRmc==MCorRMCName){
        if(this.fetcheddata[i].is_verified==0 && this.fetcheddata[i].data!=-999.9){
          const temprecord = {
            'SNo': index++,
            'district' : this.fetcheddata[i].district_name, 
            'stationname' : this.fetcheddata[i].station_name, 
            'stationid' : this.fetcheddata[i].station_code, 
            'rainfall' : this.fetcheddata[i].data,
            'verifiedTime' : this.fetcheddata[i].verified_at,
            'status' : 'Not Verified'
        }
        this.dataToDisplay.push(temprecord);
        }
      }
    }
  }

}


