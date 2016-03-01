import {SalesLeadOrganizationMember, ModelOptions, AuthorizationResponse, SalesLead, 
	AccountOrganizationMember, AccountMemberRole, AccountOrganization} from '../../client/core/dto';
import {SalesLeadOrganizationMemberModel, AccountOrganizationModel, AccountUserModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';
import {salesLeadMemberRoleService} from '../sales_lead_member_role/sales_lead_member_role_service';

export class SalesLeadOrganizationMemberService extends BaseService<SalesLeadOrganizationMember> {

	constructor() {
		
		const modelOptions: ModelOptions = {
			population: [
				{	path: 'role' },
				{   path: 'member' }
			]
		};
		
		super(SalesLeadOrganizationMemberModel);
	}
	
	createOne(data: SalesLeadOrganizationMember, newOptions: ModelOptions = {}): Promise<SalesLeadOrganizationMember> {	
		return new Promise<SalesLeadOrganizationMember>((resolve: Function, reject: Function) => {
			if (ObjectUtil.isBlank(data.role)) {
				return reject(new Error('A role should be specified'));
			}
			super.createOne(data, newOptions)
			.then((salesLeadOrganizationMember: SalesLeadOrganizationMember) => {
				resolve(salesLeadOrganizationMember);
			})
			.catch((err: Error) => reject(err));
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
			.catch((err: Error) => reject(err));
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
			.catch((err: Error) => reject(err));
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
			.catch((err: Error) => reject(err));
		});
	}
	
	findCurrentLeadMembersPopulated(data: SalesLeadOrganizationMember, newOptions: ModelOptions = {}): Promise<SalesLeadOrganizationMember[]> {
		return new Promise<SalesLeadOrganizationMember[]>((resolve: Function, reject: Function) => {
			const salesLeadModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				population: [
					{
						path: 'member',
						populate: [
							{
								path: 'organization', 
								model: 'accountOrganization'
							},
							{
								path: 'user', 
								model: 'accountUser',
								select: '-_id -password'
							}
						]
					},
					{
						path: 'role'
					}
				],
				copyAuthorizationData: 'lead'
			};
		
			this.find({}, salesLeadModelOptions)
			.then((leads: SalesLeadOrganizationMember[]) => {
				resolve(leads);
			})
			.catch((err: Error) => reject(err));
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
					
					const organization: AccountOrganization = ObjectUtil.getBaseDtoObject(current.organization);
					if (organizations.indexOf(organization._id) < 0) {
						organizations.push(organization._id);
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
			.catch((err: Error) => reject(err));
		});
	}
	
	returnCurrentLeadMember(newOptions: ModelOptions = {}): Promise<SalesLeadOrganizationMember> {
		return new Promise<SalesLeadOrganizationMember>((resolve: Function, reject: Function) => {
			if (ObjectUtil.isBlank(newOptions.authorization.leadMember)) {
				return reject(new Error('This user is not member of this lead'));
			} 
			
			const leadMember: SalesLeadOrganizationMember = ObjectUtil.clone(newOptions.authorization.leadMember);
			leadMember['member'] = newOptions.authorization.organizationMember;
			resolve(leadMember);
		});
	}
	
	removeOneWithValidation(id: string, newOptions: ModelOptions = {}): Promise<SalesLeadOrganizationMember> {
		return new Promise<SalesLeadOrganizationMember>((resolve: Function, reject: Function) => {
			this.preRemoveOne(id, newOptions)
			.then((salesLeadOrganizationMember: any) => {
				return this.removeOneValidation(salesLeadOrganizationMember, newOptions);
			})
			.then((salesLeadOrganizationMember: any) => {
				salesLeadOrganizationMember.remove((err: Error) => {
					if (err) {
						return reject(err);
					}
					resolve(salesLeadOrganizationMember.toObject());
				});
			})
			.catch((err: Error) => reject(err));
		});
	}
	
	removeOneByIdWithValidation(id: string, newOptions: ModelOptions = {}): Promise<SalesLeadOrganizationMember> {
		return new Promise<SalesLeadOrganizationMember>((resolve: Function, reject: Function) => {
			this.preRemoveOneById(id, newOptions)
			.then((salesLeadOrganizationMember: any) => {
				return this.removeOneValidation(salesLeadOrganizationMember, newOptions);
			})
			.then((salesLeadOrganizationMember: any) => {
				salesLeadOrganizationMember.remove((err: Error) => {
					if (err) {
						return reject(err);
					}
					resolve(salesLeadOrganizationMember.toObject());
				});
			})
			.catch((err: Error) => reject(err));
		});
	}
	
	getRemoveLeadMemeberValidation(data: any, newOptions: ModelOptions = {}): Promise<AuthorizationResponse> {
		return new Promise<AuthorizationResponse>((resolve: Function, reject: Function) => {
			if (data.role.code === 'OWNER') {
				const otherLeadMembersModelOptions: ModelOptions = {
					authorization: newOptions.authorization,
					additionalData: { 
						lead: data.lead,
						_id: { $ne: data._id }
					},
					population: 'role',
					copyAuthorizationData: '' 
				};
				this.find({}, otherLeadMembersModelOptions)
				.then((otherMembers: SalesLeadOrganizationMember[]) => {
					let response: AuthorizationResponse;
					let owners = 0;
					for (let i = 0; i < otherMembers.length; i++) {
						const role: AccountMemberRole = ObjectUtil.getBaseDtoObject(otherMembers[i].role);
						const roleCode: string = role.code;
						if (ObjectUtil.isPresent(roleCode) && roleCode === 'OWNER') {
							owners++;
						}
					}
					
					if (owners < 1) {
						response = this.createAuthorizationResponse('This is the only lead owner, there should be at least one owner');
					} else {
						response = this.createAuthorizationResponse();
					}
					resolve(response);
				})
				.catch((err: Error) => reject(err));
			} else {
				const response = this.createAuthorizationResponse();
				Promise.resolve(response);
			}
		});
	}
	
	getRemoveOrgMemeberValidation(data: any, newOptions: ModelOptions = {}): Promise<AuthorizationResponse> {
		return new Promise<AuthorizationResponse>((resolve: Function, reject: Function) => {
			if (data.member.role.code === 'OWNER') {
				const otherOrgMembersModelOptions: ModelOptions = {
					authorization: newOptions.authorization,
					additionalData: { 
						organization: data.member.organization,
						_id: { $ne: data.member._id }
					},
					population: 'role',
					copyAuthorizationData: '' 
				};
				accountOrganizationMemberService.find({}, otherOrgMembersModelOptions)
				.then((otherMembers: AccountOrganizationMember[]) => {
					let response: AuthorizationResponse;
					let owners = 0;
					for (let i = 0; i < otherMembers.length; i++) {
						const role: AccountMemberRole = ObjectUtil.getBaseDtoObject(otherMembers[i].role);
						const roleCode: string = role.code;
						if (ObjectUtil.isPresent(roleCode) && roleCode === 'OWNER') {
							owners++;
						}
					}
					if (owners > 0) {
						response = this.createAuthorizationResponse('The lead should have at least one owner');
					} else {
						response = this.createAuthorizationResponse();
					}
					resolve(response);
				})
				.catch((err: Error) => reject(err));
			} else {
				const response = this.createAuthorizationResponse();
				Promise.resolve(response);
			}
		});
	}
					
	removeOneValidation(data: any, newOptions: ModelOptions = {}): Promise<any> {
		return new Promise<any>((resolve: Function, reject: Function) => {
			this.getRemoveLeadMemeberValidation(data, newOptions)
			.then((authorizationResponse: AuthorizationResponse) => {
				if (!authorizationResponse.isAuthorized) {
					return this.getRemoveOrgMemeberValidation(data, newOptions);
				} else {
					const response = this.createAuthorizationResponse();
					return Promise.resolve(response);
				}
			})
			.then((authorizationResponse: AuthorizationResponse) => {
				if (!authorizationResponse.isAuthorized) {
					return reject(new Error(authorizationResponse.errorMessage));
				}
				resolve(data);
			})
			.catch((err: Error) => reject(err));
		});
	}
	
	getLeadOrganizationMembersToValidate(newOptions: ModelOptions = {}): Promise<AuthorizationResponse> {
		return new Promise<AuthorizationResponse>((resolve: Function, reject: Function) => {
			this.find({}, newOptions)
			.then((salesLeadOrganizationMembers: SalesLeadOrganizationMember[]) => {
				const validationPromises: Promise<any>[] = [];
				for (let i = 0; i < salesLeadOrganizationMembers.length; i++) {
					validationPromises.push(this.removeOneValidation(salesLeadOrganizationMembers[i], newOptions));
				}
				return Promise.all(validationPromises);
			})
			.then((results: any) => {
				const response = this.createAuthorizationResponse();
				resolve(response);
			})
			.catch((err: Error) => reject(err));
		});
	}
	
	/* tslint:disable */ // In this switches the default is not needed
	protected addAuthorizationDataInCreate(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'orgMember':
				modelOptions.additionalData['member'] = modelOptions.authorization.organizationMember._id;
				break;
			case 'createdBy':
				modelOptions.additionalData['lead'] = modelOptions.authorization.leadMember.lead;
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.organizationMember._id;
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
		}
	}
	/* tslint:enable */
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {
			
			if (!this.existsOrganizationMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse('Sales lead member: Unauthorized organization member');
			}
			
			if (modelOptions.onlyValidateParentAuthorization) {
				return this.createAuthorizationResponse();
			}
			
			const role: AccountMemberRole = ObjectUtil.getBaseDtoObject(modelOptions.authorization.organizationMember.role);
			const roleCode: string = role.code;
			if (roles.length > 0 && ObjectUtil.isPresent(roleCode) && roles.indexOf(roleCode) < 0) {
				return this.createAuthorizationResponse('Sales lead member: Unauthorized member role');
			}
		}

		return this.createAuthorizationResponse();
	}

	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, 
		data?: SalesLeadOrganizationMember): AuthorizationResponse {
		const authRoles = ['OWNER'];
		const isOrgOwner = this.isAuthorizedInOrg(modelOptions.authorization, authRoles);
		const isTheLeadMember =  modelOptions.authorization.leadMember._id.toString() === data._id.toString();
		
		if (isOrgOwner || isTheLeadMember) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document update');
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, 
		data?: SalesLeadOrganizationMember): AuthorizationResponse {
		const authRoles = ['OWNER'];
		const isOrgOwner = this.isAuthorizedInOrg(modelOptions.authorization, authRoles);
		const isTheLeadMember =  modelOptions.authorization.leadMember._id.toString() === data._id.toString();
		if (isOrgOwner || isTheLeadMember) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document update');
	}
}

export const salesLeadOrganizationMemberService = new SalesLeadOrganizationMemberService();

