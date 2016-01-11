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
				
		accountUserService.createOne(data.user, options)
		.then((accountUser: AccountUser) => {
			data.organization.createdBy = accountUser;
			data.organizationMember.user = accountUser;
			return accountOrganizationService.createOneWithMember(data, options); 
		})
		.then((accountOrganization: AccountOrganization) => { 
			const response = { 
				init: accountOrganization._id,
				token: loginService.getToken(data.organization.createdBy)
			};
			fulfill(response); 
		})
		.catch((err) => {
			if (ObjectUtil.isPresent(data.organization.createdBy)) {
				accountUserService.removeOneById(data.organization.createdBy._id, options);
			} 
			reject(err); 
			});
		});
	}
}
 
export const signupService = new SignupService();