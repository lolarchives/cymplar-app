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
}
