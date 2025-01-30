import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface User {
  data: { name: string }[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedInUser: any; // Initialize loggedInUser as null
  Mode: any;
  isGuest : any = false

  constructor(
    private router: Router,
    private location: Location
  ) { }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {


    let loggedInUser: any = localStorage.getItem("isAuthorised");
    this.loggedInUser = JSON.parse(loggedInUser);
    if(this.loggedInUser.data[0].mcorhq=='public'){
      this.isGuest = true
    }else{
      this.isGuest = false
    }

    console.log('this.isGuest in header', this.isGuest )
  }

  logOut() {
    localStorage.removeItem("isAuthorised");
    this.router.navigate(['login']);
  }

  selectMode() {
    // let data : any= {
    //   selectedMode : mode
    // }
    let selectedMode: any = localStorage.getItem("selectedMode");
    selectedMode = JSON.parse(selectedMode);
    console.log('this.selected mOde', selectedMode)

    this.Mode = selectedMode.selectedMode
    
    // localStorage.setItem("selectedMode", JSON.stringify(data));

    if(selectedMode.selectedMode == 'Unified'){
      this.router.navigate(['front-page/unifieddeparture']);
    } else{ 
      this.router.navigate(['all-maps']);
    }
  }
}