import { Injectable } from "@angular/core";
import { BASE_URL } from "../../../../app-configuration/app.service/environment";
import { BaseService, PathParameters } from "../../../../app-configuration/app.service/base-service";
import { HttpClient } from "@angular/common/http";
import { HttpService } from "../../../../app-configuration/app.service/http.service";
import { Observable } from "rxjs";
import { Bank } from "./bank.domain";

const URL = BASE_URL

const GET_BANKS = URL + 'admin/financial-institute/get-financial-institute';
const GET_BANK_BY_ID = URL + 'admin/financial-institute/get-financial-institute/{bankId}';
const UPDATE_BANK = URL + 'admin/financial-institute/update-financial-institute';
const SAVE_BANK = URL + 'admin/financial-institute/create-financial-institute';
const GET_BRANCH = URL + 'admin/financial-institute/get-branch';
const UPDATE_BRANCH = URL + 'admin/financial-institute/update-branch';
const SAVE_BRANCH = URL + 'admin/financial-institute/create-branch';
const GET_BRANCH_BY_ID = URL + 'admin/financial-institute/get-branch/{branchId}';


@Injectable()
export class FinancialInstituteService extends BaseService {

    constructor(private httpclient: HttpClient,
        private http: HttpService
    ) {
        super()
    }

    public saveBank(data: Bank, urlSearchParams): Observable<any> {
        return this.http.post(SAVE_BANK, data, urlSearchParams);
    }
    public updateBank(data: Bank, urlSearchParams): Observable<any> {
        return this.http.put(UPDATE_BANK, data, urlSearchParams);
    }
    public getBank(urlSearchParams): Observable<any> {
        return this.http.get(GET_BANKS, { params: urlSearchParams });
    }
    public getBankByBankId(pathParameters: PathParameters): Observable<any> {
        let option = this.create(GET_BANK_BY_ID, pathParameters)
        return this.http.get(option);
    }

    public saveBranch(data: Bank, urlSearchParams): Observable<any> {
        return this.http.post(SAVE_BRANCH, data, urlSearchParams);
    }
    public updateBranch(data: Bank, urlSearchParams): Observable<any> {
        return this.http.put(UPDATE_BRANCH, data, urlSearchParams);
    }
    public getBranch(urlSearchParams): Observable<any> {
        return this.http.get(GET_BRANCH, { params: urlSearchParams });
    }
    public getBranchById(pathParameters: PathParameters): Observable<any> {
        let option = this.create(GET_BRANCH_BY_ID, pathParameters)
        return this.http.get(option);
    }

}