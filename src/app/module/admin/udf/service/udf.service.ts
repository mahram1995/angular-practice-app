import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService, PathParameters } from '../../../../app-configuration/app.service/base-service';
import { HttpService } from '../../../../app-configuration/app.service/http.service';
import { catchError, Observable, throwError } from 'rxjs';
import { BASE_URL } from '../../../../app-configuration/app.service/environment';
import { UDFDomain, UserDefinedField } from './udf.domain';

const URL = BASE_URL

const GET_UDFS = URL + 'admin/udf/get-udfs';
const SAVE_UDF_PROFILE = URL + 'admin/udf/save-udf-profile'
const UPADTE_UDF_PROFILE = URL + 'admin/udf/update-udf-profile'
const SAVE_UDF = URL + 'admin/udf/save-user-defined-field'
const UPDATE_UDF = URL + 'admin/udf/update-user-defined-field'
const GET_UDF_BY_ID = URL + 'admin/udf/getUdfById'
const DELETE_USER_DIFINE_FIELD = URL + 'admin/udf/delete-user-defined-filed-byId/{id}'
const GET_REPORT = URL + 'reports/get-report'

@Injectable()
export class UDFService extends BaseService {

    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }

    public saveUdf(data: UserDefinedField, urlSearchParams): Observable<any> {
        return this.http.post(SAVE_UDF, data, urlSearchParams);
    }
    public updateUdf(data: UserDefinedField, urlSearchParams): Observable<any> {
        return this.http.put(UPDATE_UDF, data, urlSearchParams);
    }

    public saveUdfProfile(data: UDFDomain, urlSearchParams): Observable<any> {
        return this.http.post(SAVE_UDF_PROFILE, data, urlSearchParams);
    }
    public updateUdfProfile(data: UDFDomain, urlSearchParams): Observable<any> {
        return this.http.put(UPADTE_UDF_PROFILE, data, urlSearchParams);
    }
    public getUdf(urlSearchParams): Observable<any> {
        return this.http.get(GET_UDFS, urlSearchParams);
    }

    public getReportFromJasperServer(urlSearchParams: any): Observable<Blob> {
        return this.http.get(GET_REPORT, {
            params: urlSearchParams,
            responseType: 'blob' // important
        })
    }

    public getUdfById(urlSearchParams): Observable<any> {
        return this.http.get(GET_UDF_BY_ID, { params: urlSearchParams });
    }
    getDataFromServiceEndPoint(serviceEndpoint: string): Observable<any[]> {
        return this.httpclient.get<any[]>(`${this.URL + serviceEndpoint}`);
    }


    public deleteUserDifinedFieldById(pathParameters: PathParameters): Observable<any> {
        let option = this.create(DELETE_USER_DIFINE_FIELD, pathParameters)
        return this.http.delete(option);
    }


}
