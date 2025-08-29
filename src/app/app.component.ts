import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  logoutWorningMessage: string
  isVisibleLogoutDialog: boolean = false
  constructor(private router: Router,) {

  }

  ngOnInit(): void {

    // when user log out in any tab in then user will be logout from all 
    // other open tab and redirect to login page for login back.
    window.addEventListener('storage', (event) => {
      if (event.key === 'USER_LOGOUT') {
        // Clear current tab session
        sessionStorage.removeItem('user');
        this.logoutWorningMessage = "User Logout Warning"
        this.isVisibleLogoutDialog = true
      }
      if (event.key === 'SESSION_TIMEOUT') {
        // Clear current tab session
        sessionStorage.removeItem('user');
        this.logoutWorningMessage = "User Session Logout Warning"
        this.isVisibleLogoutDialog = true
      }
    });
  }
  title = 'Ababil';
  redirectToLoginPage() {
    // Redirect to login page if not already there
    if (this.router.url !== '/login') {
      this.isVisibleLogoutDialog = false
      this.router.navigate(['/login']);
    }
  }

}
