import {Document} from 'mongoose';

export class DatabaseObjectUtil {

	static removeDocumentPromise(data: Document): Promise<Document> {
		
		return new Promise<Document>((resolve: Function, reject: Function) => {					
			data.remove((err: Error) => {
				if (err) {
					return reject(err);
				}
				resolve(data);
			});
		});
	}
	
	static removeArrayPromise(data: Document[]): Promise<Document[]> {
		return new Promise<Document[]>((resolve: Function, reject: Function) => {						
			const docToRemovePromises: Promise<Document>[] = [];
			data.forEach((doc) => {
			 docToRemovePromises.push(this.removeDocumentPromise(doc));		
			});
			Promise.all(docToRemovePromises)
			.then((results: any) => resolve(results))
			.catch((err) => reject(err));	
		});
	}
}
