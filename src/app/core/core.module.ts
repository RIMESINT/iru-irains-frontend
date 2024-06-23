import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { AppComponent } from './app/app.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from './material.module';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ContactComponent,
    NavbarComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    MaterialModule
  ]
})
export class CoreModule { }
