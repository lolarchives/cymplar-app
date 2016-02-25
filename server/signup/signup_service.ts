import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';

import {loginService} from '../login/login_service';
import {accountUserService} from '../account_user/account_user_service';
import {accountOrganizationService} from '../account_organization/account_organization_service';
import {SignUp, AccountUser, AccountOrganization, ModelOptions} from '../../client/core/dto';


export class SignupService {

	createOne(data: SignUp = {}, options: ModelOptions = {}): Promise<string> {
		
		return new Promise<string>((fulfill: Function, reject: Function) => {
			options.requireAuthorization = false; // As it doesn't need authorization validation it can be skipped
			options.copyAuthorizationData = '';
					
			accountUserService.createOne(data.user, options)
			.then((accountUser: AccountUser) => {
				options.authorization.user = accountUser;
				options.copyAuthorizationData = 'user';
				return accountOrganizationService.createOneWithMember(data, options); 
			})
			.then((accountOrganization: AccountOrganization) => { 
				const response = { 
					init: accountOrganization._id,
					token: loginService.getToken(options.authorization.user)
				};
				fulfill(response); 
			})
			.catch((err) => {
				if (ObjectUtil.isPresent(options.authorization.user)) {
					accountUserService.removeSkipingHooks({ _id: options.authorization.user._id });
				} 
				reject(err);
				return; 
			});
		});
	}
}
 
export const signupService = new SignupService();