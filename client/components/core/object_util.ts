export class ObjectUtil {

	static clone<T extends Object>(data: T): T {
		return JSON.parse(JSON.stringify(data));
	}
	
	static merge<T extends Object>(dest: T, src: T): T {
		if (ObjectUtil.isBlank(src)) {
			return dest;
		}
		if (ObjectUtil.isBlank(dest)) {
			return src;
		}
		for (let prop in src) {
      dest[prop] = src[prop];
    }
		return dest;
	}
		
	static isPresent(data: any): boolean {
		return !ObjectUtil.isBlank(data);
	}
	
	static isBlank(data: any): boolean {
		return data === undefined || data === null;
	}
}
