import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';


export class Authentication {

	validate(req: express.Request, res: express.Response, next: Function) {
		
		const NON_SECURED_URL: string[] = [];
		NON_SECURED_URL.push('/api/account-user/_exist');
		NON_SECURED_URL.push('/api/account-organization-member/_exist');
		NON_SECURED_URL.push('/api/account-organization/_exist');
		NON_SECURED_URL.push('/api/industry/_find');
		NON_SECURED_URL.push('/api/country/_find');
		NON_SECURED_URL.push('/api/city/_find');
		NON_SECURED_URL.push('/api/account-member-role');
		NON_SECURED_URL.push('/api/signup');
		NON_SECURED_URL.push('/api/login');
		
		if (NON_SECURED_URL.indexOf(req.originalUrl.split("?")[0]) > -1) {
			next();
			return;
		}
		
		const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || 
		(req.headers && (req.headers['x-access-token'] || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]))) || '';
		
		if (ObjectUtil.isBlank(token)) { 
			sendError(res, new Error('There is no token'));
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
}

export const authentication = new Authentication();