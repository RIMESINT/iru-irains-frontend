import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-dissemination-page',
  templateUrl: './email-dissemination-page.component.html',
  styleUrls: ['./email-dissemination-page.component.css']
})
export class EmailDisseminationPageComponent implements OnInit {
    selectedMenuItem: string = 'send-email'; // To store the selected menu item
  
    constructor(){}
  
    ngOnInit(): void {}
  
    selectMenuItem(menuItem: string): void {
      this.selectedMenuItem = menuItem;
    }
  
    isSelected(menuItem: string): boolean {
      return this.selectedMenuItem === menuItem;
    }
}