import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../../app-configuration/app.service/base-service';
import { HttpService } from '../../../../app-configuration/app.service/http.service';
import { Command } from './comand.domain';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../app-configuration/app.service/environment';

const URL = BASE_URL

const GET_COMMANDS = URL + 'admin/commands/get-commands';
const SAVE_COMMANDS = URL + 'admin/commands/save-commands'
const UPDATE_COMMANDS = URL + 'admin/commands/update-command'

@Injectable()
export class CommandService extends BaseService {

    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }

    public saveCommand(data: Command, urlSearchParams): Observable<any> {
        return this.http.post(SAVE_COMMANDS, data, urlSearchParams);
    }
    public updateCommand(data: Command[], urlSearchParams): Observable<any> {
        return this.http.put(UPDATE_COMMANDS, data, urlSearchParams);
    }
    public getCommands(urlSearchParams): Observable<any> {
        return this.http.get(GET_COMMANDS, urlSearchParams);
    }

}
