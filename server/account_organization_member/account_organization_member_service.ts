import {AccountOrganizationMember, AuthorizationData, ModelOptions, AuthorizationResponse, OrgChannel} from '../../client/core/dto';
import {AccountOrganizationMemberModel, AccountOrganizationModel, AccountUserModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';
import {salesLeadOrganizationMemberService} from '../sales_lead_organization_member/sales_lead_organization_member_service';
import {salesLeadMemberRoleService} from '../sales_lead_member_role/sales_lead_member_role_service';
import {orgChannelService} from '../org_channel/org_channel_service';
import {orgChatLogService} from '../org_chat_log/org_chat_log_service';

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
					select: 'code name'
				}]
		};
			
		super(AccountOrganizationMemberModel, modelOptions);
	}
	
	createOne(data: AccountOrganizationMember, newOptions: ModelOptions = {}): Promise<AccountOrganizationMember> {
		return new Promise<AccountOrganizationMember>((resolve: Function, reject: Function) => {
			super.createOne(data, newOptions)
			.then((member: AccountOrganizationMember) => {
				const addMemberTask: Promise<any>[] = [];
				addMemberTask.push(Promise.resolve(member)); // Keeps the added member
				addMemberTask.push(this.createDirectChannels(member, newOptions));
				return Promise.all(addMemberTask);
			})
			.then((results: any) => {
				const newMember: AccountOrganizationMember = results[0];
				const accountOrg = results[1];
				resolve(newMember);
			})
			.catch((err) => reject(err));
		});
	}
	
	createDirectChannels(member: AccountOrganizationMember, newOptions: ModelOptions = {}): Promise<OrgChannel[]> {
		return new Promise<OrgChannel[]>((resolve: Function, reject: Function) => {
			
			const channelTasks: Promise<any>[] = [];
			channelTasks.push(Promise.resolve(member)); // Keeps the new member
			const organizationMemberOptions = {
				authorization: newOptions.authorization,
				copyAuthorizationData: '',
				requireAuthorization: false,
				additionalData: {
					organization: ObjectUtil.getStringUnionProperty(member.organization),
					_id: { $ne: ObjectUtil.getStringUnionProperty(member) }
				},
				distinct : '_id'
			};
			
			channelTasks.push(this.findDistinct({}, organizationMemberOptions));
			Promise.all(channelTasks)
			.then((results: any) => {
				const newMember = results[0];
				const otherOrgMembers = results[1];
				const orgChannelsToCreate: OrgChannel[] = [];
				if (otherOrgMembers.length <= 0) {
					return resolve([]);
				}
				
				const organizationChannelOptions = {
					authorization: newOptions.authorization,
					copyAuthorizationData: '',
					requireAuthorization: false
				};
			
				for (let existentMember in otherOrgMembers) {
					const newOrgChannel = {
						limitedMembers: [otherOrgMembers[existentMember], newMember._id],
						organization: ObjectUtil.getStringUnionProperty(newMember.organization)
					};
					orgChannelsToCreate.push(newOrgChannel);
				}
				
				channelTasks.push(orgChannelService.createMultiple(orgChannelsToCreate, organizationChannelOptions));
				return Promise.all(channelTasks);					
			})
			.then((results: any) => {
				const newMember = results[0];
				const newOrgChannels = results[1];
				resolve(newMember);
			})
			.catch((err) => reject(err));
		});
	}
	
	removeOne(data: AccountOrganizationMember, newOptions: ModelOptions = {}): Promise<AccountOrganizationMember> {
		return new Promise<AccountOrganizationMember>((resolve: Function, reject: Function) => {
			super.removeOne(data, newOptions)
			.then((member: AccountOrganizationMember) => {
				const removeMemberTask: Promise<any>[] = [];
				removeMemberTask.push(Promise.resolve(member)); // Keeps the deleted member
				removeMemberTask.push(this.removeDirectChannels(member, newOptions));
				return Promise.all(removeMemberTask);
			})
			.then((results: any) => {
				const removedMember = results[0];
				const removedChannels = results[1];
				resolve(removedMember);
			})
			.catch((err) => reject(err));
		});
	}
	
	removeDirectChannels(data: AccountOrganizationMember, newOptions: ModelOptions = {}): Promise<OrgChannel[]> {
		return new Promise<OrgChannel[]>((resolve: Function, reject: Function) => {

			const findChannelTasks: Promise<any>[] = [];
			findChannelTasks.push(Promise.resolve(data)); // Keeps the deleted member
			
			const channelOptions = {
				authorization: newOptions.authorization,
				copyAuthorizationData: '',
				requireAuthorization: false,
				additionalData: {
					$and: [{ limitedMembers: { $size: 2 }}, { limitedMembers: data._id }]
				},
				distinct : '_id'
			};
			
			findChannelTasks.push(orgChannelService.findDistinct({organization: ObjectUtil.getStringUnionProperty(data.organization)}, 
				channelOptions));
			
			Promise.all(findChannelTasks)
			.then((foundChannelResults: any) => {
				const deletedMember = foundChannelResults[0];
				const channels = foundChannelResults[1];
				if (channels.length <= 0) {
					return resolve([]);
				}
				orgChannelService.removeSkipingHooks( { _id: { $in: channels} } );
				orgChatLogService.removeSkipingHooks( { room: { $in: channels } });
				resolve(channels);
				
			})
			.catch((err) => reject(err));
		});
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
						return reject(err);
					}
					resolve(accountOrganizationMember.toObject());
				});
			})
			.catch((err) => reject(err));	
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
						return reject(err);
					}
					resolve(accountOrganizationMember.toObject());
				});
			})
			.catch((err) => reject(err));	
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
			.catch((err) => reject(err));
		});
	}
	
	returnCurrentOrganizationMember(newOptions: ModelOptions = {}): Promise<AccountOrganizationMember> {
		return new Promise<AccountOrganizationMember>((resolve: Function, reject: Function) => {
			if (ObjectUtil.isBlank(newOptions.authorization.organizationMember)) {
				return reject(new Error('This user is not member of this organization'));
			} 
			
			const organizationMember: AccountOrganizationMember = ObjectUtil.clone(newOptions.authorization.organizationMember);
			resolve(organizationMember);
		});
	}

/* tslint:disable */ // In this switches the default is not needed
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		
		switch (modelOptions.copyAuthorizationData) {
			case 'user':
				modelOptions.additionalData['user'] = modelOptions.authorization.user._id;
				break;
			case 'organization':
				modelOptions.additionalData['organization'] = 
					ObjectUtil.getStringUnionProperty(modelOptions.authorization.organizationMember.organization);
				break;
			case 'team':
				modelOptions.additionalData['organization'] = 
					ObjectUtil.getStringUnionProperty(modelOptions.authorization.organizationMember.organization);
				modelOptions.additionalData['_id'] = 
					{ $ne: ObjectUtil.getStringUnionProperty(modelOptions.authorization.organizationMember) };
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
				return this.createAuthorizationResponse('Organization member: Unauthorized member');
			}
			
			if (roles.length > 0 && !this.isAuthorizedInOrg(modelOptions.authorization, roles)) {
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
		const isOrgOwner = this.isAuthorizedInOrg(modelOptions.authorization, authRoles);
		const isUser =  modelOptions.authorization.user._id.toString() === data.user.toString();
		if (isOrgOwner || isUser) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document remove');
	}

}


export const accountOrganizationMemberService = new AccountOrganizationMemberService();
