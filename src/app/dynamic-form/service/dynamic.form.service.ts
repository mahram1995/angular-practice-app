import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { HttpService } from '../../app-configuration/app.service/http.service';
import { BaseService } from '../../app-configuration/app.service/base-service';




@Injectable()
export class DynamicFormService extends BaseService {


    private base = this.URL;
    private budgetTransaction = this.URL + '/budget_transaction/';
    private familyHistory = this.URL + '/family-history/';

    // budget Gl Acccount API
    private _getAccount = this.base + 'getAccount';




    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }


    getDataFromServiceEndPoint(serviceEndpoint: string): Observable<any[]> {
        return this.httpclient.get<any[]>(`${this.base + serviceEndpoint}`);
    }



}
