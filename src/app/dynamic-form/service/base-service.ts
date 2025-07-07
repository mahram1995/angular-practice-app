import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
export class PathParameters {
    [parameterName: string]: any;
}
@Injectable()
export class BaseService {
    // all prefex
    //URL = 'http://192.168.0.107:9090/budget-service'
    //URL = 'http://localhost:9090/budget-service'
    // URL = 'http://192.168.0.1:8010'
    URL = 'http://localhost:5050/'

    fullURL: string

    gethttpParam(urlSearchParams: Map<string, any>) {
        let params = new HttpParams()
        for (let entry of urlSearchParams.entries()) {
            params = params.set(entry[0], entry[1])
        }
        return params
    }

    public create(url: any, parameters: PathParameters) {
        return this.getPathParameterValue(url, parameters)
    }


    getPathParameterValue(url: string, parameters: PathParameters): string {
        this.fullURL = url;
        // Use regular expression to find all matches within curly braces
        const matches = this.fullURL.match(/{(.*?)}/g);
        // Check if there are matches and extract the content
        if (matches && matches.length > 0) {
            const params = matches.map(match => match.substring(1, match.length - 1));

            for (let index = 0; index < params.length; index++) {
                let param = params[index];
                if (parameters[param]) {
                    this.fullURL = this.fullURL.replace('{' + param + '}', parameters[param])
                } else {
                    // console.log(param + " not found.");
                    throw new Error(`Parameter ${param} was not provided`);
                }
            }
        } else {
            throw new Error(`Please provide paremeter name in the end of API within in curly braces.`);
        }
        return this.fullURL
    }

    protected async extractData(res: Response): Promise<any> {
        return await res.text() === '' ? res.status : res.json();
    };

    getUrlSearchParams(params: Map<string, string>): URLSearchParams {
        let urlParams = new URLSearchParams();
        params.forEach((
            (value, key) => {
                urlParams.append(key, value);
            }));
        return urlParams;
    };



    create2(url: string, parameters: PathParameters): string {
        const placeholders = url.match(/({[a-zA-Z]*})/g);
        placeholders?.forEach((
            (placeholder) => {
                const key = placeholder.substr(1, placeholder.length - 2);
                const value = parameters[key];
                if (!value)
                    throw new Error(`Parameter ${key} was not provided`);
                if (typeof value != 'string' && typeof value != 'number')
                    throw new Error(`Value of Parameter ${key} should be either number or string`);
                url = url.replace(placeholder, encodeURIComponent(value + ""));
            }));
        return url;
    };


}