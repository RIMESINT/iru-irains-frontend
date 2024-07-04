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

  loggedInUser: User | null = null; // Initialize loggedInUser as null

  constructor(
    private router: Router,
    private location: Location
  ) { }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    let loggedInUser = localStorage.getItem("isAuthorised");
    if (loggedInUser) {
      this.loggedInUser = JSON.parse(loggedInUser);
    }
  }

  logOut() {
    localStorage.removeItem("isAuthorised");
    this.router.navigate(['login']);
  }
}