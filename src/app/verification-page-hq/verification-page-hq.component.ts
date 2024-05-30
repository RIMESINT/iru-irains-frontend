











//------------------------------------















import { Component } from '@angular/core';
import { DataService } from '../data.service';

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
  selectedDate: Date = new Date();
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

  constructor(private dataService: DataService) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    this.todayDate = yyyy + '-' + mm + '-' + dd;
  }

  ngOnInit(): void {
    this.fetchDataFromBackend();
  }

  async updateTheRainFallData() {
    this.isLoading = true; // Show the spinner
    console.log('datatodisplay info', this.dataToDisplay);
    const filteredStations = [];

    for (let i = 0; i < this.dataToDisplay.length; i++) {
      const stationid = this.dataToDisplay[i].stationid;
      const rainfallToUpdate = this.dataToDisplay[i].rainfall;
      filteredStations.push({
        'RainFall': rainfallToUpdate,
        'stationid': stationid
      });
    }

    const data = {
      date: this.dateCalculation(),
      updatedstationdata: filteredStations
    };
    console.log(data);

    try {
      const res = await this.dataService.updateRainFallData(data).toPromise();
      alert("Updated");
      await this.fetchDataFromBackend();
      this.filterByDate();
      this.submit(this.currentSubmitType, this.currentSubmitMCorRMCName)
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false; // Hide the spinner
    }
    console.log('updated successfully');
  }

  async Verifyall() {
    if (this.dataToDisplay.length > 0) {
      if (confirm("Do you want to verify these stations?") === true) {
        const filterStationIds = this.dataToDisplay.map((x: any) => {
          return { 'station_id': Number(x.stationid) };
        });
        const data = {
          date: this.dateCalculation(),
          verifiedDateTime: new Date(),
          verifiedstationdata: filterStationIds
        };
        try {
          const res = await this.dataService.verifiedRainfallData(data).toPromise();
          alert("Verified Successfully");
          await this.fetchDataFromBackend();
          this.filterByDate();

          for (let i = 0; i < this.dataToDisplay.length; i++) {
            this.dataToDisplay[i]['status'] = 'Verified';
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  goBack() {
    window.history.back();
  }


  async fetchDataFromBackend(): Promise<void> {
    this.filteredMCorRMCS = {};
    this.filteredStations = [];
    try {
      const value = await this.dataService.existingstationdata().toPromise();
      this.existingstationdata = value;
      console.log(this.existingstationdata.length, this.existingstationdata[0].stationid, typeof(this.existingstationdata[0].stationid), this.masterStationIds);

      for (let i = 0; i < this.existingstationdata.length; i++) {
        if (this.existingstationdata[i].rmc_mc in this.filteredMCorRMCS) {
          this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['Total_Stations'] = this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['Total_Stations'] + 1;
        } else {
          this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc] = {
            'Total_Stations': 1,
          };
        }
      }

      this.filterByDate();
      this.filteredMCorRMCSArray = Object.keys(this.filteredMCorRMCS).map(key => ({
        name: key,
        data: this.filteredMCorRMCS[key]
      }));
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

   
  dateCalculation() {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    let newDate = new Date(this.selectedDate);
    let dd = String(newDate.getDate());
    const year = newDate.getFullYear();
    const currmonth = months[newDate.getMonth()];
    const selectedYear = String(year).slice(-2);
    return `${dd.padStart(2, '0')}_${currmonth}_${selectedYear}`;
  }


  filterByDate() {
    const datee = this.dateCalculation();
    const curr_date = `isverified_${datee}`;

    for (let i = 0; i < this.existingstationdata.length; i++) {
      this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isVerified'] = 0;
      this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isNotVerified'] = 0;
      this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isUpdated'] = 0;
      this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isNotUpdated'] = 0;
    }

    for (let i = 0; i < this.existingstationdata.length; i++) {
      if (this.existingstationdata[i][curr_date] === undefined) {
        this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isVerified'] = 'OutDated';
        this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isNotVerified'] = 'OutDated';
      } else {
        const Verification = (this.existingstationdata[i][curr_date] == 'null' || this.existingstationdata[i][curr_date] == null) ? 0 : 1;
        if (Verification == 1) {
          this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isVerified'] = this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isVerified'] + 1;
        } else {
          this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isNotVerified'] = this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isNotVerified'] + 1;
        }
      }

      if (this.existingstationdata[i][datee] === undefined) {
        this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isUpdated'] = 'OutDated';
        this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isNotUpdated'] = 'OutDated';
      } else {
        const Updation = (this.existingstationdata[i][datee] == -999.9) ? 0 : 1;
        if (Updation == 1) {
          this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isUpdated'] = this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isUpdated'] + 1;
        } else {
          this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isNotUpdated'] = this.filteredMCorRMCS[this.existingstationdata[i].rmc_mc]['isNotUpdated'] + 1;
        }
      }
    }
    console.log('printing filterMcorRmc', this.filteredMCorRMCS);
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
      top: 500,
      behavior: 'smooth'
    });

  }

  onIsUpdatedSubmit(MCorRMCName:String){
    const datee = this.dateCalculation()
    let index=1
    for(let i=0; i<this.existingstationdata.length; i++){
      if(this.existingstationdata[i].rmc_mc==MCorRMCName){
        if(this.existingstationdata[i][datee]!=-999.9){
          const temprecord = {
            'SNo': index++,
            'district' : this.existingstationdata[i].district, 
            'stationname' : this.existingstationdata[i].stationname, 
            'stationid' : this.existingstationdata[i].station_id, 
            'rainfall' : this.existingstationdata[i][datee],
            'status' : 'Updated' 
        }
        this.dataToDisplay.push(temprecord);
        }
      }
    }

    console.log('datatodisplay', this.dataToDisplay)
  }

  onIsNotUpdatedSubmit(MCorRMCName: string){
    const datee = this.dateCalculation()
    let index=1
    for(let i=0; i<this.existingstationdata.length; i++){
      if(this.existingstationdata[i].rmc_mc==MCorRMCName){
        if(this.existingstationdata[i][datee]==-999.9){
          const temprecord = {
            'SNo': index++,
            'district' : this.existingstationdata[i].district, 
            'stationname' : this.existingstationdata[i].stationname, 
            'stationid' : this.existingstationdata[i].station_id, 
            'rainfall' : this.existingstationdata[i][datee],
            'status' : 'Not Updated' 
        }
        this.dataToDisplay.push(temprecord);
        }
      }
    }

    console.log('datatodisplay', this.dataToDisplay) 
  }

  onIsVerifiedSubmit(MCorRMCName: string){
    const datee = this.dateCalculation()
    const column = `isverified_${datee}`
    let index=1
    for(let i=0; i<this.existingstationdata.length; i++){
      if(this.existingstationdata[i].rmc_mc==MCorRMCName){
        if(this.existingstationdata[i][column]!='null' && this.existingstationdata[i][column]!=null){
          const temprecord = {
            'SNo': index++,
            'district' : this.existingstationdata[i].district, 
            'stationname' : this.existingstationdata[i].stationname, 
            'stationid' : this.existingstationdata[i].station_id, 
            'rainfall' : this.existingstationdata[i][datee]==undefined?0:this.existingstationdata[i][datee],
            'verifiedTime' : this.existingstationdata[i][column],
            'status' : 'Verified' 
        }
        this.dataToDisplay.push(temprecord);
        }
      }
    }
  }    
  
  
  onIsNotVerifiedSubmit(MCorRMCName: string){
    const datee = this.dateCalculation()
    const column = `isverified_${datee}`
    let index=1
    // console.log('fgeufgeufd')
    for(let i=0; i<this.existingstationdata.length; i++){
      if(this.existingstationdata[i].rmc_mc==MCorRMCName){
        if(this.existingstationdata[i][column]=='null' || this.existingstationdata[i][column]==null){
          const temprecord = {
            'SNo': index++,
            'district' : this.existingstationdata[i].district, 
            'stationname' : this.existingstationdata[i].stationname, 
            'stationid' : this.existingstationdata[i].station_id, 
            'rainfall' : this.existingstationdata[i][datee]==undefined?0:this.existingstationdata[i][datee],
            'verifiedTime' : this.existingstationdata[i][column],
            'status' : 'Not Verified'
        }
        this.dataToDisplay.push(temprecord);
        }
      }
    }
  }

}


