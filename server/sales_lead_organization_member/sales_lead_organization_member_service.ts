import {SalesLeadOrganizationMember, ModelOptions, AuthorizationResponse, SalesLead, 
	AccountOrganizationMember} from '../../client/core/dto';
import {SalesLeadOrganizationMemberModel, AccountOrganizationModel, AccountUserModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';

export class SalesLeadOrganizationMemberService extends BaseService<SalesLeadOrganizationMember> {

	constructor() {
		super(SalesLeadOrganizationMemberModel);
	}
	
	createOne(data: SalesLeadOrganizationMember, newOptions: ModelOptions = {}): Promise<SalesLeadOrganizationMember> {	
		return new Promise<SalesLeadOrganizationMember>((resolve: Function, reject: Function) => {
			if (ObjectUtil.isBlank(data.role)) {
				reject(new Error("A role should be specified"));
				return;
			}
			super.createOne(data, newOptions)
			.then((salesLeadOrganizationMember: SalesLeadOrganizationMember) => {
				resolve(salesLeadOrganizationMember);
			})
			.catch((err: any) => {
				reject(err);
				return;
			});	
		});		
	}
	
	//Returns the leads in which the user(organization member) is currently a member
	findLeadsPerOrganization(newOptions: ModelOptions = {}): Promise<string[]> {
		return new Promise<SalesLead[]>((resolve: Function, reject: Function) => {
			const salesLeadModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				population: {
					path: 'lead -id'
				},
				distinct: 'lead',
				copyAuthorizationData: 'orgMember',
				onlyValidateParentAuthorization: true
			};
		
			this.findDistinct({}, salesLeadModelOptions)
			.then((leads: string[]) => {
				resolve(leads);
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	//Returns the members that are part of the lead
	findMembersPerLead(newOptions: ModelOptions = {}): Promise<string[]> {
		return new Promise<SalesLead[]>((resolve: Function, reject: Function) => {
			const salesLeadModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				population: {
					path: 'member -id'
				},
				distinct: 'member',
				copyAuthorizationData: 'lead'
			};
		
			this.findDistinct({}, salesLeadModelOptions)
			.then((leads: string[]) => {
				resolve(leads);
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	findCurrentLeadMembers(data: AccountOrganizationMember, newOptions: ModelOptions = {}): Promise<AccountOrganizationMember[]> {
		return new Promise<AccountOrganizationMember[]>((resolve: Function, reject: Function) => {
			this.findMembersPerLead(newOptions)
			.then((leadMembers: string[]) => {		
				newOptions.additionalData = {
					_id: { $in: leadMembers }
				};
				newOptions.copyAuthorizationData = '';
				
				return accountOrganizationMemberService.find(data, newOptions);
			})
			.then((leadMembers: AccountOrganizationMember[]) => {
				resolve(leadMembers);
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	findMembersToAddPerLead(data: AccountOrganizationMember, newOptions: ModelOptions = {}): Promise<AccountOrganizationMember[]> {
		return new Promise<AccountOrganizationMember[]>((resolve: Function, reject: Function) => {
			const salesLeadModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				population: 'member',
				projection: 'member -_id',
				copyAuthorizationData: 'lead'
			};
		
			this.find({}, salesLeadModelOptions)
			.then((leadMembers: AccountOrganizationMember[]) => {
				
				const organizations: string[] = [];
				const members: string[] = [];
				
				for (let i = 0; i < leadMembers.length; i++ ) {
					const current: AccountOrganizationMember = leadMembers[i]['member'];
					members.push(current._id);
					if (organizations.indexOf(current.organization) < 0) {
						organizations.push(current.organization);
					}
				}
			
				newOptions.additionalData = {
					_id: { $nin: members },
					organization: { $in: organizations } 
				};
				newOptions.copyAuthorizationData = '';
				return accountOrganizationMemberService.find(data, newOptions);
			})
			.then((leadMembers: AccountOrganizationMember[]) => {
				resolve(leadMembers);
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	protected addAuthorizationDataInCreate(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'orgMember':
				modelOptions.additionalData['member'] = modelOptions.authorization.organizationMember._id;
				break;
			default:
				break;
		}
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'orgMember':
				modelOptions.additionalData['member'] = modelOptions.authorization.organizationMember._id;
				break;
			case 'lead':
					modelOptions.additionalData['lead'] = modelOptions.authorization.leadMember.lead;
				break;
			default:
				break;
		}
	}
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {
			
			if (!this.existsOrganizationMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse("Sales lead: Unauthorized organization member");
			}
			
			if (modelOptions.onlyValidateParentAuthorization) {
				return this.createAuthorizationResponse();
			}

			if (roles.length > 0 && roles.indexOf(modelOptions.authorization.organizationMember.role.code) < 0) {
				return this.createAuthorizationResponse("Sales lead member: Unauthorized member role");
			}
		}

		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, 
		data?: SalesLeadOrganizationMember): AuthorizationResponse {
		const isLeadMember =  modelOptions.authorization.organizationMember._id === data.member;
		if (isLeadMember) {
			return this.createAuthorizationResponse('');
		}
		return this.createAuthorizationResponse('Unauthorized document update');
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, 
		data?: SalesLeadOrganizationMember): AuthorizationResponse {
		const authRoles = ['OWNER'];
		const isOrgOwner = authRoles.indexOf(modelOptions.authorization.organizationMember.role.code) < 0;
		const isLeadMember =  modelOptions.authorization.organizationMember._id === data.member;
		if (isOrgOwner || isLeadMember) {
			return this.createAuthorizationResponse('');
		}
		return this.createAuthorizationResponse('Unauthorized document remove');
	}
}

export const salesLeadOrganizationMemberService = new SalesLeadOrganizationMemberService();

