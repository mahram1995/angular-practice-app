import { Injectable } from "@angular/core";
import { BaseService } from "../../../../app-configuration/app.service/base-service";
import { HttpService } from "../../../../app-configuration/app.service/http.service";
import { BASE_URL } from "../../../../app-configuration/app.service/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const URL = BASE_URL

const SAVE_JASPER_REPORT = URL + 'admin/jasper-reports';
const GET_JASPER_REPORTS = URL + 'admin/jasper-reports';

@Injectable()
export class JasperReportService extends BaseService {

    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }

    
        public saveJasperReport(  data: FormData, urlSearchParams): Observable<any> {
            return this.http.post(SAVE_JASPER_REPORT, data, urlSearchParams);
        }

        public getJasperReports(urlSearchParams): Observable<any> {
            return this.http.get(GET_JASPER_REPORTS, { params: urlSearchParams });
        }

}