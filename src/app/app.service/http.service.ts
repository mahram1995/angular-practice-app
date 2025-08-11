import { Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';
import { HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, timer } from "rxjs";
import { finalize } from 'rxjs/operators';
import { HttpServiceInterface, IRequestOptions } from './http.service.interface';
import { LoaderOverlayService } from './loader.overlay.service';
import { AuthService } from '../login-logout/service/auth.service';




export const HTTP_DYNAMIC_INTERCEPTORS = new InjectionToken<HttpInterceptor>('HTTP_DYNAMIC_INTERCEPTORS');

@Injectable()
export class HttpService extends HttpClient implements HttpServiceInterface {

    userInfo: any;
    public requestsPending: number = 0;
    public loaderVisble: boolean = false;


    constructor(
        private httpHandler: HttpHandler,
        @Optional() @Inject(HTTP_DYNAMIC_INTERCEPTORS) private interceptors: HttpInterceptor[] = [],
        private loaderOverlayService: LoaderOverlayService,


    ) {
        super(httpHandler);
    }

    getToken(): string | null {
        const user = sessionStorage.getItem('user');
        if (!user) {
            console.warn('No user found in sessionStorage.');
            return null;
        }
        try {
            const userInfo = JSON.parse(user);
            return userInfo?.token || null;
        } catch (error) {
            console.error('Failed to parse user JSON:', error);
            return null;
        }
    }

    getHttpHeader(userSearchParam: any, data: any): any {
        let token = this.getToken();
        let headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');

        let httpParams = new HttpParams();

        if (userSearchParam) {
            if (data === null) {
                // Add query params
                if (userSearchParam && userSearchParam instanceof Map) {
                    userSearchParam.forEach((value: any, key: string) => {
                        if (value !== null && value !== undefined) {
                            httpParams = httpParams.set(key, value); // dynamically add param
                        }
                    });
                }
            } else {
                // Optional: Add special headers
                const verifier = userSearchParam.get("verifier");
                if (verifier != null) {
                    headers = headers.set('verifier', verifier);
                }
                const detailsUI = userSearchParam.get("detailsUI");
                if (detailsUI != null) {
                    headers = headers.set('detailsUI', detailsUI);
                }
                const correctionUI = userSearchParam.get("correctionUI");
                if (correctionUI != null) {
                    headers = headers.set('correctionUI', correctionUI);
                }
            }
        }

        return {
            headers: headers,
            params: httpParams,
            responseType: 'json'
        };
    }

    public override get(url: string, options?: any): Observable<any> {
        return super.get(url, options);
    }

    public override post(url: string, data: any, options?: any): Observable<any> {
        this.showLoadingModal();
        return this.interceptRequest(super.post(url, data, this.getHttpHeader(options, data)));
    }

    public override put(url: string, data: any, options?: any): Observable<any> {
        this.showLoadingModal();
        return this.interceptRequest(super.put(url, data, this.getHttpHeader(options, data)));
    }

    public override delete(url: string, options?: any): Observable<any> {
        this.showLoadingModal();
        return this.interceptRequest(super.delete(url, this.userInfo));
    }

    public override patch(url: string, body: any, options?: IRequestOptions): Observable<any> {
        this.showLoadingModal();
        return this.interceptRequest(super.patch(url, body, this.userInfo));
    }

    public override head(url: string, options?: IRequestOptions): Observable<any> {
        return super.head(url, this.userInfo);
    }

    public override options(url: string, options?: IRequestOptions): Observable<any> {
        return super.options(url, this.userInfo);
    }

    interceptRequest(observable: Observable<any>): Observable<any> {
        this.requestsPending++;
        return observable
            .pipe(
                finalize(() => {
                    timer(100).subscribe(t => this.hideLoadingModal());
                })
            );
    }

    showLoadingModal() {
        if (!this.loaderVisble) {
            this.loaderVisble = true;
            this.loaderOverlayService.show();
        }
    }

    hideLoadingModal() {
        this.requestsPending--;
        if (this.requestsPending <= 0) {
            if (this.loaderVisble) {
                this.loaderOverlayService.hide();
            }
            this.loaderVisble = false;
        }
    }

}