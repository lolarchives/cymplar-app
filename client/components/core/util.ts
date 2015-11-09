import {Control} from 'angular2/angular2';
import {Headers} from 'angular2/http';

const EMAIL_REG = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;


export const OPTS_REQ_JSON = {
	headers: new Headers({
		'Content-Type': 'application/json'
	})
};

export function validateEmail(control: Control) {    
    return EMAIL_REG.test(control.value) ? null : {validEmail: true};
}


export class ObjectUtil {

	static clone(data: any): any {
		return JSON.parse(JSON.stringify(data));
	}
	
	static merge(dest: Object, src: Object) {
		if (ObjectUtil.isBlank(src)) {
			return dest;
		}
		if (ObjectUtil.isBlank(dest)) {
			return src;
		}
		for (let prop in src) {
      dest[prop] = src[prop];
    }
	}
		
	static isPresent(data: any): boolean {
		return !ObjectUtil.isBlank(data);
	}
	
	static isBlank(data: any): boolean {
		return data === undefined || data === null;
	}
}
