import {Model, Document} from 'mongoose';

import {BaseDto, ModelOptions, AuthorizationData} from '../../client/core/dto';
import {ObjectUtil} from '../../client/core/util';
import {DatabaseObjectUtil} from './db_util';

export class BaseAuthorizationService<T extends BaseDto>{
	
	protected isCreateAuthorized(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
		if (modelOptions.requireAuthorization) {
			this.evaluateCreationAuthorization(modelOptions, reject, data);
		}
	}
	
	protected evaluateCreationAuthorization(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
		if (!this.existsUser(modelOptions.authorization)) {
			reject(new Error("Unauthorized user"));
		}
	}
	
	protected isUpdateAuthorized(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
		if (modelOptions.requireAuthorization) {
			this.evaluateUpdateAuthorization(modelOptions, reject, data);
		}
	}
	
	protected evaluateUpdateAuthorization(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
		if (!this.existsUser(modelOptions.authorization)) {
			reject(new Error("Unauthorized user"));
		}
	}
	
	protected isRemoveAuthorized(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
		if (modelOptions.requireAuthorization) {
			this.evaluateRemoveAuthorization(modelOptions, reject, data);
		}
	}
	
	protected evaluateRemoveAuthorization(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
		if (!this.existsUser(modelOptions.authorization)) {
			reject(new Error("Unauthorized user"));
		}
	}
	
	protected isSearchAuthorized(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
		if (modelOptions.requireAuthorization) {
			this.evaluateSearchAuthorization(modelOptions, reject, data);
		}
	}
	
	protected evaluateSearchAuthorization(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
		if (!this.existsUser(modelOptions.authorization)) {
			reject(new Error("Unauthorized user"));
		}
	}
		
	protected isUpdateAuthorizedExecution(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
		if (!modelOptions.requireAuthorization) {
			this.evaluateUpdateExecutionAuthorization(modelOptions, reject, data);
		}
	}
	
	protected evaluateUpdateExecutionAuthorization(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
	}
	
	protected isRemoveAuthorizedExecution(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
		if (!modelOptions.requireAuthorization) {
			this.evaluateRemoveExecutionAuthorization(modelOptions, reject, data);
		}
	}
	
	protected evaluateRemoveExecutionAuthorization(modelOptions: ModelOptions = {}, reject: Function, data?: T): void {
	}
	
	protected existsUser(authorization: AuthorizationData): boolean {
		if (ObjectUtil.isBlank(authorization) || ObjectUtil.isBlank(authorization.user)) {
			return false;
		}
		return true;
	}
	
	protected existsOrganizationMember(authorization: AuthorizationData): boolean {
		if (ObjectUtil.isBlank(authorization) || ObjectUtil.isBlank(authorization.organizationMember)) {
			return false;
		}
		return true;
	}

}