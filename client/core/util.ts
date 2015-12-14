export class ObjectUtil {

	private static _seq = 0;

	static nextId() {
		return `${++ObjectUtil._seq}`;
	}

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
	
	static createFilter(data: any): any {
		let filters = {};

		// Regular expresion to simplify the search
		for (let entry in data) {
		    if (ObjectUtil.isPresent(data[entry])) {
		    	if (typeof data[entry] === 'string' && typeof data[entry] !== 'ObjectID') {
					console.log("data type " + typeof data[entry]);
		    		filters[entry] = new RegExp(data[entry], 'i');
		    	} else {
		    		filters[entry] = data[entry];
		    	}
		    } 
		}

		return filters;
	}
}
