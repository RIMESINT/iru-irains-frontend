import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedInUser: any;
  isGuest : any = false;

  constructor(
    private router: Router
    
  ) { 

  }

  ngOnInit(): void {
    let loggedInUser: any = localStorage.getItem("isAuthorised");
    this.loggedInUser = JSON.parse(loggedInUser);
    if(this.loggedInUser.data[0].mcorhq=='public'){
      this.isGuest = true
    }else{
      this.isGuest = false
    }
  }

  logOut() {
    localStorage.removeItem("isAuthorised");
    this.router.navigate(['login']);
  }


}
