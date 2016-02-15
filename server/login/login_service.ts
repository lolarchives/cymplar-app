import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';
import {AccountUserModel} from '../core/model';
import {LogIn, AuthenticationResponse, AccountUser, AccountOrganizationMember, ModelOptions} from '../../client/core/dto';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';


export class LoginService {

	createOne(data: LogIn, options: ModelOptions = {}): Promise<string> {
		if (ObjectUtil.isBlank(data.organization)) {
			return new Promise(function (fulfill, reject) {
			  reject(new Error('An organization should be chosen'));
			});
    	}
		
		if (ObjectUtil.isBlank(data.username) || ObjectUtil.isBlank(data.password)) {
			return new Promise(function (fulfill, reject) {
			  reject(new Error('Invalid credentials'));
			});
    	}

		return new Promise<string>((resolve: Function, reject: Function) => {
			this.validateAccountUser(data)
			.then((accountUser: AccountUser) => {
				const authenticationResp: AuthenticationResponse = {};
				authenticationResp.token = this.getToken(accountUser);
				resolve(authenticationResp);
		}, (err: any) => reject(err));
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
				population: {
					path: 'user',
					match: { username: data.username }
				},
				copyAuthorizationData: '',
				validatePostSearchAuthData: false
			};
			accountOrganizationMemberService.findOne({ organization: data.organization }, accountUserModelOptions)
			.then((accountOrganizationMember: AccountOrganizationMember) => {
				if (ObjectUtil.isBlank(accountOrganizationMember.user)) {
					reject(new Error('The user does not exist within this organization'));
					return;
				}
				if (!bcrypt.compareSync(data.password, accountOrganizationMember.user.password)) {
					reject(new Error('Invalid password'));
					return;
				}
				resolve(accountOrganizationMember.user);
			})
			.catch((err) => {
				return reject(err);
			});
		});
	}

}
 
export const loginService = new LoginService();