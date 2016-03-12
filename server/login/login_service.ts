import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';
import {AccountUserModel} from '../core/model';
import {LogIn, AuthenticationResponse, AccountUser, AccountOrganizationMember, ModelOptions} from '../../client/core/dto';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';
import {accountOrganizationService} from '../account_organization/account_organization_service';
import {accountUserService} from '../account_user/account_user_service';

export class LoginService {

	createOne(data: LogIn, options: ModelOptions = {}): Promise<string> {
		
		return new Promise<string>((resolve: Function, reject: Function) => {

			if (ObjectUtil.isBlank(data.organization)) {
				return reject(new Error('An organization should be chosen'));
			}
			
			if (ObjectUtil.isBlank(data.username) || ObjectUtil.isBlank(data.password)) {
				return reject(new Error('Invalid credentials'));
			}
		
			this.validateAccountUser(data)
			.then((accountUser: AccountUser) => {
				const authenticationResp: AuthenticationResponse = {};
				authenticationResp.token = this.getToken(accountUser);
				
				const loginPromises: Promise<any>[] = [];
				loginPromises.push(Promise.resolve(authenticationResp));
				
								
				return Promise.all(loginPromises);
			})
			.then((results: any) => {
				resolve(results[0]); // Sends the authentication response
			})
			.catch((err) => reject(err));
		});
	}

	getToken(accountUser: AccountUser) {
		const days = 1; // 1 day
		const expires = (Date.now() + (days * 24 * 60 * 60 * 1000));

		const payload = { 
			sub: accountUser._id,
			exp: expires 
		};
		const token = encode(payload, process.env.CYMPLAR_SECRET);

		return token;
	}

	private validateAccountUser(data: LogIn): Promise<AccountUser> {
		return new Promise<AccountUser>((resolve: Function, reject: Function) => {
			const accountUserModelOptions: ModelOptions = {
				requireAuthorization: false,
				copyAuthorizationData: '',
				validatePostSearchAuthData: false,
				projection: '_id'
			};
			
			accountUserService.findOne({ username: data.username }, accountUserModelOptions)
			.then((accountUser: AccountUser) => {
				const accountMemberModelOptions: ModelOptions = {
					requireAuthorization: false,
					copyAuthorizationData: '',
					validatePostSearchAuthData: false,
					population: 'user',
					additionalData: { organization: data.organization, user: accountUser._id }
				};
			
				return accountOrganizationMemberService.findOne({}, accountMemberModelOptions);
			})
			.then((accountOrganizationMember: AccountOrganizationMember) => {
				
				if (!bcrypt.compareSync(data.password, ObjectUtil.getStringUnionProperty(accountOrganizationMember.user, 'password'))) {
					return reject(new Error('Invalid password'));
				}
				resolve(accountOrganizationMember.user);
			})
			.catch((err: Error) => reject(err));
		});
	}

}
 
export const loginService = new LoginService();