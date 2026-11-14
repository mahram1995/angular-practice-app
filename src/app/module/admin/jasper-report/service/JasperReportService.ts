import { Injectable } from "@angular/core";
import { BaseService } from "../../../../app-configuration/app.service/base-service";
import { HttpService } from "../../../../app-configuration/app.service/http.service";
import { BASE_URL } from "../../../../app-configuration/app.service/environment";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { DatabaseConfig } from "./jaspser.report.domain";

const URL = BASE_URL

const SAVE_JASPER_REPORT = URL + 'admin/jasper-reports';
const GET_JASPER_REPORTS = URL + 'admin/jasper-reports';
const GET_JASPER_REPORTS_CONTENT = URL + 'admin/jasper-reports/get-report-content';
const GET_JASPER_REPORTS_LOG = URL + 'admin/jasper-reports-audit/get-audit-log';
const GET_JASPER_REPORTS_DATA = URL + 'admin/jasper-reports-audit/get-report';
const GET_JASPER_REPORTS_ERROR = URL + 'admin/jasper-reports-audit/get-error';
const GET_DATA_SOURCE = URL + 'admin/database-configuration/get-database-list';
const SAVE_DATA_SOURCE = URL + 'admin/database-configuration/create-database';
const UPDATE_DATA_SOURCE = URL + 'admin/database-configuration/update-database';
const TEST_DATA_SOURCE_CONNECTION = URL + 'admin/database-configuration/test-connection';

const GET_JASPER_REPORT_AUDIT_LOG = URL + 'admin/jasper-reports/get-report-hist';
const GET_JASPER_REPORT_AUDIT_CONTENT = URL + 'admin/jasper-reports/get-report-hist-content';



@Injectable()
export class JasperReportService extends BaseService {

    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }


    public saveJasperReport(data: FormData, urlSearchParams): Observable<any> {
        return this.http.post(SAVE_JASPER_REPORT, data, urlSearchParams);
    }

    public getJasperReports(urlSearchParams): Observable<any> {
        return this.http.get(GET_JASPER_REPORTS, { params: urlSearchParams });
    }

    public getJasperReportsAuditLog(urlSearchParams): Observable<any> {
        return this.http.get(GET_JASPER_REPORTS_LOG, { params: urlSearchParams });
    }

    public getDataSource(urlSearchParams): Observable<any> {
        return this.http.get(GET_DATA_SOURCE, { params: urlSearchParams });
    }

    public getReportHistoryList(urlSearchParams): Observable<any> {
        return this.http.get(GET_JASPER_REPORT_AUDIT_LOG, { params: urlSearchParams });
    }

    public getReportHistoryContent(urlSearchParams): Observable<any> {
        return this.http.get(GET_JASPER_REPORT_AUDIT_CONTENT, { params: urlSearchParams });
    }

    public saveDataSource(data: DatabaseConfig, urlSearchParams): Observable<any> {
        return this.http.post(SAVE_DATA_SOURCE, data, urlSearchParams);
    }

    public updateDataSource(data: DatabaseConfig, urlSearchParams: Map<string, any>): Observable<any> {
        return this.http.put(UPDATE_DATA_SOURCE, data, { params: urlSearchParams });
    }

    public testDataSourceConnection(data: DatabaseConfig, urlSearchParams): Observable<any> {
        return this.http.post(TEST_DATA_SOURCE_CONNECTION, data, urlSearchParams);
    }

    public getJasperReportContent(urlSearchParams): Observable<any> {
        return this.http.get(GET_JASPER_REPORTS_CONTENT, { params: urlSearchParams });
    }


    public getJasperReportData(urlSearchParams: Map<string, any>): Observable<HttpResponse<Blob>> {

        urlSearchParams.set('responseType', 'blob');

        return this.http.get(GET_JASPER_REPORTS_DATA, {
            params: urlSearchParams,
            observe: 'response'
        });
    }

    public getJasperReportError(urlSearchParams: Map<string, any>): Observable<HttpResponse<Blob>> {

        urlSearchParams.set('responseType', 'blob');

        return this.http.get(GET_JASPER_REPORTS_ERROR, {
            params: urlSearchParams,
            observe: 'response'
        });
    }



}