import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApprovalflowServiceInterface } from './approval.flow.service.Interface';
import { BaseService, PathParameters } from '../../../app.service/base-service';
import { HttpService } from '../../../app.service/http.service';
import * as endpoints from '../service/task.endpoints';

@Injectable()
export class ApprovalflowService extends BaseService implements ApprovalflowServiceInterface {
    constructor(private http: HttpService) {
        super()
    }


    fetchApprovalFlowProfiles(urlSearchParams: Map<string, string>): Observable<any> {
        const params = this.mapToHttpParams(urlSearchParams);
        return this.http.get('/api/approvalflow/profiles', { params });
    }

    fetchApprovalflowProfileDetail(pathParams: PathParameters): Observable<any> {
        return this.http.get(`/api/approvalflow/profiles/${pathParams.id}`);
    }

    createApprovalflow(workflowProfile: any): Observable<any> {
        return this.http.post('/api/approvalflow/profiles', workflowProfile);
    }

    updateApprovalflow(workflowProfile: any, pathParams: PathParameters): Observable<any> {
        return this.http.put(`/api/approvalflow/profiles/${pathParams.id}`, workflowProfile);
    }

    fetchApprovalflowTasks(urlSearchParams: Map<string, string>): Observable<any> {
        const options = { params: this.getHttpParam(urlSearchParams) };
        return this.http.get(endpoints.GET_TASKS, options);
    }

    fetchApprovalflowTaskDetail(pathParams: PathParameters): Observable<any> {
        return this.http.get(`/api/approvalflow/tasks/detail/${pathParams.id}`);
    }

    createApprovalflowTask(workflowTask: any, pathParams: PathParameters): Observable<any> {
        return this.http.post(`/api/approvalflow/tasks/${pathParams.id}`, workflowTask);
    }

    updateApprovalflowTask(workflowTask: any, pathParams: PathParameters): Observable<any> {
        return this.http.put(`/api/approvalflow/tasks/${pathParams.id}`, workflowTask);
    }

    fetchApprovalflowCommandMappings(pathParams: PathParameters): Observable<any> {
        return this.http.get(`/api/approvalflow/commands/${pathParams.id}`);
    }

    updateApprovalflowCommandMappings(commands: any[], pathParams: PathParameters): Observable<any> {
        return this.http.put(`/api/approvalflow/commands/${pathParams.id}`, commands);
    }

    fetchPendingTasks(urlSearchParams: Map<string, any>, module_name: string): Observable<any> {
        const params = this.mapToHttpParams(urlSearchParams);
        return this.http.get(`/api/approvalflow/tasks/pending/${module_name}`, { params });
    }

    fetchVerificationInfo(urlSearchParams: Map<string, string>): Observable<any> {
        const params = this.mapToHttpParams(urlSearchParams);
        return this.http.get('/api/approvalflow/verify/info', { params });
    }

    fetchVerificationDetails(pathParams: PathParameters): Observable<any> {
        return this.http.get(`/api/approvalflow/verify/details/${pathParams.id}`);
    }

    verifyTask(command: any, pathParams: PathParameters, urlSearchParams: Map<string, string>, module_name: string): Observable<any> {
        const params = this.mapToHttpParams(urlSearchParams);
        return this.http.post(`/api/approvalflow/verify/${module_name}/${pathParams.id}`, command, { params });
    }

    fetchApprovalFlowTaskInstancePayload(pathParams: PathParameters, urlSearchParams?: any): any {
        return this.http.get(`/api/approvalflow/task-instance/${pathParams.id}`, { params: urlSearchParams });
    }

    pushElement(el: any): any {
        console.log('Element pushed:', el);
    }

    getElements(): any {
        return [];
    }

    applicationContextPath(): any {
        return '/';
    }

    private mapToHttpParams(map: Map<string, any>): HttpParams {
        let params = new HttpParams();
        map.forEach((value, key) => {
            params = params.set(key, value);
        });
        return params;
    }
}
