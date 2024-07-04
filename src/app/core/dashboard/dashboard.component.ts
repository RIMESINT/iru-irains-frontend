import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  map: any;

  constructor() {}

  ngOnInit(): void {
    this.map = L.map('map', {
      center: [23, 90],
      zoom: 7
    });

    // Add the tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Define your custom icon options
    const customIcon = L.icon({
      iconUrl: 'assets/images/red_icon.png',  // Path to your custom marker image
      iconSize: [30, 30],  // Size of the icon
      iconAnchor: [15, 15],  // Point of the icon which will correspond to marker's location
      popupAnchor: [0, -15]  // Point from which the popup should open relative to the iconAnchor
    });

    // Example marker with custom icon
    L.marker([23, 90], { icon: customIcon }).addTo(this.map);
  }

}
