import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  map:any;

  constructor() {

  }

  ngOnInit(): void {
    this.map = L.map('map', {
      center: [23, 90],
      zoom: 7
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

  }

}
