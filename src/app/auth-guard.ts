import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
} from "@angular/router";
import { DataService } from "./data.service";
import { LoginComponent } from "./login/login/login.component";
import { LoginService } from "./services/auth/login.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private dataService: DataService,
		private router: Router,
		private loginservice : LoginService
	) { }

	async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
		const isAuthorised = this.getAuthStatus();
	
		if (!isAuthorised) {
			const data = {
				username: 'guest@gmail.com',
				password: 'guest@123'
			};
	
			try {
				console.log('Attempting login as guest...');
				const res: any = await this.loginservice.userLogin(data).toPromise();
	
				if (res && res.message === "Login successful") {
					localStorage.setItem("isAuthorised", JSON.stringify(res));
	
					const modeData = {
						selectedMode: 'Unified'
					};
					localStorage.setItem("selectedMode", JSON.stringify(modeData));
	
					console.log("Navigating to Unified Departure...");
					await this.router.navigate(['/front-page/unifieddeparture']);
				} else {
					alert(res.message);
					return false;
				}
			} catch (error) {
				console.error("Login failed", error);
				alert("An error occurred during login.");
				return false;
			}
		}
	
		const isAuthenticated = this.getAuthStatus();
		const currentUserType = this.getUserType();
	
		const allowedUsers: string[] = route.data['allowedUsers'];
		console.log("Authentication status:", isAuthenticated);
		console.log("Allowed users:", allowedUsers);
		console.log("Current user type:", currentUserType);
		console.log("Is user allowed:", allowedUsers.includes(currentUserType));
	
		if (isAuthenticated && allowedUsers.includes(currentUserType)) {
			return true;
		}
	
		console.log("Access denied. Redirecting to login...");
		await this.router.navigate(['/login']);
		return false;
	}
	

	getUserType(): string {
		var token = localStorage.getItem('isAuthorised');
		var usertype = ''
    
		if (token) {
			try {
				const parsedToken = JSON.parse(token); // Parse the JSON string
				let usertype: any = parsedToken['data'][0].mcorhq; // Access the 'data' property safely
		console.log('inner usertype', usertype)

				return usertype
			} catch (error) {
				console.error('Error parsing token:', error);
				return '';
			}
		}
		console.log('usertype', usertype)
		return ''
	}
	

	getAuthStatus(){
		var token = localStorage.getItem('isAuthorised');
		console.log('token....', token)
		if(token){
		  return true
		}else{
		  return false
		}
	  }
}








