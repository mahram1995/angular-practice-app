import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, retry, tap } from 'rxjs';
import { BaseService } from '../../../../app-configuration/app.service/base-service';
import { LoginService } from './login.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'user';
  private userSubject = new BehaviorSubject<any>(null);
  private logoutTimeout: any;
  private readonly TIMEOUT_MINUTES = 1;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService,
    private zone: NgZone) {
    this.initFromLocalStorage();   // 👈 hydrate session on app start / new tab
    this.setupActivityListeners();
    this.setupStorageSync();       // 👈 cross-tab sync for login/logout if desired
  }

  login(data: any): Observable<any> {
    // clear both storages to avoid stale data
    sessionStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_KEY);

    return this.loginService.login(data).pipe(
      tap(user => {
        if (user) {
          // persist in localStorage (shared across tabs) + mirror to this tab's sessionStorage
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
          sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
          this.userSubject.next(user);
          this.setAutoLogout();
          // optional: broadcast login event to other tabs
          localStorage.setItem('auth-event', JSON.stringify({ type: 'login', ts: Date.now() }));
        }
      })
    );
  }

  logoutByUser(logoutType: string): void {
    const user = this.getUser();
    if (user?.userName) {
      const url = `${this.loginService.URL}admin/auth/logout?userName=${user.userName}&logoutType=${logoutType}`;
      this.http.get(url, { responseType: 'text' }).subscribe(() => this.finishLogout(logoutType));
    } else {
      this.finishLogout(logoutType);
    }
  }

  private finishLogout(logoutType) {
    sessionStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_KEY);
    this.userSubject.next(null);
    clearTimeout(this.logoutTimeout);
    // Trigger logout event for other tabs
    localStorage.setItem(logoutType, Date.now().toString());
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  /** Prefer sessionStorage (tab copy). Fallback to localStorage (shared). */
  getUser(): any {
    const user = sessionStorage.getItem(this.STORAGE_KEY);
    if (user != 'null') {
      return JSON.parse(user);
    }
    const l = localStorage.getItem(this.STORAGE_KEY);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(l));
    return l ? JSON.parse(l) : null;
  }

  isLoggedIn(): boolean {
    const user = this.getUser();
    // adjust token key if your API uses accessToken/jwt/etc.
    return user ? true : false; // or: !!(user && (user.token || user.accessToken || user.jwt))
  }

  getUserObservable(): Observable<any> {
    return this.userSubject.asObservable();
  }

  /** If this tab has no session user but localStorage has one, copy it in. */
  private initFromLocalStorage(): void {
    const hasSession = !!sessionStorage.getItem(this.STORAGE_KEY);
    const localUser = localStorage.getItem(this.STORAGE_KEY);
    if (!hasSession && localUser) {
      sessionStorage.setItem(this.STORAGE_KEY, localUser);
      this.userSubject.next(JSON.parse(localUser));
      this.setAutoLogout();
    } else if (hasSession) {
      this.userSubject.next(JSON.parse(sessionStorage.getItem(this.STORAGE_KEY)!));
      this.setAutoLogout();
    }
  }

  private setAutoLogout(): void {
    clearTimeout(this.logoutTimeout);
    this.logoutTimeout = setTimeout(() => {
      this.logoutByUser('SESSION_TIMEOUT');
    }, this.TIMEOUT_MINUTES * 60 * 1000);
  }

  private setupActivityListeners(): void {
    const reset = () => { if (this.getUser()) this.setAutoLogout(); };
    ['click', 'keydown', 'mousemove'].forEach(ev =>
      window.addEventListener(ev, () => this.zone.run(reset))
    );
  }

  /** Optional: react in *this* tab when another tab logs in/out. */
  private setupStorageSync(): void {
    window.addEventListener('storage', (e) => {
      if (e.key === 'auth-event' && e.newValue) {
        const evt = JSON.parse(e.newValue);
        if (evt.type === 'logout') {
          sessionStorage.removeItem(this.STORAGE_KEY);
          this.userSubject.next(null);
          //this.router.navigate(['/login']);
        }
        if (evt.type === 'login') {
          this.initFromLocalStorage();
        }
      }
    });
  }

  getDeviceIPAddress(): Observable<string> {
    return this.http.get<any>('https://api.ipify.org?format=json').pipe(
      map(res => res.ip)
    );
  }


  changePassword(urlSearchParam) {

  }


}
