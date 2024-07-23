import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { EmailLogService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-send-email-page',
  templateUrl: './send-email-page.component.html',
  styleUrls: ['./send-email-page.component.css']
})
export class SendEmailPageComponent implements OnInit{
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
    attachments: any[] = [];
    selectedFile: File | null = null;
    selectedSection: string = 'Select Section';
    @ViewChild('fileInput') fileInput!: ElementRef;
  
  
    constructor(
      private dataService: DataService,
      private emailService: EmailLogService,
    ){
      this.autoEmailOnOff = JSON.parse(localStorage.getItem('autoEmail') as any);
    }
  
    ngOnInit(): void {
      // this.dataService.emailLog().subscribe(res => {
      //   this.emailLogs = res;
      // })
      this.emailService.fetchEmailGroups().subscribe(res => {
        console.log(res);
        this.emailGroups = res.data;
      })
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
  
  send() {
    let allToEmails: any[] = [];
    if (this.sendToGroup) {
      allToEmails = JSON.parse(this.sendToGroup);
    } else {
      allToEmails.push(this.to);
    }
  
    console.log(allToEmails);
    // Retrieve the base64 string file from localStorage
    let fileBase64 = localStorage.getItem("base64Stringfile");
    let filename = localStorage.getItem("filename");
  
    allToEmails.forEach(email => {
      let data = {
        to: email,
        subject: this.subject,
        text: this.message,
        html: `<p>${this.message}</p>`,
        attachments: [{
          filename: filename,
          content: fileBase64,
          encoding: 'base64'
        }]
      };
  
      // this.dataService.sendEmail(data).subscribe(res => {
      //   console.log("Email sent to:", email);
      // });

      console.log(data)
      this.emailService.sendEmail(data).subscribe(res => {
        console.log("Email sent to:", email);
        console.log(res);
      })
    });
  }
  
   onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      var maxSize = 1024 * 1024; // 1 MB
      if (this.selectedFile.size > maxSize) {
        alert('File size exceeds the allowed limit. Please choose a smaller file.');
        this.clearFileInput();
        return;
      }
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const dataUri = event.target.result;
        // Store the base64 string and filename in localStorage
        localStorage.setItem("base64Stringfile", dataUri.split(',')[1]); // Split to remove the Data URI prefix
         localStorage.setItem("filename", this.selectedFile?.name ?? 'unknown');
      };
      reader.readAsDataURL(this.selectedFile); // Use readAsDataURL to get the base64 string
    }
  }
  
    clearFileInput(): void {
      // Reset the value of the file input element
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  
  }