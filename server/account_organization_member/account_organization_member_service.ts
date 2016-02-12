import {AccountOrganizationMember, AuthorizationData, ModelOptions, AuthorizationResponse} from '../../client/core/dto';
import {AccountOrganizationMemberModel, AccountOrganizationModel, AccountUserModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class AccountOrganizationMemberService extends BaseService<AccountOrganizationMember> {

	constructor() {
		const modelOptions: ModelOptions = {
			population: [{
					path: 'organization',
				},
				{
					path: 'user',
					select: '-password'
				},
				{
					path: 'role',
					select: 'code'
				}]
		};
			
		super(AccountOrganizationMemberModel, modelOptions);
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'user':
				modelOptions.additionalData['user'] = modelOptions.authorization.user._id;
				break;
			case 'organization':
				modelOptions.additionalData['organization'] = modelOptions.authorization.organizationMember.organization;
				break;
			case 'team':
				modelOptions.additionalData['organization'] = modelOptions.authorization.organizationMember.organization;
				modelOptions.additionalData['_id'] = { $ne: modelOptions.authorization.organizationMember._id };
				break;
			default:
				break;
		}
	}
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {
			const authorizationResponse = super.authorizationEntity(modelOptions);
			
			if (modelOptions.onlyValidateParentAuthorization || !authorizationResponse.isAuthorized) {
				return authorizationResponse;
			}
			
			if (!this.existsOrganizationMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse("Organization member: Unauthorized member");
			}
			
			if (roles.length > 0 && roles.indexOf(modelOptions.authorization.organizationMember.role.code) < 0) {
				return this.createAuthorizationResponse("Organization member: Unauthorized member role");
			}
		}
		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, 
		data?: AccountOrganizationMember): AuthorizationResponse {
		
		const isUser =  modelOptions.authorization.organizationMember.user._id.toString() === data.user.toString();
		if (isUser) {
			return this.createAuthorizationResponse('');
		}
		return this.createAuthorizationResponse('Unauthorized document update');
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, 
		data?: AccountOrganizationMember): AuthorizationResponse {
		
		const authRoles = ['OWNER'];
		const isOrgOwner = authRoles.indexOf(modelOptions.authorization.organizationMember.role.code) < 0;
		const isUser =  modelOptions.authorization.organizationMember.user._id.toString() === data.user.toString();
		if (isOrgOwner || isUser) {
			return this.createAuthorizationResponse('');
		}
		return this.createAuthorizationResponse('Unauthorized document remove');
	}

}


export const accountOrganizationMemberService = new AccountOrganizationMemberService();
