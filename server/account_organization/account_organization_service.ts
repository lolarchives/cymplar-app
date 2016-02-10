import {SignUp, AccountOrganization, AccountOrganizationMember, AuthorizationData, ModelOptions, 
	AuthorizationResponse} from '../../client/core/dto';
import {AccountOrganizationModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';

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
				onlyValidateParentAuthorization: true,
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
			return; 
			});
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
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	findOrganizationsPerUserMember(data: AccountOrganization, newOptions: ModelOptions = {}): Promise<AccountOrganization[]> {
		return new Promise<AccountOrganization[]>((resolve: Function, reject: Function) => {
			
			const authorizationResponse = super.authorizationEntity(newOptions);
			
			if (!authorizationResponse.isAuthorized) {
				reject(new Error(authorizationResponse.errorMessage));
				return;
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
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {
			const authorizationResponse = super.authorizationEntity(modelOptions);
			
			if (modelOptions.onlyValidateParentAuthorization || !authorizationResponse.isAuthorized) {
				return authorizationResponse;
			}
			
			if (!this.existsOrganizationMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse("Organization: Unauthorized member");
			}
			
			if (roles.length > 0 && roles.indexOf(modelOptions.authorization.organizationMember.role.code) < 0) {
				return this.createAuthorizationResponse("Organization: Unauthorized member role");
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

