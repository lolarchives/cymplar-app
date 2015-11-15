import {Model, Document} from 'mongoose';

import {BaseDto} from '../../client/core/dto';


export abstract class BaseService<T extends BaseDto> {
	
	constructor(public Model: Model<Document>) {		
	}

	createOne(data: T): Promise<T> {
		delete data._id;
		const contact = new this.Model(data);
		return new Promise<T>((resolve: Function, reject: Function) => {
			contact.save((err: Error, savedDoc: any) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(savedDoc.toObject());
			});	
		});		
	}

	updateOne(data: T): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {
			this.Model.findById(data._id, (err: Error, foundDoc: any) => {
				if (err) {
					reject(err);
					return;
				}
				for (let prop in data) {
					foundDoc[prop] = data[prop];
				}
				foundDoc.save((err: Error, savedDoc: any) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(savedDoc.toObject());
				});
			});
		});
	}

	removeOneById(id: string): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {
			this.Model.findById(id, (err, foundDoc) => {
				if (err) {
					reject(err);
					return;
				}
				foundDoc.remove((err: Error) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(foundDoc.toObject());
				});
			});
		});
	}

	find(): Promise<T[]> {
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			this.Model.find({}, null, { sort: '-createdAt', lean: true }, (err, foundObjs) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(foundObjs);
			});
		});
	}

	findOneById(id: string): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {
			this.Model.findById(id, null, { lean: true }, (err, foundObj) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(foundObj);
			});
		});
	}

}

