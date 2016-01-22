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

	protected evaluateUpdateAuthorization(modelOptions: ModelOptions = {}, reject: Function, data?: AccountOrganizationMember) {
		super.evaluateUpdateAuthorization(modelOptions, reject);
		const authorization: AuthorizationData = modelOptions.authorization;
		if (!this.existsOrganizationMember(authorization) || ObjectUtil.isBlank(authorization.organizationMember.role)) {
			reject(new Error("Unauthorized user aoms"));
		}
		return;
	}
	protected evaluateSearchAuthorization(modelOptions: ModelOptions = {}, reject: Function, data?: AccountOrganizationMember) {
		super.evaluateSearchAuthorization(modelOptions, reject);
		const authorization: AuthorizationData = modelOptions.authorization;
		if (!this.existsOrganizationMember(authorization) || ObjectUtil.isBlank(authorization.organizationMember.role)) {
			reject(new Error("Unauthorized user aoms"));
		}
	}
	
	protected evaluateUpdateExecutionAuthorization(modelOptions: ModelOptions = {}, reject: Function, data?: AccountOrganizationMember): void {
		const authorization: AuthorizationData = modelOptions.authorization;
		if (!this.existsOrganizationMember(authorization)) {
			reject(new Error("Unauthorized user in this organization"));	
		}
		if (authorization.organizationMember._id === data._id ||
		 (authorization.organizationMember.role['grantUpdate'])) {
			return;
		}
		reject(new Error("Unauthorized user"));
	}
	
	protected evaluateRemoveExecutionAuthorization(modelOptions: ModelOptions = {}, reject: Function, data?: AccountOrganizationMember): void {
		const authorization: AuthorizationData = modelOptions.authorization;
		if (!this.existsOrganizationMember(authorization)) {
			reject(new Error("Unauthorized user in this organization"));	
		}
		if (authorization.organizationMember._id === data._id ||
		 (authorization.organizationMember.role['grantDelete'])) {
			return;
		}
		reject(new Error("Unauthorized user"));
	}
}

export const accountOrganizationMemberService = new AccountOrganizationMemberService();
