import {AccountUser, AuthorizationData, ModelOptions} from '../../client/core/dto';
import {AccountUserModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class AccountUserService extends BaseService<AccountUser> {

	constructor() {
		super(AccountUserModel);
	}
	
	copySignificantAuthorizationData(data: AccountUser, modelOptions: ModelOptions = {}): void {
		const authorization = modelOptions.authorization;
		if (ObjectUtil.isPresent(authorization) && ObjectUtil.isPresent(authorization.user)) {
			data._id = authorization.user._id;
		}
	}

}

export const accountUserService = new AccountUserService();

