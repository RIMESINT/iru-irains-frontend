import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environment/environment';
// import { RegionService } from 'src/app/services/region/region.service';
import { getRegionService } from 'src/app/services/region/getregion.service';
import { CenterService } from 'src/app/services/centre/centre.service';
import { getStateService } from 'src/app/services/state/getState.service';
import { getDistrictService } from 'src/app/services/district/getdistrict.service';
import { DataService } from '../../data.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FetchStationDataService } from 'src/app/services/station/station.service';
import { DataEntryService } from 'src/app/services/dataEntry/dataEntry.service';


@Component({
  selector: 'app-yearly-station-statistics-page',
  templateUrl: './yearly-station-statistics-page.component.html',
  styleUrls: ['./yearly-station-statistics-page.component.css']
})

export class YearlyStationStatisticsPageComponent {

    @ViewChild('fileInput') fileInput!: ElementRef;
    @ViewChild('rainfallFileInput') rainfallFileInput!: ElementRef;
    selectedRegions: any[] = [];
    selectedStates: any[] = [];
    selectedMcs: any[] = [];
    selectedRMcs: any[] = [];
    selectedDistricts: any[] = [];
    tempfilteredStations: any[] = [];
    regionList: any[] = [];
    filteredMcs: any[] = [];
    filteredRMcs: any[] = [];
    filteredStates: any[] = [];
    filteredDistricts: any[] = [];
    filteredStations: any[] = [];
    selectedDate: Date = new Date();
    selectedFile: File | null = null;
    selectedRainfallFile: File | null = null;
    rainFallInMM: number = 0;
    todayDate: string;
    showEditPopup: boolean = false;
    showdeletePopup: boolean = false;
    previousstationid: any;
    editData: any = {
      stationname: '',
      stationid: '',
  
      center_type : '',
      center_name : '',
  
      dateTime: '',
      stationType: '',
      newOrOld: '',
      lat: '',
      lng: '',
      activationDate: '',
      editIndex: null,
      previousstationid: null
    };
    deleteData: any = {
      stationname: '',
      stationid: '',
      editIndex: null,
    };
    mcdata = [
      {id:101, name: "mc1"},
      {id:101, name: "mc1"},
      {id:101, name: "mc1"},
      {id:101, name: "mc1"},
      {id:101, name: "mc1"}
    ]
  
    showPopup: boolean = false;
    message: string | null = null;
    existingstationdata: any[] = [];
    data = {
      stationName: '',
      stationId: '',
  
      center_type : '',
      center_name : '',
  
      dateTime: new Date(),
      stationType: 'aws',
      newOrOld: 'new',
      lat: '',
      lng: '',
      activationDate: this.selectedDate
    };
    minDate: string = '';
    loggedInUserObject: any;
    emailGroups:any[]=[];
    emails:any[]=[];
    loggedInUser: any;
    currentUserType:any;
    currentUserName: any;
    regionName: any;
    currentUserMCorRMC:any;
    currentUserMCorRMCregion :any;
  
    // currentUserType:any;
    // loggedInUser: any;
    regions: any[] = []; // Array to hold region data fetched from API
    selectedRegion: any; 
    centersMC: any[] = [];
    centersMC1: any[] = [];
    selectedMC: any;
    centersRMC: any[] = [];
    selectedRMC: any;
    centersRMC1: any[] = [];
    states: any[] = [];
    filterStates: any;
    selectedState: any;
    districts: any[] = [];
    filterDistrict: any;
    mcDisabled: boolean = false;
    rmcDisabled: boolean = false;
  
    selectedMCData: any[] = [];
    selectedRMCData: any[] = [];
    selectedStateData: any[] = [];
    selectedDistrictData: any[] = [];
    filteredData: any[] = [];
  
    StartDate: any;
    EndDate: any;
  
    stationData: any;  // Variable to hold the fetched data
    isLoading: boolean = false;  
  
    enteredFromDate: string = "";
    enteredEndDate: string = "" ;
  
