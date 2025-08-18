import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.form.html',
    styleUrl: './login.form.css'
})
export class LoginFormComponent implements OnInit {
    loginForm: FormGroup;
    errorMessage: string = '';
    isLogin: boolean;
    userAgent: String;
    loginTerminal: String;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

    }
    ngOnInit(): void {

        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/home']);

        }
        this.userAgent = navigator.userAgent;
        this.authService.getDeviceIPAddress().subscribe(ip => {
            this.loginTerminal = ip;
        });


        this.loginForm = this.fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required],
            loginTerminal: [this.loginTerminal],
            userAgent: [this.userAgent,],
        });


    }



    login() {

        if (this.loginForm.valid) {

            let formvalue = this.loginForm.value
            formvalue.loginTerminal = this.loginTerminal;
            this.authService.login(this.loginForm.value).subscribe(
                (response) => {
                    this.router.navigate(['/home'])
                }
            );
        }
    }
}
