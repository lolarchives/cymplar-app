import {AccountOrganizationMember, AuthorizationData, ModelOptions} from '../../client/core/dto';
import {AccountOrganizationMemberModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class AccountOrganizationMemberService extends BaseService<AccountOrganizationMember> {

	constructor() {
		super(AccountOrganizationMemberModel, { population: 'role' });
	}
		
	copySignificantAuthorizationData(data: AccountOrganizationMember, modelOptions: ModelOptions = {}): void {
		if (!modelOptions.copyAuthorizationData) {
			return;
		}
		const authorization: AuthorizationData = modelOptions.authorization; 
		if (ObjectUtil.isPresent(authorization) && ObjectUtil.isPresent(authorization.user)) {
			if (modelOptions.copyAuthorizationData) {
				data.user = authorization.user;	
			}
		}
	}
	
	protected obtainComplexAuthorizationSearchExpression(data: AccountOrganizationMember, authorization: AuthorizationData = {}): any {
		const complexSearch = {
			createdBy: { $exists: true },
			_id: {$ne: authorization.organizationMember._id}
		};
		return complexSearch;	
	}
	
	isUpdateAuthorized(modelOptions: ModelOptions = {}, reject: Function) {
		if (!modelOptions.requireAuthorization) {
			return;
		}
		const authorization: AuthorizationData = modelOptions.authorization;
		super.isUpdateAuthorized(modelOptions, reject);
		if (ObjectUtil.isBlank(authorization.organizationMember) && ObjectUtil.isBlank(authorization.organizationMember.role)) {
			reject(new Error("Unauthorized user aoms"));
		}
		return;
	}
	
	isSearchAuthorized(modelOptions: ModelOptions = {}, reject: Function) {
		if (!modelOptions.requireAuthorization) {
			return;
		}
		const authorization: AuthorizationData = modelOptions.authorization;
		super.isSearchAuthorized(modelOptions, reject);
		if (ObjectUtil.isBlank(authorization.organizationMember) && ObjectUtil.isBlank(authorization.organizationMember.role)) {
			reject(new Error("Unauthorized user aoms"));
		}
		return;
	}
	
	protected isUpdateAuthorizedExecution(modelOptions: ModelOptions = {}, reject: Function, data?: AccountOrganizationMember): void {
		if (!modelOptions.requireAuthorization) {
			return;
		}
		const authorization: AuthorizationData = modelOptions.authorization;
		if (authorization.organizationMember._id === data._id && authorization.organizationMember.role['grantUpdate']) {
			return;
		}
		
		reject(new Error("Unauthorized user"));
	}
	
	protected isRemoveAuthorizedExecution(modelOptions: ModelOptions = {}, reject: Function, data?: AccountOrganizationMember): void {
		if (!modelOptions.requireAuthorization) {
			return;
		}
		const authorization: AuthorizationData = modelOptions.authorization;
		if (authorization.organizationMember._id === data._id && authorization.organizationMember.role['grantDelete']) {
			return;
		}
		
		reject(new Error("Unauthorized user"));
	}
}

export const accountOrganizationMemberService = new AccountOrganizationMemberService();
