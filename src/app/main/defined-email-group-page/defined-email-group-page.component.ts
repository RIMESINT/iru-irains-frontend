import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { EmailLogService } from 'src/app/services/email/email.service';
@Component({
  selector: 'app-defined-email-group-page',
  templateUrl: './defined-email-group-page.component.html',
  styleUrls: ['./defined-email-group-page.component.css']
})
export class DefinedEmailGroupPageComponent implements OnInit{
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
    idOfEditedItem: number | undefined = undefined;
    showEditPopup: boolean = false;
    editGroupData: any = {
      groupName: '',
      emails: '',
    };
  
    constructor(
      private dataService: DataService,
      private createEmailGroupService: EmailLogService,
      private deleteEmailGroupService: EmailLogService,
      private updateEmailGroupService: EmailLogService,
    ){
      this.autoEmailOnOff = JSON.parse(localStorage.getItem('autoEmail') as any);
    }
  
    ngOnInit(): void {
  
      // this.dataService.emailLog().subscribe(res => {
      //   this.emailLogs = res;
      // })
      // this.dataService.getEmailGroup().subscribe(res => {
      //   this.emailGroups = res;
      //   console.log(res)
      // })

    this.createEmailGrp();
    }

      // createEmailGrp (): void {
      //   this.createEmailGroupService.fetchEmailGroups().subscribe(res =>{
      //     console.log(res)
      //     this.emailGroups = res.data
      //   })
      // }

      createEmailGrp(): void {
        this.createEmailGroupService.fetchEmailGroups().subscribe(res => {
          console.log(res);
          this.emailGroups = res.data;
          this.emailGroups.forEach(group => {
            if (typeof group.emails.mails === 'string') {
              try {
                group.emails.mails = JSON.parse(group.emails.mails);
              } catch (e) {
                console.error('Failed to parse mails:', group.emails.mails, e);
              }
            }
          });
        });
      }
      


    // getAllEmailLogs(): void {
    //   this.getEmailLogs.fetchData({limit: 10}).subscribe(
    //     response => {
    //       console.log('email log', response);
    //       this.emailLogs.push(response.data);
    //       console.log('emailLogs', this.emailLogs)
    //     },
    //     error => {
    //       console.error('Error fetching center details:', error)
    //     }
    //   )
    // }
  
    goBack() {
      window.history.back();
    }
  
    cancel(){
      this.showPopup = false;
    }
  
    addEmail(){
      this.emails.push(this.email);
      this.email = '';
    }
  
    open(){
      this.showPopup = true;
    }
  
    createEmailGroup() {
  
     if (this.emailGroups.some(group => group.groupname.toLowerCase() === this.groupName.toLowerCase())) {
       alert("Group Name already exists. Choose other name");
        return;
      }
      
      let data = {
        groupName: this.groupName,
        emails: JSON.stringify(this.emails)
      }
      console.log(data)
  
      this.createEmailGroupService.createEmailGroups(data).subscribe(res => {
        alert("Email Group Created Successfully")
      })
      
      // this.dataService.getEmailGroup().subscribe(res => {
      //   this.emailGroups = res;
      // })

      this.createEmailGrp();
  
      this.showPopup = false;
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
  
    // updateData() {
    //   console.log("update data in grp", this.editGroupData)
  
    //     if (this.idOfEditedItem === undefined) {
    //       console.error('idOfEditedItem is undefined');
    //       return;
    //      }
  
    //   this.dataService.upddateDataEmailgroup(this.idOfEditedItem, this.editGroupData).subscribe(
    //     response => {
    //       console.log('Update successful', response);
    //       // Handle successful update (e.g., navigate to another page or show a success message)
    //     },
    //     error => {
    //       console.error('Update failed', error);
    //       // Handle error
    //     }
    //   );
    //   this.showEditPopup = false;
    // }
  
    updateData() {
      console.log("Update data in group", this.editGroupData);
    
      if (this.idOfEditedItem === undefined) {
        console.error('idOfEditedItem is undefined');
        return;
      }
    
      // Convert the comma-separated string back to an array of email strings
      this.editGroupData.emails = this.editGroupData.emailsString.split(',').map((email: string) => email.trim());
    
      // Prepare data for update
      const updateData = {
        groupId: this.idOfEditedItem,
        groupName: this.editGroupData.groupName,
        emails: this.editGroupData.emails
      };
    
      // Call service to update email groups
      this.updateEmailGroupService.updateEmailGroups(updateData).subscribe(
        response => {
          console.log('Update successful', response);
          // Handle successful update (e.g., navigate to another page or show a success message)
        },
        error => {
          console.error('Update failed', error);
          // Handle error
        }
      );
    
      this.showEditPopup = false;
    }
    

      cancelEdit() {
      // this.editGroupData = {
      //   stationname: this.editGroupData.stationname,
      //   stationid: this.editGroupData.stationid,
      //   editIndex: this.editGroupData.editIndex,
      //   previousstationid: this.editGroupData.previousstationid
      // };
      this.showEditPopup = false;
    }
  
    // editGroup(station: any) {
    //   console.log(station)
    //   this.idOfEditedItem = station.id;
    //   this.showEditPopup = true;
    //   console.log(this.showEditPopup)
    //   console.log(this.editGroupData, 'before')
    //   this.editGroupData.groupName = station.groupname;
    //   this.editGroupData.emails = station.emails;
    //   console.log(this.editGroupData, 'after')
    // }

    editGroup(station: any) {
      console.log(station);
      this.idOfEditedItem = station.id;
      this.showEditPopup = true;
      console.log(this.showEditPopup);
      console.log(this.editGroupData, 'before');
      this.editGroupData.groupName = station.groupname;
      
      // Check if station.emails.mails is defined and an array before mapping
      if (Array.isArray(station.emails.mails)) {
        // Convert emails array to a comma-separated string for editing
        this.editGroupData.emailsString = station.emails.mails.join(', ');
      } else {
        console.warn('Station emails.mails is not an array:', station.emails.mails);
        this.editGroupData.emailsString = '';
      }
    
      console.log(this.editGroupData, 'after');
    }
  
    // deleteGroup(id: number): void {
    //   console.log(id)
    //      this.deleteEmailGroupService.deleteEmailGroup(id).subscribe(() => {
    //        this.emailGroups = this.emailGroups.filter((item) => item.id != id);
    //   });
    // }

    deleteGroup(groupId: number) {
      this.deleteEmailGroupService.deleteEmailGroup(groupId).subscribe(
        () => {
          console.log('Group deleted successfully');
          // Optionally, update your UI or handle success
          this.emailGroups = this.emailGroups.filter(group => group.id !== groupId);
        },
        error => {
          console.error('Failed to delete group', error);
          // Handle error, show message, etc.
        }
      );
    }
  }