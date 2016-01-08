import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';
import {AccountUserModel} from '../core/model';
import {LogIn, AuthenticationResponse, AccountUser, ModelOptions} from '../../client/core/dto';


export class LoginService {

	createOne(data: LogIn, options: ModelOptions = {}): Promise<string> {
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
				requireAuthorization: false
			};
			AccountUserModel.findOne({ username: data.username }, (err: Error, foundDoc: AccountUser) => {
				if (err) {
					reject(err);
					return;
				}
				
				if (!foundDoc) {
					reject(new Error('User not found'));
					return;
				}
				
				if (!bcrypt.compareSync(data.password, foundDoc.password)) {
					reject(new Error('Invalid password'));
					return;
				}
				
				resolve(foundDoc);
			});
		});
	}

}
 
export const loginService = new LoginService();