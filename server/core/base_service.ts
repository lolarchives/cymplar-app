import {Model, Document} from 'mongoose';

import {BaseDto, ModelOptions, AuthorizationData} from '../../client/core/dto';
import {ObjectUtil} from '../../client/core/util';
import {DatabaseObjectUtil} from './db_util';
import {BaseAuthorizationService} from './base_authorization_service';

export abstract class BaseService<T extends BaseDto> extends BaseAuthorizationService<T> {
	
	private options: ModelOptions;
	
	constructor(public Model: Model<Document>, options: ModelOptions = {})  {
		super();
		this.options = { 
			additionalData: {},
			complexSearch: {},
			population: '',
			projection: '',
			regularExpresion: false,
			distinct: '',
			authorization: {},
			requireAuthorization: true,
			copyAuthorizationData: true,
			specialAuthorizationDataSearch: false
		};
		ObjectUtil.merge(this.options, options);		
	}

	createOne(data: T, newOptions: ModelOptions = {}): Promise<T> {
		delete data._id;
		const txModelOptions = this.obtainTransactionModelOptionsAndAddData(data, newOptions);
		const newDocument = new this.Model(data);
		return new Promise<T>((resolve: Function, reject: Function) => {
			this.isCreateAuthorized(txModelOptions, reject);
			newDocument.save((err: Error, savedDoc: any) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(savedDoc.toObject());
			});	
		});		
	}

	updateOne(data: T, newOptions: ModelOptions = {}): Promise<T> {	
		const txModelOptions = this.obtainTransactionModelOptionsAndAddData(data, newOptions);
		return new Promise<T>((resolve: Function, reject: Function) => {
			this.isUpdateAuthorized(txModelOptions, reject, data);
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

	removeOneById(id: string, newOptions: ModelOptions = {}): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {	
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			this.isRemoveAuthorized(txModelOptions, reject);
			this.Model.findById(id).populate(txModelOptions.population).exec((err: Error, foundDoc: any) => {
				if (err) {
					reject(err);
					return;
				}
				if (ObjectUtil.isBlank(foundDoc)) {
					reject(new Error("Object could not be found"));
					return;
				}
				this.isRemoveAuthorizedExecution(txModelOptions, reject, foundDoc);
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

	removeByFilter(data: T, newOptions: ModelOptions = {}): Promise<T[]> {
		const txModelOptions = this.obtainTransactionModelOptionsAndAddData(data, newOptions);
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			this.isRemoveAuthorized(txModelOptions, reject);
			this.Model.find(ObjectUtil.createFilter(data)).populate(txModelOptions.population)
			.exec((err, foundObjs) => {
				if (err) {
					reject(err);
					return;
				}
				DatabaseObjectUtil.removeArrayPromise(foundObjs)
				.then((results: any) => {
					resolve(results);
				})
				.catch((err: any) => {
					reject(err);
				});	
			});
		});
	}
	
	find(data: T, newOptions: ModelOptions = {}): Promise<T[]> {
		const txModelOptions = this.obtainTransactionModelOptionsAndAddData(data, newOptions);
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			this.isSearchAuthorized(txModelOptions, reject);
			const search = this.obtainSearchExpression(data, txModelOptions);
			this.Model.find(search, txModelOptions.projection,
			 { sort: '-createdAt', lean: true }).populate(txModelOptions.population)
			.exec((err, foundObjs) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(foundObjs);
			});
		});
	}

	
	findOneById(id: string, newOptions: ModelOptions = {}): Promise<T> {
		const txModelOptions = this.obtainTransactionModelOptions(newOptions);
		return new Promise<T>((resolve: Function, reject: Function) => {
			this.isSearchAuthorized(txModelOptions, reject);
			this.Model.findById(id, txModelOptions.projection, { lean: true }).populate(txModelOptions.population)
			.exec((err, foundObj) => {
				if (err) {
					reject(err);
					return;
				}
				if (ObjectUtil.isBlank(foundObj)) {
					reject(new Error("Object not found"));
					return;
				}
				resolve(foundObj);
			});
		});
	}
	
	exist(data: T, newOptions: ModelOptions = {}): Promise<boolean> {
		const txModelOptions = this.obtainTransactionModelOptionsAndAddData(data, newOptions);
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
		const txModelOptions = this.obtainTransactionModelOptionsAndAddData(data, newOptions);
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			this.isSearchAuthorized(txModelOptions, reject);			
			const search = this.obtainSearchExpression(data, txModelOptions);
			if (Object.keys(search).length < 1) {
				reject(new Error('At least one filter value should be specified'));
			}
			this.Model.findOne(search, txModelOptions.projection,
			 { sort: '-createdAt', lean: true }).populate(txModelOptions.population)
			.exec((err, foundObj) => {
				if (err) {
					reject(err);
					return;
				}
				if (ObjectUtil.isBlank(foundObj)) {
					reject(new Error("Object not found"));
					return;
				}
				resolve(foundObj);
			});
		});
	}
	
	findDistinct(data: T, newOptions: ModelOptions = {}): Promise<string[]> {
		const txModelOptions = this.obtainTransactionModelOptionsAndAddData(data, newOptions);
		return new Promise<string[]>((resolve: Function, reject: Function) => {
			this.isSearchAuthorized(txModelOptions, reject);
			const search = this.obtainSearchExpression(data);
			this.Model.find(search).distinct(txModelOptions.distinct)
			.exec((err, foundObjs) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(foundObjs);
			});
		});
	}
	
	protected obtainTransactionModelOptions(newOptions: ModelOptions = {}): ModelOptions {	
		const transactionOptions: ModelOptions = {};
		ObjectUtil.merge(transactionOptions, this.options);
		ObjectUtil.merge(transactionOptions, newOptions);
		return transactionOptions;
	}
	
	protected obtainTransactionModelOptionsAndAddData(data: T, newOptions: ModelOptions = {}): ModelOptions {	
		const transactionOptions: ModelOptions = this.obtainTransactionModelOptions(newOptions);
		ObjectUtil.merge(data, transactionOptions.additionalData); // Adds additionalData if specified
		this.copySignificantAuthorizationData(data, transactionOptions);
		return transactionOptions;
	}
	
	protected obtainSearchExpression(data: T, modelOptions: ModelOptions = {}): any {
		const search = ObjectUtil.createFilter(data, modelOptions.regularExpresion);
		if (modelOptions.specialAuthorizationDataSearch) {
			ObjectUtil.merge(modelOptions.complexSearch, this.obtainComplexAuthorizationSearchExpression(data, modelOptions.authorization));
		}
		ObjectUtil.merge(search, modelOptions.complexSearch);
		return search;	
	}
	
	protected obtainComplexAuthorizationSearchExpression(data: T, authorization: AuthorizationData = {}): any {
		return {};	
	}
	
	protected copySignificantAuthorizationData(data: T, modelOptions: ModelOptions = {}): void {
	}
}