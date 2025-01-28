
import { Component, OnInit } from '@angular/core';
import { FetchStationDataService } from 'src/app/services/station/station.service';
@Component({
  selector: 'app-log-info-data-actions',
  templateUrl: './log-info-data-actions.component.html',
  styleUrls: ['./log-info-data-actions.component.css']
})
export class LogInfoDataActionsComponent implements OnInit{
  setFromAndToDate() {
    this.fetchActionData()
  }

  deletedStationLogs:any[] = [];

  stationData: any;
  today: any = new Date();
  fromDate: any = new Date();

  constructor(
    private fetchStationDataService: FetchStationDataService,    
  ) {
  }


  ngOnInit(): void {
    // this.dataService.getDeletedStationLog().subscribe(res => {
    //   this.deletedStationLogs = res.filter((x:any) => x.type != "Report Uploaded");
    // })
    this.fetchActionData();
  }

  

  async fetchActionData(): Promise<void> {
  
    try {
      const response: any = await this.fetchStationDataService.fetchActionData(this.fromDate).toPromise();
      this.stationData = response?.data;  // Store the fetched data
      console.log('Data fetched successfully:', this.stationData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  goBack() {
    window.history.back();
  }

}