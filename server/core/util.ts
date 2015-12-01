export class ObjectUtilServer {

 
	static createFilter(data: any): any {
		let filters = {};

		// Regular expresion to simplify the search
		for (let entry in data) {
		    if (data[entry] !== null && data[entry] !== undefined && data[entry] !== "") {
		    	
		    	if (typeof data[entry] === 'string') {
		    		filters[entry] = new RegExp(data[entry], 'i');
		    	} else {
		    		filters[entry] = data[entry];
		    	}
		     
		    } 
		}

		return filters;
	}
}
