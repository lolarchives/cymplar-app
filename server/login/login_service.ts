import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';
import {AccountUserModel} from '../core/model';
import {LogIn, AccountUser} from '../../client/core/dto';


export class LoginService {

	createOne(data: LogIn): Promise<string> {

		if (ObjectUtil.isPresent(data.username) && ObjectUtil.isPresent(data.password)) {
			return new Promise(function (fulfill, reject) {
			  reject(new Error('Invalid credentials'));
			});
    	}

		return new Promise<string>((resolve: Function, reject: Function) => {
			this.validateAccountUser(data)
			.then((AccountUser: AccountUser) => 
				resolve(this.getToken(AccountUser)), (err: any) => reject(err));
		});
	}

	validate(req: express.Request, res: express.Response, next: Function) {

		const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) 
			|| (req.headers && (req.headers['x-access-token'] || req.headers['Authorization'].split(' ')[1])) || '';
		
		if (ObjectUtil.isBlank(token)) { 
			sendError(res, new Error('Invalid Token'));
			return;
		}

		try {
			const decoded = decode(token, process.env.CYMPLAR_SECRET);

			if (decoded.exp <= Date.now()) {
				sendError(res, new Error('Token expired'));
				return;
			}

			req.body.tempCymplar = decoded;

		} catch (err) {
			sendError(res, new Error('Invalid Token'));
			return;
		}
		
		next();
	}
	
	getToken(AccountUser: AccountUser) {
		const expires = this.expiresIn(1); // 1 day

		const payload = { 
			sub: AccountUser._id,
			exp: expires 
		};
		
		const token = encode(payload, process.env.CYMPLAR_SECRET);

		return token;
	}
	
	private expiresIn(time: number) {
		const dateObject = new Date();
		return dateObject.setDate(dateObject.getDate() + time);
	}

	private validateAccountUser(data: LogIn): Promise<AccountUser> {
		
		return new Promise<AccountUser>((resolve: Function, reject: Function) => {
			AccountUserModel.findOne({ username: data.username}, (err: Error, foundDoc: AccountUser) => {
				if (err) {
					reject(err);
					return;
				}
				
				if (!foundDoc) {
					reject(new Error('User not found'));
					return;
				}
				
				if (!bcrypt.compareSync(data.password, foundDoc[0].password)) {
					reject(new Error('Invalid password'));
					return;
				}

				resolve(foundDoc[0]);
			});
		});
	}

}
 
export const loginService = new LoginService();