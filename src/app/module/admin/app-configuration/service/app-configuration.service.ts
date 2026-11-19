import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../../app-configuration/app.service/base-service';
import { HttpService } from '../../../../app-configuration/app.service/http.service';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../app-configuration/app.service/environment';
import { Configuration } from './app-configuration.domain';

const URL = BASE_URL

const GET_COMMANDS = URL + 'admin/app-configuration/get';
const SAVE_COMMANDS = URL + 'admin/app-configuration/save'
const UPDATE_COMMANDS = URL + 'admin/app-configuration/update'

@Injectable()
export class ConfiguraitonService extends BaseService {

    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }


    public updateConfigurations(data: Configuration[], urlSearchParams): Observable<any> {
        return this.http.put(UPDATE_COMMANDS, data, urlSearchParams);
    }

    public saveConfigurations(data: Configuration[], urlSearchParams): Observable<any> {
        return this.http.post(SAVE_COMMANDS, data, urlSearchParams);
    }
    public getConfigurations(urlSearchParams): Observable<any> {
        return this.http.get(GET_COMMANDS, urlSearchParams);
    }

}
