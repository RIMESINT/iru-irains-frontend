import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { LoginService } from 'src/app/services/auth/login.service';
import { Constants } from 'src/app/services/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
showOthersInput: any = false;
  RequestRegister() {
    this.onRegisterNewUser()
  }
  onRegister() {
    this.onRegistrationRequestSuccesfull()
  }

  isLoading: any = false;
  isForgotPasswordOpen: any = false;
  isNewPasswordOpen :any = false;
  isLoginOpen : any = true;
  isOtpOpen : any = false;
  isRegisterNewUser : any = false;
  isSuccesfullRegist: boolean = false;
  isPasswordResetSuccesfully: boolean = false;

  loginForm!: FormGroup; // Initialize form group in the constructor or ngOnInit
  ForgotPasswordForm!: FormGroup;
  NewPassWordFormAndOTPForm!: FormGroup;
  RegisterUserForm!: FormGroup;

  
  timeLeft: number = 100; // Countdown time in seconds
  interval: any;

  constructor(
    private router: Router,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private loginservice: LoginService,
    private constants : Constants
  ) {}

  ngOnInit(): void {
    // Initialize the login form in ngOnInit
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    
    this.ForgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]]
    });
    
    
    this.NewPassWordFormAndOTPForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Must be numeric
      password: ['', [Validators.required]], // Non-empty, minimum length
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator // Custom validator for password matching
    });

    this.RegisterUserForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]], // Validates 10-digit phone number
      requesterType: ['', Validators.required], // Dropdown: public, media, others
      requestRole: ['', Validators.required],    // Dropdown: superadmin, admin, user
      requestReason: ['', [Validators.required]]
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }
  

  onLoginSubmit(): void {

    let data: any = {
      IsGuestMode: false
    };
    localStorage.setItem("IsGuestMode", JSON.stringify(data));

    // Check if the form is valid before submitting
    if (this.loginForm.valid) {
      this.loginservice.userLogin(this.loginForm.value).subscribe(
        res => {
          if (res && res.message === "Login successful") {
            localStorage.setItem("isAuthorised", JSON.stringify(res));
            console.log(this.router)

            let data: any = {
              selectedMode: 'Unified'
            };
            localStorage.setItem("selectedMode", JSON.stringify(data));
            console.log(this.router)

            this.router.navigate(['/front-page/unifieddeparture']);
          } else {
            alert(res.message);
          }
        },
        error => {
          console.error("Login failed", error);
          alert("An error occurred during login.");
        }
      );
    } else {
      alert("Please fill in both username and password.");
    }
  }






  onGuestLogin(): void {
    let data1 = {
      selectedMode: this.constants.getGuestMode(),
    };

    const data = {
      username : 'guest@gmail.com',
      password : 'guest@123'
    }


    this.loginservice.userLogin(data).subscribe(
      res => {
        if (res && res.message === "Login successful") {
          localStorage.setItem("isAuthorised", JSON.stringify(res));
          console.log(this.router)

          let data: any = {
            selectedMode: 'Unified'
          };
          localStorage.setItem("selectedMode", JSON.stringify(data));
          console.log(this.router)

          this.router.navigate(['/front-page/unifieddeparture']);
        } else {
          alert(res.message);
        }
      },
      error => {
        console.error("Login failed", error);
        alert("An error occurred during login.");
      }
    );
  }
  
  

  onForgotPassword() {
    this.isLoginOpen = false;
    this.isNewPasswordOpen = false;
    this.isForgotPasswordOpen = true;
    this.isRegisterNewUser= false;
    this.isSuccesfullRegist = false;
    this.isPasswordResetSuccesfully = false


  }

  onBackToLogin() {
    this.isForgotPasswordOpen = false;
    this.isLoginOpen = true;
    this.isNewPasswordOpen = false;
    this.isRegisterNewUser= false;
    this.isSuccesfullRegist = false;
    this.isPasswordResetSuccesfully = false


  }

  onOtpAndResetPassword() {
    this.isForgotPasswordOpen = false;
    this.isLoginOpen = false;
    this.isNewPasswordOpen = true;
    this.isRegisterNewUser = false
    this.isSuccesfullRegist = false;
    this.isPasswordResetSuccesfully = false
    this.startTimer();
  }



  onRegisterNewUser() {
    this.isForgotPasswordOpen = false;
    this.isLoginOpen = false;
    this.isNewPasswordOpen = false;
    this.isRegisterNewUser = true;
    this.isPasswordResetSuccesfully = false
    this.isSuccesfullRegist = false;
  }


  onRegistrationRequestSuccesfull() {
    this.isForgotPasswordOpen = false;
    this.isLoginOpen = false;
    this.isNewPasswordOpen = false;
    this.isRegisterNewUser = false;
    this.isSuccesfullRegist = true;
    this.isPasswordResetSuccesfully = false

  }

  onPasswordResetSuccess() {
    this.isForgotPasswordOpen = false;
    this.isLoginOpen = false;
    this.isNewPasswordOpen = false;
    this.isRegisterNewUser = false;
    this.isSuccesfullRegist = false;
    this.isPasswordResetSuccesfully = true
  }



  async SendOTP() {
    if (this.ForgotPasswordForm.value.email) {
      console.log(this.ForgotPasswordForm.value, typeof this.ForgotPasswordForm.value.email);
  
      const data = {
        "email": this.ForgotPasswordForm.value.email
      }
  
      try {
        // Await the resetPassword call
        this.isLoading = true
        const res = await this.loginservice.resetPassword(data).toPromise();
        this.onOtpAndResetPassword(); 
        
      } catch (error:any) {
        const errorMessage = error.error?.message || "An error occurred during OTP sending.";
        alert(errorMessage);
      }
      finally{
        this.isLoading = false
      }
    } else {
      alert("Please check the email.");
    }
  }
  
  
  

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }



  async onVerifyOtp(): Promise<void> {
    if (this.NewPassWordFormAndOTPForm.valid) {
      const otp = this.NewPassWordFormAndOTPForm.get('otp')?.value;
      const password = this.NewPassWordFormAndOTPForm.get('password')?.value;
  
      const data = {
        email: this.ForgotPasswordForm.value.email,  // Make sure this form is accessible
        otp: otp,
        password: password
      };
  
      try {
        this.isLoading = true;
        const response = await this.loginservice.verifyOtpAndResetPassword(data).toPromise();
        if (response.success) {
          this.onPasswordResetSuccess();
        } else {
          alert(response.message || 'Verification failed. Please try again.');
        }
      } catch (error: any) {
        const errorMessage = error.error?.message || "An error occurred during OTP verification.";
        alert(errorMessage);
      } finally {
        this.isLoading = false;
      }
    } else {
      console.log('Form is invalid:', this.NewPassWordFormAndOTPForm.errors);
      alert("Please ensure all fields are correctly filled out.");
  
      // Check specific field errors
      console.log("OTP valid:", this.NewPassWordFormAndOTPForm.get('otp')?.valid);
      console.log("Password valid:", this.NewPassWordFormAndOTPForm.get('password')?.valid);
      console.log("Confirm Password valid:", this.NewPassWordFormAndOTPForm.get('confirmPassword')?.valid);
      console.log("Password Match:", this.NewPassWordFormAndOTPForm.hasError('passwordMismatch'));
    }
  }

  
  resendOtp(): void {
    this.timeLeft = 10; // Reset the timer
    this.NewPassWordFormAndOTPForm.reset();
    this.SendOTP()
    console.log('OTP Resent');
    // Add resend OTP logic here, such as calling an API to send a new OTP
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval); // Clear interval on component destroy to prevent memory leaks
    }
  }
}
