import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private router: Router,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private loginservice : LoginService
  ) {
   }

  loginForm:FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  onLoginSubmit() {
    this.loginservice.userLogin(this.loginForm.value).subscribe(res => {
      if(res && res.message == "Login successful"){
        localStorage.setItem("isAuthorised", JSON.stringify(res));
        this.router.navigate(['/front-page']);
      }else{
        alert(res.message);
      }
    })
  }

}
