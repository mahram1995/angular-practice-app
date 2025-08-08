import { Observable } from 'rxjs';
import { PathParameters } from '../../../app.service/base-service';
export interface ApprovalflowServiceInterface {
    fetchApprovalFlowProfiles(urlSearchParams: Map<string, string>): Observable<any>;
    fetchApprovalflowProfileDetail(pathParams: PathParameters): Observable<any>;
    createApprovalflow(workflowProfile: any): Observable<any>;
    updateApprovalflow(workflowProfile: any, pathParams: PathParameters): Observable<any>;
    fetchApprovalflowTasks(urlSearchParams: Map<string, string>, pathParams: PathParameters): Observable<any>;
    fetchApprovalflowTaskDetail(pathParams: PathParameters): Observable<any>;
    createApprovalflowTask(workflowTask: any, pathParams: PathParameters): Observable<any>;
    updateApprovalflowTask(workflowTask: any, pathParams: PathParameters): Observable<any>;
    fetchApprovalflowCommandMappings(pathParams: PathParameters): Observable<any>;
    updateApprovalflowCommandMappings(commands: any[], pathParams: PathParameters): Observable<any>;
    fetchPendingTasks(urlSearchParams: Map<string, any>, module_name: string): Observable<any>;
    fetchVerificationInfo(urlSearchParams: Map<string, string>): Observable<any>;
    fetchVerificationDetails(pathParams: PathParameters): Observable<any>;
    verifyTask(command: any, pathParams: PathParameters, urlSearchParams: Map<string, string>, module_name: string): Observable<any>;
    fetchApprovalFlowTaskInstancePayload(pathParams: PathParameters, urlSearchParams?: any): any;
    pushElement(el: any): any;
    getElements(): any;
    applicationContextPath(): any;
}