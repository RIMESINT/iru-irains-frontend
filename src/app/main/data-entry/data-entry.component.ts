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
import * as e from 'express';


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

  enteredDate: string | undefined;

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
        
          // this.getDistrictService.fetchData().subscribe(
          //     response =>{
          //       console.log('district response', response);
          //       const filterDistrictNames = response.data.filter((dist: any)=> dist.state_code == filterState[0].state_code);
          //       // Filter district names based on state_code in stateCodes array
                   
          //       console.log(filterDistrictNames);

          //       this.filterDistrict = filterDistrictNames.map((it: any)=>({
          //         district_name: it.district_name
          //       }))
          //       console.log(this.filterDistrict)

          //     }
          //   )
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
  
    this.fetchStationData("");

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

  // editStation(station: any) {
  //   this.showEditPopup = true;
  //   this.editData.stationname = station.stationname,
  //     this.editData.stationid = station.stationid,
  //     this.editData.dateTime = this.selectedDate,
  //     this.editData.stationType = station.stationtype,
  //     this.editData.newOrOld = station.neworold,
  //     this.editData.lat = station.lat,
  //     this.editData.lng = station.lng,
  //     this.editData.activationDate = station.activationdate,
  //     this.editData.previousstationid = station.stationid
  // }
  editStation(station: any) {
    this.showEditPopup = true;
    this.editData.stationname = station.stationname,
    this.editData.stationid = station.stationid,

    this.editData.center_name = station.center_name,
    this.editData.center_type = station.center_type,

    this.editData.dateTime = this.selectedDate,
    this.editData.stationType = station.stationtype,
    this.editData.newOrOld = station.neworold,
    this.editData.lat = station.lat,
    this.editData.lng = station.lng,
    this.editData.activationDate = station.activationdate,
    this.editData.previousstationid = station.stationid
    console.log('egfeufgue', this.editData)
  }
  
  deleteStationdata(index: number): void {
    this.showdeletePopup = true;
    this.deleteData = { ...this.existingstationdata[index] };
  }

  // updateData() {
  //   this.dataService.updateData(this.editData).subscribe({
  //     next: response => {
  //       this.fetchDataFromBackend();
  //       console.log('Data updated successfully:', response);
  //     },
  //     error: err => console.error('Error updating data. Please check the console for details.', err)
  //   });
  //   this.showEditPopup = false;
  // }

  // deletestation() {
  //   this.deleteData = {
  //     stationname: this.deleteData.stationname,
  //     stationid: this.deleteData.stationid,
  //     editIndex: this.deleteData.editIndex,
  //   };
  //   this.dataService.deletestation(this.deleteData.stationid).subscribe({
  //     next: response => {
  //       let loggedInUser: any = localStorage.getItem("isAuthorised");
  //       let parseloggedInUser = JSON.parse(loggedInUser);
  //       let data = {
  //         stationName: this.deleteData.stationname,
  //         stationId: this.deleteData.stationid,
  //         dateTime: new Date(),
  //         userName: parseloggedInUser.data[0].name,
  //         type: "Deleted"
  //       }
  //       this.dataService.addDeletedAndCreatedStationLogData(data).subscribe(res => {
  //         console.log('Log created successfully:', response);
  //       })
  //       console.log('Data deleted successfully:', response);
  //     },
  //     error: err => console.error('Error deleted data. Please check the console for details.', err)
  //   });
  //   this.showdeletePopup = false;
  // }

  cancelEdit() {
    this.editData = {
      stationname: this.editData.stationname,
      stationid: this.editData.stationid,
      editIndex: this.editData.editIndex,
      previousstationid: this.editData.previousstationid
    };
    this.showEditPopup = false;
  }
  canceldelete() {
    this.showdeletePopup = false;
  }
  Addstation() {
    this.showPopup = true;
  }
  cancelAddStation() {
    this.showPopup = false;
  }
  // addData() {
  //   this.dataService.addData(this.data).subscribe({
  //     next: response => {
  //       let loggedInUser: any = localStorage.getItem("isAuthorised");
  //       let parseloggedInUser = JSON.parse(loggedInUser);
  //       let data = {
  //         stationName: this.data.stationName,
  //         stationId: this.data.stationId,
  //         dateTime: new Date(),
  //         userName: parseloggedInUser.data[0].name,
  //         type: "Added"
  //       }
  //       this.dataService.addDeletedAndCreatedStationLogData(data).subscribe(res => {
  //         console.log('Log created successfully:', response);
  //       })
  //       console.log('Data deleted successfully:', response);
  //       this.message = response.message;
  //       alert("Station added successfully");
  //     },
  //     error: err => console.error('Error adding data. Please check the console for details.', err)
  //   });
  //   this.showPopup = false;
  // }

  showMessage(elementRef: any) {
    const value = elementRef.value.trim();
    const regex = /^\d+(\.\d)?$|^\d+(\.\d)?$/;
    if (regex.test(value)) {
      elementRef.style.background = '';
    } else {
      elementRef.style.background = 'red';
      // alert("Please enter a valid number with only one decimal place");
    }
    if (Number(elementRef.value) > 100) {
      elementRef.style.background = 'red'
      alert("Rainfall is greater than 100mm")
    } else {
      elementRef.style.background = ''
    }
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // uploadFile() {
  //   if (this.selectedFile) {
  //     this.dataService.uploadStationDataFile(this.selectedFile).subscribe(
  //       (response: any) => {
  //         alert('File uploaded successfully');
  //         this.clearFileInput();
  //         this.filterByDate();
  //       },
  //       (error: any) => {
  //         alert('Error uploading file:' + error);
  //       }
  //     );
  //   }else{
  //     alert('Please choose file:');
  //   }
  // }

  // clearFileInput(): void {
  //   // Reset the value of the file input element
  //   if (this.fileInput) {
  //     this.fileInput.nativeElement.value = '';
  //   }
  // }

  onRainfallFileSelected(event: any) {
    this.selectedRainfallFile = event.target.files[0];
    // this.readExcel();
  }

  readExcel(): void {
    if(this.selectedRainfallFile){
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData:any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          if(!jsonData[0].hasOwnProperty(this.dateCalculation())){
            alert("Please select correct date")
            this.clearRainfallFileInput();
          }
      };
      fileReader.readAsArrayBuffer(this.selectedRainfallFile);
    }
  }

  uploadRainFallFile() {
    // if (this.selectedRainfallFile) {
    //   this.dataService.uploadRainFallDataFile(this.selectedRainfallFile, this.dateCalculation()).subscribe(
    //     (response: any) => {
    //       alert('File uploaded successfully');
    //       this.clearRainfallFileInput();
    //       this.filterByDate();
    //     },
    //     (error: any) => {
    //       alert('Error uploading file:' + error);
    //     }
    //   );
    // }else{
    //   alert('Please choose file:');
    // }
    if (this.selectedFile) {
      // const body = {

      // }
      this.stationService.uploadRainfallDataFile(this.selectedFile).subscribe(
        (response: any) => {
          alert('File uploaded successfully');
          this.clearFileInput();
          this.filterByDate();
        },
        (error: any) => {
          alert('Error uploading file:' + error);
        }
      );
    }else{
      alert('Please choose file:');
    }
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
    console.log('balu', this.filteredData)
    this.filteredData.forEach(x => {
      let station:any = {
        stationname: x.station_name,
        rmc_mc: x.centre_type+' '+x.centre_name,
        stationid: x.station_code,
        date : this.enteredDate
      }
    
      // station[this.dateCalculation()] = x[this.dateCalculation()];
      // data.push(station);
      data.push(station);
    })

    console.log('data display', data)
    return data;
  }

  downloadRainfallSampleFile(){
    // this.exportAsExcelFile(this.sampleFile(), 'export-to-excel');
    window.open('/assets/rainfall-file.xlsx', '_blank');
    
  }

  downloadStationSampleFile(){
    window.open('/assets/rainfall_sample_upload_file.xlsx', '_blank');
  }

  downloadStationInstructionFile(){
    window.open('/assets/Instruction for adding new station.docx', '_blank');
  }

  exportAsXLSX(): void {
    this.exportAsExcelFile(this.sampleFile(), 'export-to-excel');
    // this.exportAsExcelFile(this.filteredStations, 'export-to-excel');
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

  scheduleFunction() {
    // Get current time
    var now = new Date();
    // Set desired time (in this case, 11:00 AM)
    var desiredTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
    var delay = desiredTime.getTime() - now.getTime();

    if (delay < 0) {
        // If it's already past the desired time, schedule it for tomorrow
        desiredTime.setDate(desiredTime.getDate() + 1);
        delay = desiredTime.getTime() - now.getTime();
    }

    setTimeout(() => {
      let autoEmailOnOff = JSON.parse(localStorage.getItem('autoEmail') as any);
      if(autoEmailOnOff == true){
        this.sendEmail();
      }
      // Reschedule function for the next day
      this.scheduleFunction();
    }, delay);
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
    console.log('balu',this.selectedRegion)
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

    this.selectedMCData = event.value

    console.log('event.value for MC',event.value)

    this.rmcDisabled = this.selectedMC.length > 0;

    const filteredStates = this.states[0].data.filter((state: any) => {
      return this.selectedMC.some((mc: any) => mc.centre_name == state.centre_name);
    });
    
    console.log('Filtered states:', filteredStates);
    this.filterStates = filteredStates;
  }

  onRMcChange(event: any): void {
    
    this.selectedRMCData = event.value;
    // console.log('selectedRMCData ', this.selectedRMCData );
    this.mcDisabled = this.selectedRMC.length > 0;

    const filterStatesRMC = this.states[0].data.filter((state: any)=>{
      return this.selectedRMC.some((rmc: any)=> rmc.centre_name == state.centre_name);
    })

    console.log('Filtered RMC States:', filterStatesRMC);
    this.filterStates = filterStatesRMC;

    // this.selectedRegion.forEach((code:string)=>{
    //   this.getStateService.fetchData().subscribe(
    //     response => {
    //       console.log('State Data RMC', response);
    //       const filterStateRMC = response.data.filter((id: any)=> id.region_code === code);

    //       // this.states.push(...filterStateRMC);

    //     // Add only unique states based on state_name
    //     filterStateRMC.forEach((state: any) => {
    //       if (!this.states.some(existingState => existingState.state_name === state.state_name)) {
    //         this.states.push(state);
    //       }
    //     });

    //     console.log('filterStateByRMC', filterStateRMC);
    //       console.log('state by RMC', this.states);
    //     }
    //   )
    // })
  }

  onStateChange(event: any): void {

  this.selectedStateData = event.value;
  // console.log('selectedStateData', this.selectedStateData)

  // console.log('selectedState', this.selectedState);
  // console.log('districts', this.districts);

  const filteredDistricts = this.districts[0].data.filter((dist: any) => {
    return this.selectedState.some((mc: any) => mc.state_code == dist.state_code);
  })
  console.log('Filtered district', filteredDistricts);
  this.filterDistrict = filteredDistricts;

    // if (this.selectedState && this.selectedState.length > 0) {
    //   const selectedStateCodes = this.selectedState.map((state: any) => state.state_code);
    //   console.log('selectedStateCodes', selectedStateCodes);

    //   // Fetch districts based on selected states' state_code
    //   this.getDistrictService.fetchData().subscribe(
    //     (response : any) => {
    //       console.log('District Response', response);

    //       selectedStateCodes.forEach((code: any) => {
    //         const filterDistrict = response.data.filter((district: any) => district.state_code === code);
    //         console.log('filterDistrict', filterDistrict);
    //         this.districts.push(...filterDistrict);
    //       });

    //       console.log('Filtered districts:', this.districts);
    //     },
    //     (error : any) => {
    //       console.error('Error fetching district data:', error);
    //     }
    //   );
    // } else {
    //   console.log('No states selected');
    // }
  }

  onDistrictChange(event : any): void {
    console.log("District change", event.value);
    this.selectedDistrictData = event.value;
    console.log('selectedDistrictData =>', this.selectedDistrictData)
  }

  fetchStationData(date: any): void{
    this.isLoading = true;  // Set loading to true before starting the API call
    this.fetchStationDataService.fetchStationData(date?? "")
      .subscribe(
        (response : any) => {
          this.stationData = response?.data;  // Store the fetched data
          this.isLoading = false;  // Set loading to false once data is fetched
          console.log('Data fetched successfully:', this.stationData);
        },
        (error : any) => {
          this.isLoading = false;  // Set loading to false in case of error
          console.error('Error fetching data:', error);
        }
      );
  }

  onDateChange(event: any): void {
    console.log('event.target.value', event.target.value);
    this.enteredDate = event.target.value;

    this.fetchStationData(this.enteredDate);
    // this.filterStationData();
  }

  filterStationData(): void {   
    
    this.filteredData = this.stationData;
    // console.log("sd data ->", this.stationData);
    // console.log("fl data ->", this.filteredData);

    if (this.selectedRegion && this.selectedRegion.length > 0) {
      this.filteredData = this.filteredData.filter((station: any) => 
        this.selectedRegion.includes(station.region_code)
      );
    }

    console.log('hello this.selectedMCData', this.selectedMCData)
    if (this.selectedMCData && this.selectedMCData.length > 0) {
      console.log('hi')
      const selectedMCNames = this.selectedMCData.map(mc => mc.centre_name);
      this.filteredData = this.filteredData.filter((station: any) => 
        selectedMCNames.includes(station.centre_name)
      );
      console.log("filteredData after mc:", this.filteredData);
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

  // <- Balu created fn -> 

  updateRainfallValueData(stationCode :any, stationRainfallValue:any){
    console.log('efhue',stationCode, stationRainfallValue)

    const getCurrentDateFormatted = (): string => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    let dateToUse = this.enteredDate;
    if (!dateToUse) {
      dateToUse = getCurrentDateFormatted();
    }

    let data = {
      'date' : dateToUse,
      'station_code' : +stationCode,
      'value' : +stationRainfallValue 
    }
    this.dataEntryService.updateRainfallValue(data).subscribe()  
  }

  addData() {

    // pendiong check datatypes and reflect the alert

    const body =  {
      "station_name": this.data.stationName,
      "station_id": +this.data.stationId,
      "station_type": this.data.stationType, 
      "centre_type": this.currentUserType=='mc'? this.currentUserType.toUpperCase() : this.data.center_type.toUpperCase(), 
      "centre_name": this.currentUserType=='mc'? this.formatGetMcOrRMCName(this.currentUserName).toUpperCase() : this.data.center_name.toUpperCase(), 
      "is_new_station": this.data.newOrOld=='new' ? 1 : 0, 
      "latitude":+this.data.lat, 
      "longitude":+this.data.lng,
      "activation_date":this.data.activationDate
    }

    this.stationService.addNewStation(body).subscribe()
  }



  updateData() {
    // pending : show the data before eidt
    // reflect changes : call filterbyData() to refelct the update changes in the frontend
    console.log('ppp', this.editData)
    const body =  {
      "station_name": this.editData.stationname,
      "station_id": this.editData.stationid,
      "station_type": this.editData.stationType, 
      "centre_type": this.currentUserType=='mc'? this.currentUserType.toUpperCase() : this.editData.center_type.toUpperCase(), 
      "centre_name": this.currentUserType=='mc'? this.formatGetMcOrRMCName(this.currentUserName).toUpperCase() : this.editData.center_name.toUpperCase(), 
      "is_new_station": this.editData.newOrOld=='new' ? 1 : 0, 
      "latitude":+this.editData.lat, 
      "longitude":+this.editData.lng,
      "activation_date":this.editData.activationDate
    }
    console.log(this.editData, body)
    this.stationService.editStation(body).subscribe()
  }

  formatGetMcOrRMCName(name : String){
    return name.split(" ")[1]
  }

  deletestation() {
    // not checked due to data concerns
    // remove index of the filteredStations and then
    // reflect changes : call filterbyData() to refelct the update changes in the frontend
    const tobeDeletedStation = {
      station_id : this.deleteData.station_code
    }
    this.stationService.deleteStataion(tobeDeletedStation).subscribe()
    this.showdeletePopup = false;
  }



  uploadFile() {
    if (this.selectedFile) {
      // const body = {

      // }
      this.stationService.uploadStationDataFile(this.selectedFile).subscribe(
        (response: any) => {
          alert('File uploaded successfully');
          this.clearFileInput();
          this.filterByDate();
        },
        (error: any) => {
          alert('Error uploading file:' + error);
        }
      );
    }else{
      alert('Please choose file:');
    }
  }

  clearFileInput(): void {
    // Reset the value of the file input element
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  formatLatitude(lat: string): string {
    const latitude = parseFloat(lat);
    return isNaN(latitude) ? 'Invalid' : latitude.toFixed(4);
  }

  // Method to convert and format longitude
  formatLongitude(lon: string): string {
    const longitude = parseFloat(lon);
    return isNaN(longitude) ? 'Invalid' : longitude.toFixed(4);
  }








} 