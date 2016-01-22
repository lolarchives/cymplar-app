import {SignUp, AccountOrganization, AccountOrganizationMember, AuthorizationData, ModelOptions} from '../../client/core/dto';
import {AccountOrganizationModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';

export class AccountOrganizationService extends BaseService<AccountOrganization> {

	constructor() {
		super(AccountOrganizationModel);
	}

	createOneWithMember(data: SignUp = {}, options: ModelOptions = {}): Promise<AccountOrganization> {
		return new Promise<AccountOrganization>((fulfill: Function, reject: Function) => {
		let createdAccountOrganization: AccountOrganization = {};	
		this.createOne(data.organization, options)
		.then((accountOrganization: AccountOrganization) => {
			createdAccountOrganization = accountOrganization;
			const memberModelOptions: ModelOptions = {
				authorization: options.authorization
			};
			return this.createOrganizationMember(accountOrganization, data.organizationMember, options);
		})
		.then((accountMember: AccountOrganizationMember) => {
			createdAccountOrganization['member'] = accountMember;
			fulfill(createdAccountOrganization); 
		})
		.catch((err) => {
			if (ObjectUtil.isPresent(createdAccountOrganization._id)) {
				this.removeOneById(createdAccountOrganization._id);
			} 
			reject(err); 
			});
		});
	}
	
	copySignificantAuthorizationData(data: AccountOrganizationMember, modelOptions: ModelOptions = {}): void {
		const authorization: AuthorizationData = modelOptions.authorization;
		if (ObjectUtil.isPresent(authorization) && ObjectUtil.isPresent(authorization.user)) {
			if (modelOptions.copyAuthorizationData) {
				data.createdBy = authorization.user;	
			}
		}
	}
	
	findOrganizationsPerUser(data: AccountOrganization, newOptions: ModelOptions = {}): Promise<AccountOrganization[]> {
		return new Promise<AccountOrganization[]>((resolve: Function, reject: Function) => {
			const search = this.obtainSearchExpression(data);
			const organizationMemberOptions: ModelOptions = { 
				authorization: newOptions.authorization,
				distinct: 'organization',
				requireAuthorization: false
			};
			accountOrganizationMemberService.findDistinct({}, organizationMemberOptions)
			.then((idOrg: string[]) => {
				newOptions.complexSearch =  { _id: { $in: idOrg }};
				newOptions.copyAuthorizationData = false;
				return this.find(data, newOptions);
			})
			.then((accountOrganizations: AccountOrganization[]) => {
				resolve(accountOrganizations);
			})
			.catch((err) => { 
				reject(err); 
			});
		});
	}
	
	private createOrganizationMember(organization: AccountOrganization, 
		member: AccountOrganizationMember, options: ModelOptions = {}): Promise<AccountOrganizationMember> {
		member.organization = organization._id;
		return accountOrganizationMemberService.createOne(member, options);
	}
}

export const accountOrganizationService = new AccountOrganizationService();