    constructor(
      private dataService: DataService,
      private regionService: getRegionService, 
      private centerService: CenterService, 
      private getStateService: getStateService, 
      private getDistrictService: getDistrictService,
      private fetchStationDataService: FetchStationDataService,
      private stationService : FetchStationDataService,
      private dataEntryService : DataEntryService
    ) {
      let loggedInUser: any = localStorage.getItem("isAuthorised");
      this.loggedInUserObject = JSON.parse(loggedInUser);
      this.currentUserType = this.loggedInUserObject.data[0].mcorhq;
      this.currentUserName = this.loggedInUserObject.data[0].name.replace(/^\S+\s/, "");
  
      // console.log('this.currentUserName', this.currentUserName);
      if(this.currentUserType == "mc" || this.currentUserType == "rmc"){
  
        console.log(this.currentUserType, this.currentUserName);
        const regex = /^(RMC|MC)\s(\w+)/;
        const match = this.loggedInUserObject.data[0].name.match(regex);
        const extractedValue = match ? match[1] : ''; // extractedValue will be "RMC" if matched
  
        // console.log(extractedValue); // Output: "RMC"
  
  
        this.centerService.fetchData(extractedValue).subscribe(
          response => {
            console.log('center detail', response);
            const regionCode = response.data.filter((it:any) => it.centre_name == this.currentUserName.toUpperCase());
            // console.log(regionCode);
            // this.onRegionChange();
            
            this.regionService.fetchData()
            .subscribe(
              response => {
          
                 this.regionName = response.data.filter((it:any)=> it.region_code == regionCode[0].region_code);
                 this.regionName = this.regionName[0]?.region_name;
                //  console.log('regionName', this.regionName)
                
              },
              error => {
                console.error('Error fetching region data:', error);
                alert('Data is not coming');
              }
            );
  
            this.getStateService.fetchData().subscribe(
              response =>{
  
                const filterState = response.data.filter((id: any)=> id.centre_name === this.currentUserName.toUpperCase());
                console.log('filterState', filterState);
                this.filterStates = filterState.map((state: any) => ({
                  state_name: state.state_name,
                  state_code: state.state_code
                }));
  
            console.log('filterStates', this.filterStates);      
        
            }
          )
  
          },
          error=>{
            console.error('Error fetching center details:', error)
          }
        )
      }
  
      if(this.loggedInUserObject.data[0].mcorhq == 'mc'){
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() - 29);
        this.minDate = this.formatDate(todayDate);
      }
  
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
  
