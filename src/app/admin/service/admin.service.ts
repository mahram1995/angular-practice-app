import { HttpClient, HttpParams } from '@angular/common/http';
import * as endpoints from '../service/admin.endpoints';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../../app.service/base-service';
import { HttpService } from '../../app.service/http.service';
import { UserRegistrationDTO } from './admin.domain';




@Injectable()
export class AdminService extends BaseService {

    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }

    public createUser(data: UserRegistrationDTO): Observable<any> {
        return this.http.post(endpoints.CREATE_USER, data);
    }


}
