import {AccountOrganizationMember, AuthorizationData, ModelOptions, AuthorizationResponse} from '../../client/core/dto';
import {AccountOrganizationMemberModel, AccountOrganizationModel, AccountUserModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';
import {salesLeadOrganizationMemberService} from '../sales_lead_organization_member/sales_lead_organization_member_service';
import {salesLeadMemberRoleService} from '../sales_lead_member_role/sales_lead_member_role_service';

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
	
	removeOneWithValidation(id: string, newOptions: ModelOptions = {}): Promise<AccountOrganizationMember> {
		return new Promise<AccountOrganizationMember>((resolve: Function, reject: Function) => {
			this.preRemoveOne(id, newOptions)
			.then((accountOrganizationMember: any) => {
				return this.removeOneValidation(accountOrganizationMember, newOptions);
			})
			.then((accountOrganizationMember: any) => {
				accountOrganizationMember.remove((err: Error) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(accountOrganizationMember.toObject());
					return;
				});
			})
			.catch((err) => { 
				reject(err);
				return;
			});	
		});
	}
	
	removeOneByIdWithValidation(id: string, newOptions: ModelOptions = {}): Promise<AccountOrganizationMember> {
		return new Promise<AccountOrganizationMember>((resolve: Function, reject: Function) => {
			this.preRemoveOneById(id, newOptions)
			.then((accountOrganizationMember: any) => {
				return this.removeOneValidation(accountOrganizationMember, newOptions);
			})
			.then((accountOrganizationMember: any) => {
				accountOrganizationMember.remove((err: Error) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(accountOrganizationMember.toObject());
					return;
				});
			})
			.catch((err) => { 
				reject(err);
				return;
			});	
		});
	}
	
	removeOneValidation(data: any, newOptions: ModelOptions = {}): Promise<AuthorizationResponse> {
		return new Promise<AuthorizationResponse>((resolve: Function, reject: Function) => {
		
			const rolesModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				additionalData: { 
					code: 'OWNER'
				},
				copyAuthorizationData: '',
				distinct: '_id'
			};	
			
			salesLeadMemberRoleService.findDistinct({}, rolesModelOptions)
			.then((roles: string[]) => {
				const leadMemberModelOptions: ModelOptions = {
					authorization: newOptions.authorization,
					additionalData: { 
						role: { $in: roles }, 
						member: data._id
					},
					copyAuthorizationData: '',
					onlyValidateParentAuthorization: true,
					population: [
						{	path: 'role' },
						{   path: 'member',
							populate: {
							path: 'role',
							model: 'accountMemberRole'
							} 
						}
					]
				};
				
				return salesLeadOrganizationMemberService.getLeadOrganizationMembersToValidate(leadMemberModelOptions);
			})
			.then((authorizationResponse: AuthorizationResponse) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
				return;
			});
		});
	}
	
	returnCurrentOrganizationMember(newOptions: ModelOptions = {}): Promise<AccountOrganizationMember> {
		return new Promise<AccountOrganizationMember>((resolve: Function, reject: Function) => {
			if (ObjectUtil.isBlank(newOptions.authorization.organizationMember)) {
				reject(new Error('This user is not member of this organization'));
				return;
			} 
			
			const organizationMember: AccountOrganizationMember = ObjectUtil.clone(newOptions.authorization.organizationMember);
			resolve(organizationMember);
		});
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
				return this.createAuthorizationResponse('Organization member: Unauthorized member');
			}
			
			if (roles.length > 0 && roles.indexOf(modelOptions.authorization.organizationMember.role.code) < 0) {
				return this.createAuthorizationResponse('Organization member: Unauthorized member role');
			}
		}
		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, 
		data?: AccountOrganizationMember): AuthorizationResponse {
		
		const isUser =  modelOptions.authorization.user._id.toString() === data.user.toString();
		if (isUser) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document update');
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, 
		data?: AccountOrganizationMember): AuthorizationResponse {
		
		const authRoles = ['OWNER'];
		const isOrgOwner = authRoles.indexOf(modelOptions.authorization.organizationMember.role.code) >= 0;
		const isUser =  modelOptions.authorization.user._id.toString() === data.user.toString();
		if (isOrgOwner || isUser) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document remove');
	}

}


export const accountOrganizationMemberService = new AccountOrganizationMemberService();
