import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EmailLogService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-email-log-page',
  templateUrl: './email-log-page.component.html',
  styleUrls: ['./email-log-page.component.css']
})
export class EmailLogPageComponent implements OnInit{

    autoEmailOnOff: boolean = false;
    sendTo:string = '';
    sendToGroup:string = '';
    to:string = '';
    subject:string = '';
    message:string = '';
    showPopup:boolean = false;
    emailLogs:any[]=[];
    groupName:string = '';
    email:string = '';
    emails:any[]=[];
    emailGroups: any[] = [];
    selectedDate!: Date;
  
    constructor(
      private dataService: DataService, private http: HttpClient, private getEmailLogs: EmailLogService,
    ){
      this.autoEmailOnOff = JSON.parse(localStorage.getItem('autoEmail') as any);
    }
  
    ngOnInit(): void {
      // this.dataService.emailLog().subscribe(res => {
      //   this.emailLogs = res;
      // })
      // this.dataService.getEmailGroup().subscribe(res => {
      //   this.emailGroups = res;
      // })

      this.getAllEmailLogs();
    }

    getAllEmailLogs(): void {
      this.getEmailLogs.fetchData().subscribe(
        response => {
          console.log('email log', response);
          this.emailLogs = response.data;
        
          console.log('emailLogs', this.emailLogs)
        },
        error => {
          console.error('Error fetching center details:', error)
        }
      )
    }
  
    goBack() {
      window.history.back();
    }
  
    cancel(){
      this.showPopup = false;
    }
  
    addEmail(){
      this.emails.push(this.email);
    }
  
    open(){
      this.showPopup = true;
    }
  
  
    fetchEmailLogs() {
      if (!this.selectedDate) {
        return;
      }
      const formattedDate = this.formatDate(this.selectedDate);
      console.log(formattedDate)
      this.dataService.getEmailLogs(formattedDate).subscribe(logs => {
        this.emailLogs = logs;
        console.log(this.emailLogs);
      });
    }
  
    private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    }
  
    createEmailGroup(){
      let data = {
        groupName: this.groupName,
        emails: JSON.stringify(this.emails)
      }
  
      console.log(data, "pppppppp")
      this.dataService.createEmailGroup(data).subscribe(res => {
        alert("Email Group Created Successfully")
      })
    }
  
    setAutoEmail(){
      localStorage.setItem('autoEmail', JSON.stringify(this.autoEmailOnOff));
      if(this.autoEmailOnOff == true){
        alert("Auto email turned On")
      }else{
        alert("Auto email turned Off")
      }
    }
  
    send(){
      let allToEmails:any[]=[];
      if(this.sendToGroup){
        allToEmails = JSON.parse(this.sendToGroup);
      }else{
        allToEmails.push(this.to);
      }
      allToEmails.forEach(email =>{
        let data = {
          to: email,
          subject: this.subject,
          text: this.message
        }
        this.dataService.sendEmail(data).subscribe(res => {
          // alert("Email Sent");
        })
      })
    }
  
  }