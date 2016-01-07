import {AccountOrganizationMember, AuthorizationData, ModelOptions} from '../../client/core/dto';
import {AccountOrganizationMemberModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class AccountOrganizationMemberService extends BaseService<AccountOrganizationMember> {

	constructor() {
		super(AccountOrganizationMemberModel, { population: 'role' });
	}
		
	copySignificantAuthorizationData(data: AccountOrganizationMember, modelOptions: ModelOptions = {}): void {
		const authorization: AuthorizationData = modelOptions.authorization;
		if (ObjectUtil.isPresent(authorization) && ObjectUtil.isPresent(authorization.organizationMember)) {
			if (modelOptions.copyAuthorizationData) {
				data.user = authorization.organizationMember.user;	
			}
		}
		return;
	}
	
	protected obtainComplexAuthorizationSearchExpression(data: AccountOrganizationMember, authorization: AuthorizationData = {}): any {
		const complexSearch = {
			createdBy: { $exists: true },
			_id: {$ne: authorization.organizationMember._id}
		};
			 
		return complexSearch;	
	}
	
	isUpdateAuthorized(authorization: AuthorizationData, reject: Function) {
		super.isUpdateAuthorized(authorization, reject);
		if (ObjectUtil.isBlank(authorization.organizationMember.role)) {
			reject(new Error("Unauthorized user aoms"));
		}
		return;
	}
	
	isSearchAuthorized(authorization: AuthorizationData, reject: Function) {
		super.isSearchAuthorized(authorization, reject);
		if (ObjectUtil.isBlank(authorization.organizationMember.role)) {
			reject(new Error("Unauthorized user aoms"));
		}
		return;
	}
	
	protected isUpdateAuthorizedExecution(modelOptions: ModelOptions = {}, reject: Function, data?: AccountOrganizationMember): void {
		const authorization: AuthorizationData = modelOptions.authorization;
		
		if (authorization.organizationMember._id === data._id ||
			(ObjectUtil.isPresent(authorization.organizationMember.role) && authorization.organizationMember.role['grantUpdate'])) {
			return;
		}
		
		reject(new Error("Unauthorized user"));
	}
	
	protected isRemoveAuthorizedExecution(modelOptions: ModelOptions = {}, reject: Function, data?: AccountOrganizationMember): void {
		const authorization: AuthorizationData = modelOptions.authorization;
		
		if (authorization.organizationMember._id === data._id ||
			(ObjectUtil.isBlank(authorization.organizationMember.role) && authorization.organizationMember.role['grantDelete'])) {
			return;
		}
		
		reject(new Error("Unauthorized user"));
	}
}

export const accountOrganizationMemberService = new AccountOrganizationMemberService();
