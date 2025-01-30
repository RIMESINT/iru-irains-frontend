import { Component } from '@angular/core';

@Component({
  selector: 'app-about-section',
  templateUrl: './about-section.component.html',
  styleUrls: ['./about-section.component.css']
})
export class AboutSectionComponent {

  selectedTab: string = 'services'; // Default tab

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

}