import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApprovalflowServiceInterface } from './approval.flow.service.Interface';
import { BaseService, PathParameters } from '../../../app-configuration/app.service/base-service';
import { HttpService } from '../../../app-configuration/app.service/http.service';
import * as endpoints from '../service/task.endpoints';

@Injectable()
export class ApprovalflowService extends BaseService implements ApprovalflowServiceInterface {
    constructor(private http: HttpService, private https: HttpClient) {
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

    fetchApprovalflowTasks(params: Map<string, string>): Observable<any> {
        return this.http.get(endpoints.GET_TASKS, params);
    }

    verifyTask(params: Map<string, any>): Observable<any> {
        return this.http.post(endpoints.VERIFY_OPERATION, null, params);
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

    fetchApprovalFlowTaskInstancePayload(pathParams: PathParameters): any {
        let option = this.create(endpoints.GET_TASKS_INSTANCE_PAYLOAD, pathParams)
        return this.http.get(option);
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
