import {AccountUser, AuthorizationData, ModelOptions, AuthorizationResponse} from '../../client/core/dto';
import {AccountUserModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class AccountUserService extends BaseService<AccountUser> {

	constructor() {
		super(AccountUserModel,  { projection: '-password' });
	}

	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'user':
				modelOptions.additionalData['_id'] = modelOptions.authorization.user._id;
				break;
			default:
				break;
		}
	}
	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, data?: AccountUser): AuthorizationResponse {
		if (data._id.toString() !== modelOptions.authorization.user._id.toString()) {
			return this.createAuthorizationResponse('The user cannot perform this action');
		}
		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, data?: AccountUser): AuthorizationResponse {
		if (data._id.toString() !== modelOptions.authorization.user._id.toString()) {
			return this.createAuthorizationResponse('The user cannot perform this action');
		}
		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearch(modelOptions: ModelOptions = {}, data?: AccountUser): AuthorizationResponse {
		if (data._id.toString() !== modelOptions.authorization.user._id.toString()) {
			return this.createAuthorizationResponse('The user cannot perform this action');
		}
		return this.createAuthorizationResponse();
	}
}

export const accountUserService = new AccountUserService();

