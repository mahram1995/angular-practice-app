import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, retry, tap } from 'rxjs';
import { BaseService } from '../../app.service/base-service';
import { LoginService } from './login.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private userSubject = new BehaviorSubject<any>(this.getUser());
    private logoutTimeout: any;
    private readonly TIMEOUT_MINUTES = 20;

    constructor(private http: HttpClient,
        private router: Router,
        private loginService: LoginService,
        private zone: NgZone) {
        this.setupActivityListeners();


    }

    login(data: any): Observable<any> {
        // const url = `/admin/auth/login?userName=${userName}&password=${password}`;
        return this.loginService.login(data).pipe(
            tap(user => {
                sessionStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                this.setAutoLogout();
            })
        );
    }

    logoutByUser(logoutType: String): void {
        const user = this.getUser();
        if (user?.userName) {
            const url = `${this.loginService.URL}admin/auth/logout?userName=${user.userName}&logoutType=${logoutType}`
            this.http.get(url, {
                responseType: 'text'
            }).subscribe(response => {
                sessionStorage.clear();
                this.userSubject.next(null);
                this.router.navigate(['/login']);
                clearTimeout(this.logoutTimeout)
            });
        }

    }


    getUser(): any {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    isLogin() {
        if (this.getUser) {
            return true
        } else {
            return false
        }
    }

    getUserObservable(): Observable<any> {
        return this.userSubject.asObservable();
    }

    private setAutoLogout(): void {
        clearTimeout(this.logoutTimeout);
        this.logoutTimeout = setTimeout(() => {
            this.logoutByUser('SESSTION_TIME_OUT');
        }, this.TIMEOUT_MINUTES * 60 * 1000); // 20 minutes
    }

    private setupActivityListeners(): void {
        const reset = () => {
            if (this.getUser()) this.setAutoLogout();
        };
        ['click', 'keydown', 'mousemove'].forEach(event =>
            window.addEventListener(event, reset)
        );
    }

    getDeviceIPAddress(): Observable<string> {
        return this.http.get<any>('https://api.ipify.org?format=json').pipe(
            map(res => res.ip)
        );
    }



}
