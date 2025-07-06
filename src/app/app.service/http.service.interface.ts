import { Observable } from "rxjs";
export declare class IRequestOptions {
    headers?: any;
    observe?: any;
    params?: any;
    reportProgress?: boolean;
    responseType?: any;
    withCredentials?: boolean;
    body?: any;
}
export interface HttpServiceInterface {
    request(method?: any, url?: any, options?: IRequestOptions): any;
    get(url: string, options?: IRequestOptions): Observable<any>;
    post(url: string, body: any, options?: IRequestOptions): Observable<any>;
    put(url: string, body: any, options?: IRequestOptions): Observable<any>;
    delete(url: string, options?: IRequestOptions): Observable<any>;
    patch(url: string, body: any, options?: IRequestOptions): Observable<any>;
    head(url: string, options?: IRequestOptions): Observable<any>;
    options(url: string, options?: IRequestOptions): Observable<any>;
    interceptRequest(observable: Observable<any>): Observable<any>;
    showLoadingModal(): void;
    hideLoadingModal(): void;
}