      this.todayDate = yyyy + '-' + mm + '-' + dd;
      // this.fetchRegionData();
    }
  
    ngOnInit(): void {
      this.loggedInUser = localStorage.getItem("isAuthorised");
      const obj  = JSON.parse(this.loggedInUser);
      this.currentUserType = obj.data[0].mcorhq
      console.log('currentUserType',this.currentUserType)
  
      this.fetchRegionData();
      this.getAllMCData();
      this.getAllRMCData();
      this.getAllStates();
      this.getAllDistricts();
    
  
      // this.fetchDataFromBackend();
      this.dataService.getEmailGroup().subscribe(res => {
        this.emailGroups = res;
        this.emailGroups.forEach(x => {
          JSON.parse(x.emails).forEach((j:any) => {
            this.emails.push(j);
          })
        })
      })    
  
    }
  
    getCurrentDate(): string {
      const currentDate = new Date();
      // Format date as yyyy-MM-dd (assuming you need it in this format)
      const formattedDate = currentDate.toISOString().slice(0, 10);
      return formattedDate;
    }
  
    onChangeDate(value:any){
      this.selectedDate = value;
      this.clearRainfallFileInput();
    }
  
    onChangeRegion(){
      let tempMcs = this.existingstationdata.filter(item => {
        return this.selectedRegions.some((value:any) => {
          return item.region == value.name;
        });
      });
      let tempfilteredMcs = Array.from(new Set(tempMcs.map(a => a.rmc_mc)));
      this.selectedMcs = [];
      this.selectedRMcs = [];
      this.selectedStates = [];
      this.selectedDistricts = [];
      this.filteredMcs = [];
      tempfilteredMcs.forEach(m => {
        if(m.split(" ")[0] == "MC"){
          this.filteredMcs.push({name: m})
        }
      });
  
      this.filteredRMcs = [];
      tempfilteredMcs.forEach(m => {
        if(m.split(" ")[0] == "RMC"){
          this.filteredRMcs.push({name: m})
        }
      });
    }
  
    onChangeMc(){
      let tempStates = this.existingstationdata.filter(item => {
        return this.selectedMcs.some((value:any) => {
          return item.rmc_mc == value.name;
        });
      });
      let tempfilteredStates = Array.from(new Set(tempStates.map(a => a.state)));
      this.selectedStates = [];
      this.selectedDistricts = [];
      this.filteredStates = tempfilteredStates.map(a => { return {name: a}});
    }
  
    onChangeRMc(){
      let tempStates = this.existingstationdata.filter(item => {
        return this.selectedRMcs.some((value:any) => {
          return item.rmc_mc == value.name;
        });
      });
      let tempfilteredStates = Array.from(new Set(tempStates.map(a => a.state)));
      this.selectedStates = [];
      this.selectedDistricts = [];
      this.filteredStates = tempfilteredStates.map(a => { return {name: a}});
    }
  
    onChangeState(){
      let tempDistricts = this.existingstationdata.filter(item => {
        return this.selectedStates.some((value:any) => {
          return item.state == value.name;
        });
      })
      let tempfilteredDistricts = Array.from(new Set(tempDistricts.map(a => a.district)));
      this.selectedDistricts = [];
      this.filteredDistricts = tempfilteredDistricts.map(a => { return {name: a}});
    }
  
    onChangeDistrict(){
      let tempStations = this.existingstationdata.filter(item => {
        return this.selectedDistricts.some((value:any) => {
          return item.district == value.name;
        });
      })
      this.tempfilteredStations = Array.from(new Set(tempStations.map(a => a.station)));
    }
  
    shareCheckedList(item:any[]){
      console.log(item);
    }
    shareIndividualCheckedList(item:any){
      console.log(item);
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
      this.dataService.existingstationdata().subscribe({
        next: (value) => {
          this.existingstationdata = value;
          this.regionList = Array.from(new Set(this.existingstationdata.map(a => a.region)));
          let regionList = Array.from(new Set(this.existingstationdata.map(a => a.region)));
          this.regionList = regionList.map(x => {
            return {name: x}
          })
          if(this.currentUserType=='mc'){
            const obj  = JSON.parse(this.loggedInUser);
            const mcOrRmc = obj.data[0].name
            let region = ''
            for(let i=0; i<this.existingstationdata.length; i++){
              if(this.existingstationdata[i].rmc_mc.toLowerCase()==mcOrRmc.toLowerCase()){
                region = this.existingstationdata[i].region;
              }
            }
            this.selectedRegions = [{name:region}]
            this.onChangeRegion()
            this.currentUserMCorRMCregion = region.toUpperCase()
            if (mcOrRmc.startsWith("MC")) {
              const some = {'name' : mcOrRmc.toUpperCase()}
              this.selectedMcs.push(some)
              this.onChangeMc()
              this.currentUserMCorRMC = mcOrRmc.toUpperCase()
            } else if (mcOrRmc.startsWith("RMC")) {
              const some = {'name' : mcOrRmc.toUpperCase()}
              this.selectedRMcs = [some]
              this.onChangeRMc()
              this.currentUserMCorRMC = mcOrRmc.toUpperCase()
  
            }
            console.log(mcOrRmc, obj, this.existingstationdata)
          }
          this.filterByDate();
        },
        error: (err) => console.error('Error fetching data:', err),
      });
  
    }
  
    filterByDate() {
      console.log(this.selectedRegions, this.selectedMcs, this.selectedRMcs, this.selectedStates, this.selectedDistricts)
      if(this.tempfilteredStations && this.tempfilteredStations.length > 0){
        this.filteredStations = this.existingstationdata.filter(item => {
          return this.tempfilteredStations.some((value:any) => {
            return item.station == value;
          });
        })
      }
      else if(this.selectedStates && this.selectedStates.length > 0){
        this.filteredStations = this.existingstationdata.filter(item => {
          return this.selectedStates.some((value:any) => {
            return item.state == value.name;
          });
        })
      }
      else if(this.selectedMcs && this.selectedMcs.length > 0){
        this.filteredStations = this.existingstationdata.filter(item => {
          return this.selectedMcs.some((value:any) => {
            return item.rmc_mc == value.name;
          });
        })
      }
      else if(this.selectedRegions && this.selectedRegions.length > 0){
        this.filteredStations = this.existingstationdata.filter(item => {
          return this.selectedRegions.some((value:any) => {
            return item.region == value.name;
          });
        })
      }
      this.filteredStations.map(x => {
        return x.RainFall = x[this.dateCalculation()];
      })
      // if(this.filteredStations.length > 0){
      //   setTimeout(() => {
      //     this.sendEmail();
      //   }, 1000);
      // }
    }  

    submit() {
      let data = {
        date: this.dateCalculation(),
        updatedstationdata: this.filteredStations
      }
      this.dataService.updateRainFallData(data).subscribe(res => {
        alert("Updated")
        this.fetchDataFromBackend();
      })
    }
   
     
    private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  
    clearRainfallFileInput(): void {
      // Reset the value of the file input element
      if (this.rainfallFileInput) {
        this.rainfallFileInput.nativeElement.value = '';
      }
    }
  
    sampleFile(){
      let data:any[] = [];
      this.filteredStations.forEach(x => {
        let station:any = {
          stationname: x.stationname,
          rmc_mc: x.rmc_mc,
          stationid: x.stationid
        }
        station[this.dateCalculation()] = x[this.dateCalculation()];
        data.push(station);
      })
      return data;
    }
  
    downloadRainfallSampleFile(){
      this.exportAsExcelFile(this.sampleFile(), 'export-to-excel');
      // window.open('/assets/rainfall_sample_file.xlsx', '_blank');
    }
  
  
    exportAsExcelFile(json: any[], excelFileName: string): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      console.log('worksheet', worksheet);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }
  
    saveAsExcelFile(buffer: any, fileName: string): void {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + 'export' + new Date().getTime() + EXCEL_EXTENSION);
    }
  
  
    generateTextFormat(data:any): string {
      let text = '';
      for (let entry of data) {
        text += `${entry['station']}: ${entry['rainfall']}mm\n`;
      }
      return text;
    }
  
    groupByMc(mc:any) {
      const groups:any = {};
      mc.forEach((station:any) => {
        const rmc_mc:any = station.rmc_mc;
        if (!groups[rmc_mc]) {
          groups[rmc_mc] = [];
        }
        groups[rmc_mc].push(station);
      });
      const result = [];
      for (const rmc_mc in groups) {
        if(rmc_mc == this.selectedMcs[0]){
          result.push({ rmc_mc: rmc_mc, mc: groups[rmc_mc] });
        }
      }
      return result;
    }
  
    sendEmail(){
      // if (confirm("Do want to send email") == true) {
        // let emails = ["saurav97531@gmail.com", "tarakesh@rimes.int"];
        let emails = ["saurav97531@gmail.com"];
  
        let resdata = this.groupByMc(this.existingstationdata);
        let emaildata:any[]=[];
        resdata.forEach(stn => {
          stn.mc.forEach((s:any) => {
            if(s[this.dateCalculation()] == -999.9){
              emaildata.push({station: s.station, rainfall: s[this.dateCalculation()]});
            }
          })
        })
  
        emails.forEach(email => {
          let data = {
            to: email,
            subject: `Rainfall data not received - ${new Date().toDateString()}`,
            text: `Hello,\n\n Rainfall data not received for these stations:-\n\n ${this.generateTextFormat(emaildata)}`
          }
          this.dataService.sendEmail(data).subscribe(res => {
            console.log("Email Sent Successfully");
          })
        })
      // }
    }
  
    
    fetchRegionData() {
      this.regionService.fetchData()
        .subscribe(
          response => {
            console.log('Region data:', response);
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
        // console.log("here",this.selectedRegion);
        // console.log(this.centersMC[0]);
        
        const filteredCenters = this.centersMC[0]?.filter((center: any) => this.selectedRegion.includes(center.region_code));
        // console.log('Filtered centers:', filteredCenters);
  
        this.centersMC.push(filteredCenters);
        // console.log('centersMC', this.centersMC);
  
        let lenOfCenterMC = this.centersMC.length;
        // console.log('lenOfCenterMC', lenOfCenterMC)
        this.centersMC1 = this.centersMC[lenOfCenterMC - 1];
        console.log('this.centersMC1', this.centersMC1);
        
        // <- RMC ->
        const filteredCentersRMC = this.centersRMC[0]?.filter((center: any)=> this.selectedRegion.includes(center.region_code));
        console.log('filteredCentersRMC', filteredCentersRMC);
  
        this.centersRMC.push(filteredCentersRMC);
  
        let lenOfCenterRMC = this.centersRMC.length;
        this.centersRMC1 = this.centersRMC[lenOfCenterRMC - 1];
        console.log('centersRMC1', this.centersRMC1);
  
      }
    }
  
    onMcChange(event: any): void{
      this.selectedMCData = event.value;
  
      this.rmcDisabled = this.selectedMC.length > 0;
  
      console.log('selectedMC', this.selectedMC);
      console.log('centersMC1', this.centersMC1);
      console.log(this.states[0].data);
  
      // const filteredStates = this.states[0].data.filter((center: any) => this.selectedMC.includes(center.centre_name));
      // console.log('filteredStates', filteredStates);
  
      // this.states.push(filteredStates);
      // console.log('states', this.states);
  
      const filteredStates = this.states[0].data.filter((state: any) => {
        return this.selectedMC.some((mc: any) => mc.centre_name == state.centre_name);
      });
      
      console.log('Filtered states:', filteredStates);
      this.filterStates = filteredStates;
    }
  
    onRMcChange(event: any): void {
      
      this.selectedMCData = event.value;
  
      this.mcDisabled = this.selectedRMC.length > 0;
  
      const filterStatesRMC = this.states[0].data.filter((state: any)=>{
        return this.selectedRMC.some((rmc: any)=> rmc.centre_name == state.centre_name);
      })
  
      console.log('Filtered RMC States:', filterStatesRMC);
      this.filterStates = filterStatesRMC;
  
    }
  
    onStateChange(event: any): void {
  
    this.selectedStateData = event.value;
    console.log('selectedStateData', this.selectedStateData)
  
    console.log('selectedState', this.selectedState);
    console.log('districts', this.districts);
  
    const filteredDistricts = this.districts[0].data.filter((dist: any) => {
      return this.selectedState.some((mc: any) => mc.state_code == dist.state_code);
    })
    console.log('Filtered district', filteredDistricts);
    this.filterDistrict = filteredDistricts;
  
    }
  
    onDistrictChange(event : any): void {
      console.log("District change", event.value);
      this.selectedDistrictData = event.value;
      console.log('selectedDistrictData =>', this.selectedDistrictData)
    }

    getCurrentDateFormatted(): string {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  
    async fetchStationData(enteredFromDate: string, enteredEndDate: string): Promise<void> {
      this.isLoading = true;  // Set loading to true before starting the API call
    
      if (enteredFromDate === "" || enteredEndDate === "") {
        const currentDate = this.getCurrentDateFormatted();
        enteredFromDate = currentDate;
        enteredEndDate = currentDate;
      }
    
      try {
        const response: any = await this.fetchStationDataService.fetchInRangeStationdata(enteredFromDate, enteredEndDate).toPromise();
        this.stationData = response?.data;  // Store the fetched data
        console.log('Data fetched successfully:', this.stationData);
        console.log(this.enteredFromDate, this.enteredEndDate);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.isLoading = false;  // Set loading to false once data is fetched or in case of error
      }
    }
    

    onDateChangeFromDate (event: any): void {
      console.log('event.target.value', event.target.value);
      this.enteredFromDate = event.target.value;
  
      // this.fetchStationData(this.enteredFromDate);
    }
    onDateChangeEndDate (event: any): void {
      console.log('event.target.value', event.target.value);
      this.enteredEndDate = event.target.value;
  
      // this.fetchStationData(this.enteredEndDate);
    
    }
  
    async filterStationData(): Promise<void> {
      await this.fetchStationData(this.enteredFromDate, this.enteredEndDate);
    

      this.filteredData = this.stationData;
      console.log("sd data ->", this.stationData);
      console.log("fl data ->", this.filteredData);
  
      if (this.selectedRegion && this.selectedRegion.length > 0) {
        this.filteredData = this.filteredData.filter((station: any) => 
          this.selectedRegion.includes(station.region_code)
        );
      }
  
      if (this.selectedMCData && this.selectedMCData.length > 0) {
        const selectedMCNames = this.selectedMCData.map(mc => mc.centre_name);
        this.filteredData = this.filteredData.filter((station: any) => 
          selectedMCNames.includes(station.centre_name)
        );
        console.log("filteredData after rmc:", this.filteredData);
  
      }
  
      if (this.selectedRMCData && this.selectedRMCData.length > 0) {
        const selectedRMCNames = this.selectedRMCData.map(rmc => rmc.centre_name);
        this.filteredData = this.filteredData.filter((station: any) => 
          selectedRMCNames.includes(station.centre_name)
        );
        console.log("filteredData after rmc:", this.filteredData);
  
      }
  
      if (this.selectedStateData && this.selectedStateData.length > 0) {
        const selectedStateCodes = this.selectedStateData.map((state: any) => state.state_code);
        console.log("selectedStateCodes",selectedStateCodes);
        console.log("selectedStateData:", this.selectedStateData);
        console.log('filteredData', this.filteredData)
        this.filteredData = this.filteredData.filter((item : any) => 
          selectedStateCodes.includes(item.state_code)
        );
        console.log("filteredData after state:", this.filteredData);
      }
  
      if (this.selectedDistrictData && this.selectedDistrictData.length > 0) {
        const selectedDistrictCodes = this.selectedDistrictData.map((item: any) => item.district_code);
        // console.log("selectedStateCodes",selectedDistrictCodes);
        // console.log("selectedStateData:", this.selectedStateData);
        // console.log('filteredData', this.filteredData);
        this.filteredData = this.filteredData.filter((item : any) => 
          selectedDistrictCodes.includes(item.district_code)
        );
        console.log("filteredData after district:", this.filteredData);
      }
  
      // this.stationData = this.filteredData;
      // console.log("stationData Station Data:", this.stationData);
    }
  
    // New functions are below to get the data on ng init
      // MC Data
      getAllMCData(): void {
        this.centerService.fetchData('MC').subscribe(
          response => {
    
            console.log('getAllMCData', response)
            this.centersMC.push(response.data);
            console.log('this.centersMC', this.centersMC)  
          },
          error => {
            console.error('Error fetching center details:', error);
          }
        );
      }
  
      // RMC Data
      getAllRMCData(): void {
          this.centerService.fetchData('RMC').subscribe(
             response => {
                console.log('getAllRMCData', response)
                this.centersRMC.push(response.data);
                console.log('this.centersRMC', this.centersRMC)  
              },
              error => {
                console.error('Error fetching center details:', error);
          }
        );
      }
     
    // Get all States
    getAllStates():void {
      this.getStateService.fetchData().subscribe(
        response =>{
          console.log('All states', response);
          this.states.push(response);
          console.log('states', this.states)
        },
        error => {
          console.error('Error fetching center details:', error);
        }
      )
    }
  
    getAllDistricts(): void {
      this.getDistrictService.fetchData().subscribe(
        response => {
          console.log('All Districts', response);
          this.districts.push(response);
          console.log('Districts', this.districts);
        },
        error => {
          console.error('Error fetching center details:', error);
        }
      )
    }
  
}