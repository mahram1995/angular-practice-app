import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LoaderOverlayService {
    private showProgressLoader = new Subject<any>();
    // private budgetYear = new Subject<any>();
    constructor() { }

    show(data: boolean) {
        this.showProgressLoader.next({ value: data });
    }

    showModal(): Observable<any> {
        return this.showProgressLoader.asObservable();

    }



}

