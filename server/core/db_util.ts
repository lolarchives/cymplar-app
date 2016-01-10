import {Document} from 'mongoose';

export class DocumentFlag {
	name: string;
	value: any;	
}

export class DatabaseObjectUtil {

	static removeDocumentPromise(data: Document, flags: DocumentFlag[] = []): Promise<Document> {
		
		return new Promise<Document>((resolve: Function, reject: Function) => {
			
			for (let prop in flags) {
				const documentFlag: DocumentFlag = flags[prop];
				data[documentFlag.name] = documentFlag.value;
			}						
			
			data.remove((err: Error) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(data);
			});
		});
	}
	
	static removeArrayPromise(data: Document[], flags: DocumentFlag[] = []): Promise<Document[]> {
		return new Promise<Document[]>((resolve: Function, reject: Function) => {						
			const promises: Promise<Document>[] = [];
				
			data.forEach((doc) => {
			 promises.push(this.removeDocumentPromise(doc, flags));		
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
