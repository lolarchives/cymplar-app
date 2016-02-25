import {Document} from 'mongoose';

export class DatabaseObjectUtil {

	static removeDocumentPromise(data: Document): Promise<Document> {
		
		return new Promise<Document>((resolve: Function, reject: Function) => {					
			data.remove((err: Error) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(data);
			});
		});
	}
	
	static removeArrayPromise(data: Document[]): Promise<Document[]> {
		return new Promise<Document[]>((resolve: Function, reject: Function) => {						
			const promises: Promise<Document>[] = [];
			data.forEach((doc) => {
			 promises.push(this.removeDocumentPromise(doc));		
			});
			Promise.all(promises)
			.then((results: any) => {
				resolve(results);
			})
			.catch((err: any) => {
				reject(err);
			});	
		});
	}
}
