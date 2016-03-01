import {Model, Document} from 'mongoose';

import {BaseDto, ModelOptions, AuthorizationData, AuthorizationResponse, AccountMemberRole, 
	SalesLeadMemberRole} from '../../client/core/dto';
import {ObjectUtil} from '../../client/core/util';
import {DatabaseObjectUtil} from './db_util';

export class BaseAuthorizationService<T extends BaseDto>{
	
	protected isCreateAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		return this.authorizationEntity(modelOptions);
	}
	
	protected isUpdateAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		return this.authorizationEntity(modelOptions);
	}
	
	protected isRemoveAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		return this.authorizationEntity(modelOptions);
	}
	
	protected isSearchAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		return this.authorizationEntity(modelOptions);
	}
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {
			if (!this.existsUser(modelOptions.authorization)) {
				return this.createAuthorizationResponse('Base Authorization: Unauthorized user');
			}
		}
		return this.createAuthorizationResponse();
	}
	
	protected createAuthorizationResponse(message?: string): AuthorizationResponse {
		const authorizationResponse: AuthorizationResponse = { isAuthorized: true };
		if (ObjectUtil.isPresent(message)) {
			authorizationResponse['isAuthorized'] = false;
			authorizationResponse['errorMessage'] = message;
		}
		return authorizationResponse;	
	}
	
	protected existsUser(authorization: AuthorizationData): boolean {
		if (ObjectUtil.isBlank(authorization) || ObjectUtil.isBlank(authorization.user)) {
				return false;
		}
		return true;
	}
	
	protected existsOrganizationMember(authorization: AuthorizationData): boolean {
		if (ObjectUtil.isBlank(authorization) || ObjectUtil.isBlank(authorization.organizationMember) || 
			ObjectUtil.isBlank(authorization.organizationMember.organization) || 
			ObjectUtil.isBlank(authorization.organizationMember.role)) {
			return false;
		}
		return true;
	}
	
	protected existsLeadMember(authorization: AuthorizationData): boolean {
		if (ObjectUtil.isBlank(authorization) || ObjectUtil.isBlank(authorization.leadMember) ||
			ObjectUtil.isBlank(authorization.leadMember.lead) || ObjectUtil.isBlank(authorization.leadMember.role)) {
			return false;
		}
		return true;
	}
	
	/* tslint:disable */ // In this switches the default is not needed
	protected addAuthorizationDataInCreate(modelOptions: ModelOptions = {}, data?: T) {
		switch (modelOptions.copyAuthorizationData) {
			case 'user':
				modelOptions.additionalData['user'] = modelOptions.authorization.user._id;
				break;
			case 'createdBy':
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.user._id;
				break;
		}
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}, data?: T) {
		switch (modelOptions.copyAuthorizationData) {
			case 'user':
				modelOptions.additionalData['user'] = modelOptions.authorization.user._id;
				break;
			case 'createdBy':
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.user._id;
				break;
		}
	}
	/* tslint:enable */
	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, data?: T): AuthorizationResponse {
		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, data?: T): AuthorizationResponse {
		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearch(modelOptions: ModelOptions = {}, data?: T): AuthorizationResponse {
		return this.createAuthorizationResponse();
	}
	
	protected isAuthorizedInOrg(authorizationData: AuthorizationData, authorizedRoles: string[]): boolean {
		const role: AccountMemberRole = ObjectUtil.getBaseDtoObject(authorizationData.organizationMember.role);
		const roleCode: string = role.code;	
		return ObjectUtil.isPresent(roleCode) && authorizedRoles.indexOf(roleCode) >= 0;
	}
	
	protected isAuthorizedInLead(authorizationData: AuthorizationData, authorizedRoles: string[]): boolean {
		const role: SalesLeadMemberRole = ObjectUtil.getBaseDtoObject(authorizationData.leadMember.role);
		const roleCode: string = role.code;	
		return ObjectUtil.isPresent(roleCode) && authorizedRoles.indexOf(roleCode) >= 0;
	}
}