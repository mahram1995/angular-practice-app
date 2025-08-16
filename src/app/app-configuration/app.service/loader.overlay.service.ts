import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LoaderOverlayService {
    private showProgressLoader = new Subject<any>();
    // private budgetYear = new Subject<any>();
    constructor() { }

    show() {
        this.showProgressLoader.next({ value: true });
    }

    hide() {
        //  this.showProgressLoader.next({ value: false });
    }
    showModal(): Observable<any> {
        return this.showProgressLoader.asObservable();

    }



}

