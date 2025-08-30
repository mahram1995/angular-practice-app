import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../../app-configuration/app.service/base-service';
import { HttpService } from '../../../../app-configuration/app.service/http.service';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../app-configuration/app.service/environment';
import { UDFDomain } from './udf.domain';

const URL = BASE_URL

const GET_UDFS = URL + 'admin/udf/get-udfs';
const SAVE_UDF = URL + 'admin/udf/save-udf'
const UPDATE_UDF = URL + 'admin/udf/update-udf'
const GET_UDF_BY_ID = URL + 'admin/udf/getUdfById'

@Injectable()
export class UDFService extends BaseService {

    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }

    public saveUdf(data: UDFDomain, urlSearchParams): Observable<any> {
        return this.http.post(SAVE_UDF, data, urlSearchParams);
    }
    public updateUdf(data: UDFDomain, urlSearchParams): Observable<any> {
        return this.http.put(UPDATE_UDF, data, urlSearchParams);
    }
    public getUdf(urlSearchParams): Observable<any> {
        return this.http.get(GET_UDFS, urlSearchParams);
    }

    public getUdfById(urlSearchParams): Observable<any> {
        return this.http.get(GET_UDF_BY_ID, urlSearchParams);
    }

}
