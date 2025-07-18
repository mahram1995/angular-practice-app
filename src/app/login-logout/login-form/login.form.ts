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
    isLogin: boolean

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

    }
    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.isLogin = this.authService.isLogin()

        if (this.isLogin) {
            this.router.navigate(['/home']);
        }
    }

    login() {
        if (this.loginForm.valid) {
            console.log(this.loginForm.value);
            this.authService.login(this.loginForm.value).subscribe({
                next: () => this.router.navigate(['/home']),
                error: err => this.errorMessage = 'Invalid credentials'
            });
        }
    }
}
