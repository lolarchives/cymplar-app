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
			copyAuthorizationData: 'user', // By default is going to try to copy the current user information
			onlyValidateParentAuthorization: false, // Skip validations at immediate document level
			validatePostSearchAuthData: true
		};
		ObjectUtil.merge(this.options, options);		
	}

	createOne(data: T, newOptions: ModelOptions = {}): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {
			delete data._id;
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			const authorizationResponse = this.isCreateAuthorized(txModelOptions);
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
			}
			this.addAuthorizationDataInCreate(txModelOptions); // Adds required authorization data in create	
			this.transactionModelOptionsAddData(data, txModelOptions);
			const newDocument = new this.Model(data);
			newDocument.save((err: Error, savedDoc: any) => {
				if (err) {
					reject(err);
					return;
				}
				savedDoc.populate(txModelOptions.population, (err: Error, populatedObj: any) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(populatedObj.toObject());
					return;
				});
			});	
		});		
	}

	preUpdateOne(data: T, newOptions: ModelOptions = {}): Promise<T> {	
		return new Promise<T>((resolve: Function, reject: Function) => {
			const authorizationResponse = this.isUpdateAuthorized(newOptions);
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
			}
			this.Model.findById(data._id, newOptions.projection)
			.exec((err: Error, foundObj: any) => {
				if (err) {
					reject(err);
					return;
				}
			
				if (ObjectUtil.isBlank(foundObj)) {
					reject(new Error('Object could not be found'));
					return;
				}
				
				
				if (newOptions.validatePostSearchAuthData) {
					const authorizationResponse = this.validateAuthDataPostSearchUpdate(newOptions, foundObj);
					if (!authorizationResponse.isAuthorized) {
						reject(new Error(authorizationResponse.errorMessage));
						return;
					}	
				}
					
				resolve(foundObj);
			});
		});
	}
	
	updateOne(data: T, newOptions: ModelOptions = {}): Promise<T> {	
		return new Promise<T>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);			
			this.preUpdateOne(data, txModelOptions)
			.then((objectToUpdate: any) => {
								
				for (let prop in data) {
					objectToUpdate[prop] = data[prop];
				}
				
				objectToUpdate.save((err: Error, savedDoc: any) => {
					if (err) {
						reject(err);
						return;
					}
					savedDoc.populate(txModelOptions.population, (err: Error, populatedObj: any) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(populatedObj.toObject());
						return;
					});
				});
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	
	updateOneFilter(data: T, newOptions: ModelOptions = {}): Promise<T> {	
		return new Promise<T>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			const authorizationResponse = this.isUpdateAuthorized(txModelOptions);
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
			}
			this.Model.find(data, txModelOptions.projection)
			.exec((err: Error, foundObj: any) => {
				if (err) {
					reject(err);
					return;
				}
			
				if (ObjectUtil.isBlank(foundObj)) {
					reject(new Error('Object could not be found'));
					return;
				}
				
				
				if (txModelOptions.validatePostSearchAuthData) {
					const authorizationResponse = this.validateAuthDataPostSearchUpdate(txModelOptions, foundObj);
					if (!authorizationResponse.isAuthorized) {
						reject(new Error(authorizationResponse.errorMessage));
						return;
					}	
				}
					
				for (let prop in data) {
					foundObj[prop] = data[prop];
				}
				
				foundObj.save((err: Error, savedDoc: any) => {
					if (err) {
						reject(err);
						return;
					}
					savedDoc.populate(txModelOptions.population, (err: Error, populatedObj: any) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(populatedObj.toObject());
						return;
					});
				});
			});
		});
	}

	preRemoveOne(data: T, newOptions: ModelOptions = {}): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {	
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			const authorizationResponse = this.isRemoveAuthorized(txModelOptions);
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
			}
			this.addAuthorizationDataPreSearch(txModelOptions);	
			this.transactionModelOptionsAddData(data, txModelOptions);	
			const search = this.obtainSearchExpression(data, txModelOptions);
			this.Model.findOne(search).populate(txModelOptions.population).exec((err: Error, foundDoc: any) => {
				if (err) {
					reject(err);
					return;
				}
				if (ObjectUtil.isBlank(foundDoc)) {
					reject(new Error('Object could not be found'));
					return;
				}
				
				if (txModelOptions.validatePostSearchAuthData) {
					const authorizationResponse = this.validateAuthDataPostSearchRemove(txModelOptions, foundDoc);
					if (!authorizationResponse.isAuthorized) {
						reject(new Error(authorizationResponse.errorMessage));
						return;
					}	
				}
				
				resolve(foundDoc);
			});
		});
	}
	
	removeOne(data: T, newOptions: ModelOptions = {}): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {	
			this.preRemoveOne(data, newOptions)
			.then((objectToRemove: any) => {
				objectToRemove.remove((err: Error) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(objectToRemove.toObject());
					return;
				});
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	preRemoveOneById(id: string, newOptions: ModelOptions = {}): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {	
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			const authorizationResponse = this.isRemoveAuthorized(txModelOptions);
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
			}
			this.Model.findById(id).populate(txModelOptions.population).exec((err: Error, foundDoc: any) => {
				if (err) {
					reject(err);
					return;
				}
				if (ObjectUtil.isBlank(foundDoc)) {
					reject(new Error('Object could not be found'));
					return;
				}
				
				if (txModelOptions.validatePostSearchAuthData) {
					const authorizationResponse = this.validateAuthDataPostSearchRemove(txModelOptions, foundDoc);
					if (!authorizationResponse.isAuthorized) {
						reject(new Error(authorizationResponse.errorMessage));
						return;
					}	
				}
					
				resolve(foundDoc);
			});
		});
	}
	
	removeOneById(id: string, newOptions: ModelOptions = {}): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {	
			this.preRemoveOneById(id, newOptions)
			.then((objectToRemove: any) => {
				objectToRemove.remove((err: Error) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(objectToRemove.toObject());
					return;
				});
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	removeByFilter(data: T, newOptions: ModelOptions = {}): Promise<T[]> {
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			const authorizationResponse = this.isRemoveAuthorized(txModelOptions);
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
			}
			this.addAuthorizationDataPreSearch(txModelOptions);	
			this.transactionModelOptionsAddData(data, txModelOptions);
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
	
	removeSkipingHooks(data: T) {
		this.Model.remove(data, (err: any) => {});
	}
	
	find(data: T, newOptions: ModelOptions = {}): Promise<T[]> {
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			const authorizationResponse = this.isSearchAuthorized(txModelOptions);
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
			}
			this.addAuthorizationDataPreSearch(txModelOptions);	
			this.transactionModelOptionsAddData(data, txModelOptions);	
			const search = this.obtainSearchExpression(data, txModelOptions);
			this.Model.find(search, txModelOptions.projection,
			 { sort: '-createdAt', lean: true }).populate(txModelOptions.population)
			.exec((err, foundObjs) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(foundObjs);
				return;
			});
		});
	}
	
	findOneById(id: string, newOptions: ModelOptions = {}): Promise<T> {
		return new Promise<T>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			const authorizationResponse = this.isSearchAuthorized(txModelOptions);
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
			}
			this.Model.findById(id, txModelOptions.projection, { lean: true }).populate(txModelOptions.population)
			.exec((err: Error, foundObj: T) => {
				if (err) {
					reject(err);
					return;
				}
				if (ObjectUtil.isBlank(foundObj)) {
					reject(new Error('Object not found'));
					return;
				}
				
				if (txModelOptions.validatePostSearchAuthData) {
					const authorizationResponse = this.validateAuthDataPostSearch(txModelOptions, foundObj);
					if (!authorizationResponse.isAuthorized) {
						reject(new Error(authorizationResponse.errorMessage));
						return;
					}
				}
				
				resolve(foundObj);
				return;
			});
		});
	}
	
	exist(data: T, newOptions: ModelOptions = {}): Promise<boolean> {
		return new Promise<boolean>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			this.transactionModelOptionsAddData(data, txModelOptions);	
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
				return;
			});
		});
	}
	
	findOne(data: T, newOptions: ModelOptions = {}): Promise<T[]> {
		return new Promise<T[]>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			const authorizationResponse = this.isSearchAuthorized(txModelOptions);	
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
			}
			this.addAuthorizationDataPreSearch(txModelOptions);	
			this.transactionModelOptionsAddData(data, txModelOptions);	
			const search = this.obtainSearchExpression(data, txModelOptions);
			if (Object.keys(search).length < 1) {
				reject(new Error('At least one filter value should be specified'));
			}
			
			this.Model.findOne(search, txModelOptions.projection,
			 { sort: '-createdAt', lean: true }).populate(txModelOptions.population)
			.exec((err: Error, foundObj: T) => {
				if (err) {
					reject(err);
					return;
				}
				if (ObjectUtil.isBlank(foundObj)) {
					reject(new Error('Object not found'));
					return;
				}
				
				if (txModelOptions.validatePostSearchAuthData) {
					const authorizationResponse = this.validateAuthDataPostSearch(txModelOptions, foundObj);
					if (!authorizationResponse.isAuthorized) {
						reject(new Error(authorizationResponse.errorMessage));
						return;
					}
				}
				
				resolve(foundObj);
				return;
			});
		});
	}
	
	findDistinct(data: T, newOptions: ModelOptions = {}): Promise<string[]> {
		return new Promise<string[]>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			const authorizationResponse = this.isSearchAuthorized(txModelOptions);
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
			}
			this.addAuthorizationDataPreSearch(txModelOptions);	
			this.transactionModelOptionsAddData(data, txModelOptions);	
			const search = this.obtainSearchExpression(data, txModelOptions);
			this.Model.find(search).distinct(txModelOptions.distinct)
			.exec((err, foundObjs) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(foundObjs);
				return;
			});
		});
	}
	
	protected obtainTransactionModelOptions(newOptions: ModelOptions = {}): ModelOptions {
		const transactionOptions: ModelOptions = ObjectUtil.clone(this.options);
		ObjectUtil.merge(transactionOptions, newOptions);
		return transactionOptions;
	}
	
	protected transactionModelOptionsAddData(data: T, transactionOptions: ModelOptions = {}) {	
		ObjectUtil.merge(data, transactionOptions.additionalData); // Adds additionalData if specified
	}
	
	protected obtainSearchExpression(data: T, modelOptions: ModelOptions = {}): any {
		const search = ObjectUtil.createFilter(data, modelOptions.regularExpresion);
		ObjectUtil.merge(search, modelOptions.complexSearch);
		return search;	
	}
	
}