import {Model, Document} from 'mongoose';

import {BaseDto} from '../../client/core/dto';
import {ObjectUtil} from '../../client/core/util';

export interface SearchOptions {
  regularExpresion?: boolean;
  select?: any;
}

export interface ModelOptions {
  defaultPopulation?: any;
}

export abstract class BaseService<T extends BaseDto> {
	
	options: ModelOptions;
	constructor(public Model: Model<Document>, options = {defaultPopulation: ''})  {
		this.options = options;		
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
			.populate(this.options.defaultPopulation).exec((err, foundDoc) => {
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
			this.Model.find(ObjectUtil.createFilter(data)).populate(this.options.defaultPopulation).exec((err, foundObjs) => {
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
	
	find(data: T, options: SearchOptions = {}): Promise<T[]> {
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			this.Model.find(ObjectUtil.createFilter(data, options.regularExpresion), options.select,
			 { sort: '-createdAt', lean: true }).populate(this.options.defaultPopulation)
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
			this.Model.findById(id, null, { lean: true }).populate(this.options.defaultPopulation).exec(
				(err, foundObj) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(foundObj);
			});
		});
	}
	
	findOneByIdPopulate(id: string, population: any): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {
			this.Model.findById(id, null, { lean: true }) 
			.populate(population)
			.exec((err, foundObj) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(foundObj);
			});
		});
	}
	
	findAndPopulate(data: T, population: any): Promise<T[]> { 
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			this.Model.find(ObjectUtil.createFilter(data), null, { sort: '-createdAt', lean: true }) 
			.populate(population)
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