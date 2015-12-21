import {Model, Document} from 'mongoose';

import {BaseDto} from '../../client/core/dto';
import {ObjectUtil} from '../../client/core/util';


export interface ModelOptions {
  population?: any;
  projection?: any;
  regularExpresion?: boolean;
}


export abstract class BaseService<T extends BaseDto> {
	
	options: ModelOptions;
	constructor(public Model: Model<Document>, options: ModelOptions = {})  {
		this.options = { population: '', projection: '', regularExpresion: false };
		ObjectUtil.merge(this.options, options);		
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
				
				if (ObjectUtil.isBlank(foundDoc)) {
					reject(new Error("Object could not be found"));
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
			this.Model.findById(id) 
			.populate(this.options.population).exec((err, foundDoc) => {
				if (err) {
					reject(err);
					return;
				}
				
				if (ObjectUtil.isBlank(foundDoc)) {
					reject(new Error("Object could not be found"));
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

	removeByFilter(data: T): Promise<T[]> {
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			this.Model.find(ObjectUtil.createFilter(data)).populate(this.options.population)
			.exec((err, foundObjs) => {
				if (err) {
					reject(err);
					return;
				}
										
				foundObjs.forEach((doc) => {
					doc.remove((err: Error) => {
						if (err) {
							reject(err);
							return;
						}
					});
				});
				resolve(foundObjs);
			});
		});
	}
	
	find(data: T, newOptions: ModelOptions = {}): Promise<T[]> {
		ObjectUtil.merge(this.options, newOptions);
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			this.Model.find(ObjectUtil.createFilter(data, this.options.regularExpresion), this.options.projection,
			 { sort: '-createdAt', lean: true }).populate(this.options.population)
			.exec( (err, foundObjs) => {
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
			this.Model.findById(id, null, { lean: true }).populate(this.options.population)
			.exec((err, foundObj) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(foundObj);
			});
		});
	}
	
	exist(data: T): Promise<boolean> {
		return new Promise<boolean>((resolve: Function, reject: Function) => {
			
			if (Object.keys(data).length < 1) {
				reject(new Error('At least one filter value should be specified'));
			}
			
			this.Model.findOne(ObjectUtil.createFilter(data, false), null, { sort: '-createdAt', lean: true })
			.exec((err, foundObj) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(ObjectUtil.isPresent(foundObj));
			});
		});
	}
	
	findOne(data: T, newOptions: ModelOptions = {}): Promise<T[]> {
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			
			if (Object.keys(data).length < 1) {
				reject(new Error('At least one filter value should be specified'));
			}
			
			this.Model.findOne(ObjectUtil.createFilter(data, this.options.regularExpresion), this.options.projection,
			 { sort: '-createdAt', lean: true }).populate(this.options.population)
			.exec((err, foundObjs) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(foundObjs);
			});
		});
	}
}