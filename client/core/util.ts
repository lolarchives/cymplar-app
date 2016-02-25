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
	
	static mergePrefix(dest: Object, src: Object, prefix: String) {
		if (ObjectUtil.isBlank(src)) {
			return dest;
		}
		if (ObjectUtil.isBlank(dest)) {
			const newSrc = {};
			for (let prop in src) {
				newSrc[prefix + '.' + prop] = src[prop];
			}
			return newSrc;
		}
		for (let prop in src) {
			dest[prefix + '.' + prop] = src[prop];
		}
	}

	static isPresent(data: any): boolean {
		return !ObjectUtil.isBlank(data);
	}

	static isBlank(data: any): boolean {
		return data === undefined || data === null;
	}

	static createFilter(data = {}, regExp = true): any {
		
		//TODO Consult if it should be moved to the server folder in order to use mongoose types
		const regObjId = new RegExp('^[0-9a-fA-F]{24}$');
		let filters = {};
		
		// Regular expresion to simplify the search
		for (const entry in data) {
		    if (ObjectUtil.isPresent(data[entry]) && entry !== 'ido' && entry !== 'idl') {
		    	if (regExp && typeof data[entry] === 'string' && !regObjId.test(data[entry])) {
					filters[entry] = new RegExp(data[entry], 'i');
				} else {
					filters[entry] = data[entry];
				}
			}
		}
		return filters;
	}

}

