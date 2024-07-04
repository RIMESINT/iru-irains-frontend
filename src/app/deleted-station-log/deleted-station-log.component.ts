import { Component, OnInit } from '@angular/core';
import { FetchStationDataService } from '../services/station/station.service';

@Component({
  selector: 'app-deleted-station-log',
  templateUrl: './deleted-station-log.component.html',
  styleUrls: ['./deleted-station-log.component.css']
})
export class DeletedStationLogComponent implements OnInit {

  deletedStationLogs:any[] = [];

  stationData: any;

  constructor(
    private fetchStationDataService: FetchStationDataService,    
  ) {
  }


  ngOnInit(): void {
    // this.dataService.getDeletedStationLog().subscribe(res => {
    //   this.deletedStationLogs = res.filter((x:any) => x.type != "Report Uploaded");
    // })
    this.fetchStationData();
  }

  

  async fetchStationData(): Promise<void> {
  
    try {
      const response: any = await this.fetchStationDataService.fetchStationLogs().toPromise();
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