import {SignUp, AccountOrganization, AccountOrganizationMember, AuthorizationData, ModelOptions, 
	AuthorizationResponse, AccountInvitation} from '../../client/core/dto';
import {AccountOrganizationModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';
import {accountMemberRoleService} from '../account_member_role/account_member_role_service';
import {accountInvitationService} from '../account_invitation/account_invitation_service';
import {salesLeadService} from '../sales_lead/sales_lead_service';

export class AccountOrganizationService extends BaseService<AccountOrganization> {

	constructor() {
		const modelOptions: ModelOptions = {
			population: [
				{
					path: 'city',
					populate: {
						path: 'state', 
						model: 'state',
						populate: {
							path: 'country', 
							model: 'country'
						}
					}
				}
			]
		};
		super(AccountOrganizationModel, modelOptions);
	}

	createOneWithMember(data: SignUp = {}, options: ModelOptions = {}): Promise<AccountOrganization> {
		return new Promise<AccountOrganization>((fulfill: Function, reject: Function) => {
		let createdAccountOrganization: AccountOrganization = {};
		this.createOne(data.organization, options)
		.then((accountOrganization: AccountOrganization) => {
			createdAccountOrganization = accountOrganization;
			const memberModelOptions: ModelOptions = {
				authorization: options.authorization,
				onlyValidateParentAuthorization: true
			};
			
			// Create the member for the organization
			data.organizationMember.organization = accountOrganization._id;
			return accountOrganizationMemberService.createOne(data.organizationMember, memberModelOptions);
		})
		.then((accountMember: AccountOrganizationMember) => {
			options.authorization.organizationMember = accountMember;
			fulfill(createdAccountOrganization); 
		})
		.catch((err) => {
			if (ObjectUtil.isPresent(createdAccountOrganization._id)) {
				this.removeSkipingHooks( { _id: createdAccountOrganization._id } );
				accountOrganizationMemberService.removeSkipingHooks( { organization: createdAccountOrganization._id } );
			} 
			
			reject(err);
			});
		});
	}
	
	updateOne(data: AccountOrganization, newOptions: ModelOptions = {}): Promise<AccountOrganization> {
		return new Promise<AccountOrganization>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);			
			this.preUpdateOne(data, txModelOptions)
			.then((objectToUpdate: any) => {
				const childrenUpdateStageTasks: Promise<any>[] = [];
				childrenUpdateStageTasks.push(Promise.resolve(objectToUpdate));
				childrenUpdateStageTasks.push(salesLeadService.updateChildrenStages(data));
				return Promise.all(childrenUpdateStageTasks);					
			})
			.then((results: any) => {
				const objectToUpdate = results[0];
								
				for (let prop in data) {
					objectToUpdate[prop] = data[prop];
				}
				
				objectToUpdate.save((err: Error, savedDoc: any) => {
					if (err) {
						return reject(err);
					}
					savedDoc.populate(txModelOptions.population, (err: Error, populatedObj: any) => {
						if (err) {
							return reject(err);
						}
						resolve(populatedObj.toObject());
					});
				});
			})
			.catch((err) => reject(err));
		});
	}
	
	findOrganizationsPerUser(data: AccountOrganization, newOptions: ModelOptions = {}): Promise<AccountOrganization[]> {
		return new Promise<AccountOrganization[]>((resolve: Function, reject: Function) => {

			const memberModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				distinct: 'organization',
				population: '',
				onlyValidateParentAuthorization: true,
				copyAuthorizationData: 'user'
			};
			
			accountOrganizationMemberService.findDistinct({}, memberModelOptions)
			.then((accountOrganizationsId: string[]) => {
				
				newOptions.additionalData = { _id: { $in: accountOrganizationsId }};
				newOptions.copyAuthorizationData = '';
				newOptions.onlyValidateParentAuthorization = true ;
				newOptions.copyAuthorizationData = '';
				
				return super.find(data, newOptions);
			})
			.then((accountOrganizations: AccountOrganization[]) => {
				resolve(accountOrganizations);
			})
			.catch((err) => reject(err));
		});
	}
	
	findOrganizationsPerUserMember(data: AccountOrganization, newOptions: ModelOptions = {}): Promise<AccountOrganization[]> {
		return new Promise<AccountOrganization[]>((resolve: Function, reject: Function) => {
			
			const authorizationResponse = super.authorizationEntity(newOptions);
			
			if (!authorizationResponse.isAuthorized) {
				return reject(new Error(authorizationResponse.errorMessage));
			}
			
			newOptions.population = [{
					path: 'organization',
					populate: {
						path: 'city',
						model: 'city',
						populate: {
							path: 'state', 
							model: 'state',
							populate: {
								path: 'country', 
								model: 'country'
							}
						}
					}
				}, {
					path: 'industry',
					copyAuthorizationData: 'user'
				}];
					
			newOptions.projection = 'organization -_id'; // Just to get the organizations of the user
			newOptions.requireAuthorization = false; 
			
			accountOrganizationMemberService.find({}, newOptions)
			.then((accountOrganizations: AccountOrganization[]) => {
				resolve(accountOrganizations);
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
			
			accountMemberRoleService.findDistinct({}, rolesModelOptions)
			.then((roles: string[]) => {
				const orgMemberModelOptions: ModelOptions = {
					authorization: newOptions.authorization,
					additionalData: { 
						role: { $in: roles }, 
						organization: data._id
					},
					copyAuthorizationData: '',
					onlyValidateParentAuthorization: true,
					distinct: '_id'
				};
				
				return accountOrganizationMemberService.findDistinct({}, orgMemberModelOptions);
			})
			.then((orgMembers: string[]) => {
				if (orgMembers.length > 0) {
					return reject(new Error(`There are more owners for this organization, it will not be removed.
					Unsubscribe from this organization instead`));
				} else {
					resolve(data);	
				}
			})
			.catch((err) => reject(err));
		});
	}
	
	addInvitedOrganizationMember(data: AccountInvitation, newOptions: ModelOptions = {}): Promise<AccountOrganization> {
		return new Promise<AccountOrganization>((resolve: Function, reject: Function) => {
			
			const intivationModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				population: '',
				onlyValidateParentAuthorization: true,
				copyAuthorizationData: ''
			};
			
			if (ObjectUtil.isBlank(data._id) && (ObjectUtil.isBlank(data.code) && ObjectUtil.isBlank(data.email))) {
				reject(new Error('There is not enough data to look for this invitation'));	
			}
			
			accountInvitationService.findOne(data, intivationModelOptions)
			.then((accountInvitation: AccountInvitation) => {
				
				if (accountInvitation.expiresAt < Date.now()) {
					return reject(new Error('The invitation has expired!'));	
				}
			
				if (ObjectUtil.isPresent(accountInvitation.redeemedBy)) {
					return reject(new Error('The invitation was already used'));	
				}
				
				const acceptInvitationPromises: Promise<any>[] = [];
				acceptInvitationPromises.push(Promise.resolve(accountInvitation)); // Keeps the accountInvitation object in results[0];
				
				const memberModelOptions: ModelOptions = {
					authorization: newOptions.authorization,
					onlyValidateParentAuthorization: true
				};
			
				const invitedMember: AccountOrganizationMember = {
					email: accountInvitation.email,
					createdBy: accountInvitation.createdBy,
					organization: accountInvitation.organization,
					role: accountInvitation.role	
				};
				
				acceptInvitationPromises.push(accountOrganizationMemberService.createOne(invitedMember, memberModelOptions));
				
				return Promise.all(acceptInvitationPromises);
			})
			.then((results: any[]) => {
				const postAcceptInvitationPromises: Promise<any>[] = [];
				postAcceptInvitationPromises.push(Promise.resolve(results[1])); // Keeps the organizationMember object in results[0];
				
				const accountInvitation: AccountInvitation = results[0];
				accountInvitation.redeemedBy = results[1]['user'];
				
				const intivationModelOptions: ModelOptions = {
					authorization: newOptions.authorization,
					population: '',
					onlyValidateParentAuthorization: true,
					copyAuthorizationData: ''
				};
				postAcceptInvitationPromises.push(accountInvitationService.updateOne(accountInvitation, intivationModelOptions));
				
				return Promise.all(postAcceptInvitationPromises);
			})
			.then((results: any[]) => {
				resolve(results[0]['organization']); // Take the organizationMember to return their organization
			})
			.catch((err) => reject(err));
		});
	}
	
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
	
	protected isUpdateAuthorized(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		const authorizedRoles = ['OWNER'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
	protected isRemoveAuthorized(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		const authorizedRoles = ['OWNER'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
}

export const accountOrganizationService = new AccountOrganizationService();

