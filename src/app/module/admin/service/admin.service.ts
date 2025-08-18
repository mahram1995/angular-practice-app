import { HttpClient, HttpParams } from '@angular/common/http';
import * as endpoints from './admin.endpoints';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../../../app-configuration/app.service/base-service';
import { HttpService } from '../../../app-configuration/app.service/http.service';
import { UserRegistrationDTO } from './admin.domain';




@Injectable()
export class AdminService extends BaseService {

    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }

    public createUser(data: UserRegistrationDTO, urlSearchParams): Observable<any> {
        return this.http.post(endpoints.CREATE_USER, data, urlSearchParams);
    }
    public updateUser(data: UserRegistrationDTO, urlSearchParams): Observable<any> {
        return this.http.put(endpoints.UPDATE_USER, data, urlSearchParams);
    }
    public fetchUsers(urlSearchParams): Observable<any> {
        return this.http.get(endpoints.GET_USERS, urlSearchParams);
    }

}
