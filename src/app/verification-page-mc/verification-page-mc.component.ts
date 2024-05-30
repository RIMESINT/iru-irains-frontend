import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-verification-page',
  templateUrl: './verification-page-mc.component.html',
  styleUrls: ['./verification-page-mc.component.css']
})
export class VerificationPageMcComponent {
  currentMCorRMC = "";
  noOfUpdateVerified = 0;
  noOfUpdateNotVerified = 0;
  noOfVerified = 0;
  noOfNotVerfied = 0;
  showIsUpdatesTable: boolean = false;
  showIsNotUpdatesTable: boolean = false;
  showIsVerifiedTable: boolean = false;
  showIsNotVerifiedTable: boolean = false;
  dataToDisplay: any[]=[];
  bottom_section: boolean=false;


  filteredMcs: any[] = [];
  filteredRMcs: any[] = [];

  selectedDate: Date = new Date();

  todayDate: string;
  existingstationdata: any[] = [];

 


  ngOnInit(): void {
    const loginedMC = localStorage.getItem('isAuthorised');
    const MCData = JSON.parse(loginedMC ?? '{}');
    const loginedMCName = MCData.data[0].name;
    
    // console.log('Mc data', MCData)
    //  console.log('loginMCName', loginedMCName)
    // console.log('loginedMCData', loginedMCData)

    if(loginedMCName.split(" ")[0] == "MC"){
      this.currentMCorRMC = loginedMCName
      this.filteredMcs.push({name: loginedMCName})
    } else {
      this.currentMCorRMC = loginedMCName
      this.filteredRMcs.push({name: loginedMCName})
    }
    this.currentMCorRMC = this.currentMCorRMC.toUpperCase()
    console.log(this.currentMCorRMC)
    this.fetchDataFromBackend();
  }


  constructor(
    private dataService: DataService,
    ) {
      const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    this.todayDate = yyyy + '-' + mm + '-' + dd;
    }

    goBack() {
      window.history.back();
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
    fetchDataFromBackend(): void {
    // this.dataService.existingstationdata().subscribe({
    //   next: value => {
    //     this.existingstationdata = value;
    //     let regionList = Array.from(new Set(this.existingstationdata.map(a => a.region)));
    //     this.regionList = regionList.map(x => {
    //       return {name: x}
    //     })
    //     this.filteredStations = value.filter((x:any) => x[this.dateCalculation()] >= 0);
    //     this.filterByDate();
    //     // this.onChangeRegion();

    //   },
    //   error: err => console.error('Error fetching data:', err)
    // });
    console.log(this.currentMCorRMC)
    this.dataService.existingstationdata().subscribe({
      next: value => {
        this.existingstationdata = value;
        // console.log(this.currentMCorRMC,this.existingstationdata)
        this.existingstationdata = value.filter(
          (x:any)=>{
            return x.rmc_mc.toUpperCase() === this.currentMCorRMC.toUpperCase()
          }
        );
        console.log(this.existingstationdata)
        this.filterByDate()
        // console.log("balue filterstations", this.filteredStations);
      },
    });
  }

  filterByDate(){
    const curr_date = this.dateCalculation()
    const columnToCheck = `isverified_${curr_date}`
    this.noOfNotVerfied = this.existingstationdata.filter(
      (x:any)=>{
        // console.log('Baleu', x[columnToCheck],)
        return x[columnToCheck] == 'null' || x[columnToCheck]==null
      }

    ).length

    this.noOfVerified = this.existingstationdata.filter(
      (x:any)=>{
        // console.log('Baleu', x[columnToCheck],)
        return x[columnToCheck] != 'null' && x[columnToCheck]!=null
      }

    ).length

    this.noOfUpdateVerified = this.existingstationdata.filter(
      (x:any)=>{
        return x[curr_date]!=-999.9
      }
    ).length


    this.noOfUpdateNotVerified = this.existingstationdata.filter(
      (x:any)=>{
        return x[curr_date]==-999.9
      }
    ).length


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

  
  Verifyall() {
    // updating for all isnotverified to verify
    if(this.dataToDisplay.length>0){
      if (confirm("Do want to verify these stations") == true) {
        const filterStationIds = this.dataToDisplay.map((x:any)=>{
          return {'station_id':Number(x.stationid)}}
        )
        let data = {
          date: this.dateCalculation(),
          verifiedDateTime: new Date(),
          verifiedstationdata: filterStationIds
        }
        this.dataService.verifiedRainfallData(data).subscribe(res => {
          alert("Verified Successfully");
          this.fetchDataFromBackend()
          this.filterByDate()
        
          for(let i=0; i<this.dataToDisplay.length;i++){
            this.dataToDisplay[i]['status']='Verified'
          }
        })
      } else {

      }
    }
  }

  updateTheRainFallData() {
    console.log('datatodisplay info', this.dataToDisplay)
    const filteredStations = [];

    for(let i=0; i<this.dataToDisplay.length; i++){
      const stationid = this.dataToDisplay[i].stationid
      const rainfallToUpdate = this.dataToDisplay[i].rainfall
      filteredStations.push(
        {
          'RainFall' : rainfallToUpdate,
          'stationid' : stationid
        }
      )
    }

    let data = {
      date: this.dateCalculation(),
      updatedstationdata: filteredStations
    }
    console.log(data);
    this.dataService.updateRainFallData(data).subscribe(res => {
      alert("Updated")
      this.fetchDataFromBackend();
      this.filterByDate()
    })
    console.log('updated succesfully')
  }



  SortOrder = false;
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

  submit(type:string){
    this.showIsUpdatesTable = false;
    this.showIsNotUpdatesTable = false;
    this.showIsVerifiedTable = false;
    this.showIsNotVerifiedTable = false

    this.dataToDisplay = [];

    if(type=='isUpdated'){
      this.onIsUpdatedSubmit();
    }
    if(type=='isVerified'){
      this.onIsVerifiedSubmit();
    }
    if(type=='isNotVerified'){
      this.onIsNotVerifiedSubmit();
    }
    if(type=='isNotUpdated'){
      this.onIsNotUpdatedSubmit();
    }

    this.showIsUpdatesTable = type === 'isUpdated';
    this.showIsNotUpdatesTable = type === 'isNotUpdated';
    this.showIsVerifiedTable = type === 'isVerified';
    this.showIsNotVerifiedTable = type === 'isNotVerified'

    this.bottom_section = true;
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });

  }

  onIsUpdatedSubmit(){
    const datee = this.dateCalculation()
    let index=1
    for(let i=0; i<this.existingstationdata.length; i++){
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

    console.log('datatodisplay', this.dataToDisplay)
  }

  onIsNotUpdatedSubmit(){
    const datee = this.dateCalculation()
    let index=1
    for(let i=0; i<this.existingstationdata.length; i++){
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

    console.log('datatodisplay', this.dataToDisplay) 
  }

  onIsVerifiedSubmit(){
    const datee = this.dateCalculation()
    const column = `isverified_${datee}`
    let index=1
    for(let i=0; i<this.existingstationdata.length; i++){
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
  
  
  onIsNotVerifiedSubmit(){
    const datee = this.dateCalculation()
    const column = `isverified_${datee}`
    let index=1
    // console.log('fgeufgeufd')
    for(let i=0; i<this.existingstationdata.length; i++){
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


