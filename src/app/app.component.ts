import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './module/admin/login/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  logoutWorningMessage: string
  logoutWorningModalHeader: string;
  isVisibleLogoutDialog: boolean = false
  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnInit(): void {

    // when user log out in any tab in then user will be logout from all 
    // other open tab and redirect to login page for login back.
    window.addEventListener('storage', (event) => {
      if (event.key === 'USER_LOGOUT') {
        // Clear current tab session
        sessionStorage.removeItem('user');
        this.logoutWorningModalHeader = "User Logout Warning"
        this.logoutWorningMessage = "You are logout. Please login again"
        this.isVisibleLogoutDialog = true
      }
      if (event.key === 'SESSION_TIMEOUT') {
        // Clear current tab session
        sessionStorage.removeItem('user');
        this.logoutWorningModalHeader = "User Session Logout Warning"
        this.logoutWorningMessage = "Session is expired. Please login again"
        this.isVisibleLogoutDialog = true
      }
    });
  }
  title = 'Ababil';
  redirectToLoginPage() {
    // Redirect to login page if not already there
    if (this.authService.isLoggedIn()) {
      const returnUrl = sessionStorage.getItem('returnUrl');
      sessionStorage.removeItem('returnUrl'); // clear after use
      if (returnUrl) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/home'])

      }
      this.isVisibleLogoutDialog = false
    } else {
      if (this.router.url !== '/login') {
        this.isVisibleLogoutDialog = false
        this.router.navigate(['/login']);
      }
      this.isVisibleLogoutDialog = false
    }

  }

}
