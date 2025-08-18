import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../../../../app-configuration/app.service/base-service';
import { HttpService } from '../../../../app-configuration/app.service/http.service';




@Injectable()
export class LoginService extends BaseService {


    private base = this.URL;
    private loginApi = this.URL + 'admin/auth/login';
    private logoutAPI = this.URL + 'admin/auth/logout';

    // budget Gl Acccount API
    private _getAccount = this.base + 'getAccount';


    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }

    login(data: any): Observable<any> {
        return this.httpclient.post<any>(this.loginApi, data);
    }

    logout(userName: any): Observable<any> {
        return this.httpclient.post<any>(this.logoutAPI, userName);
    }


}
