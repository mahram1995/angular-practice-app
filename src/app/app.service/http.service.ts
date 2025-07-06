import { Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';
import { HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, timer } from "rxjs";
import { finalize } from 'rxjs/operators';
import { HttpServiceInterface, IRequestOptions } from './http.service.interface';
import { LoaderOverlayService } from './loader.overlay.service';




export const HTTP_DYNAMIC_INTERCEPTORS = new InjectionToken<HttpInterceptor>('HTTP_DYNAMIC_INTERCEPTORS');

@Injectable()
export class HttpService extends HttpClient implements HttpServiceInterface {

    userInfo: any;
    public requestsPending: number = 0;
    public loaderVisble: boolean = false;


    constructor(
        private httpHandler: HttpHandler,
        @Optional() @Inject(HTTP_DYNAMIC_INTERCEPTORS) private interceptors: HttpInterceptor[] = [],
        private loaderOverlayService: LoaderOverlayService

    ) {
        super(httpHandler);
    }

    public override get(url: string, options?: IRequestOptions): Observable<any> {
        return super.get(url, options);
    }

    public override post(url: string, data: any, options?: IRequestOptions): Observable<any> {
        this.showLoadingModal();

        return this.interceptRequest(super.post(url, data, options));
    }

    public override put(url: string, body: any, options?: IRequestOptions): Observable<any> {
        this.showLoadingModal();
        return this.interceptRequest(super.put(url, body, options));
    }

    public override delete(url: string, options?: IRequestOptions): Observable<any> {
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