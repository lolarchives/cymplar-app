import {OrgChatLog, ModelOptions, AuthorizationResponse} from '../../client/core/dto';
import {OrgChatLogModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class OrgChatLogService extends BaseService<OrgChatLog> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: [
				{
					path: 'type'
				},
				{
					path: 'member',
					select: 'user role -_id',
					populate: [ 
						{
							path: 'user',
							select: 'firstName lastName middleName -_id',
							model: 'accountUser'	
						},
						{
							path: 'role',
							model: 'accountMemberRole'
						}
					]	
				}
			],
			copyAuthorizationData: ''
		};
		super(OrgChatLogModel, defaultModelOptions);
	}
	
	protected isCreateAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		const authorizedRoles = ['OWNER', 'DIRECTOR', 'MANAGER', 'CONSULTANT'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
	protected isUpdateAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		const authorizedRoles = ['OWNER', 'DIRECTOR', 'MANAGER', 'CONSULTANT'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
	protected isRemoveAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		const authorizedRoles = ['OWNER', 'DIRECTOR', 'MANAGER', 'CONSULTANT'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
	/* tslint:disable */ // In this switches the default is not needed
	protected addAuthorizationDataInCreate(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'organization':
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.organizationMember._id;
				break;
		}
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'organization':
				break;
		}
	}
	/* tslint:enable */
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {
			
			const authorizationResponse = super.authorizationEntity(modelOptions);
			
			if (modelOptions.onlyValidateParentAuthorization || !authorizationResponse.isAuthorized) {
				return authorizationResponse;
			}
			
			if (!this.existsOrganizationMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse('Organization: Unauthorized member');
			}
			
			if (roles.length > 0 && !this.isAuthorizedInOrg(modelOptions.authorization, roles)) {
				return this.createAuthorizationResponse('Organization: Unauthorized member role');
			}
			
		}

		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, 
		data?: OrgChatLog): AuthorizationResponse {
		const isOrgChatLogOwner =  modelOptions.authorization.organizationMember._id.toString() === 
			ObjectUtil.getStringUnionProperty(data.createdBy).toString();
		if (isOrgChatLogOwner) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document update');
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, 
		data?: OrgChatLog): AuthorizationResponse {
		const isOrgChatLogOwner =  modelOptions.authorization.organizationMember._id.toString() === 
			ObjectUtil.getStringUnionProperty(data.createdBy).toString();
		if (isOrgChatLogOwner) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document remove');
	}
}

export const orgChatLogService = new OrgChatLogService();

