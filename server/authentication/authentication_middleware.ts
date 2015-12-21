import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';

const NON_SECURED_URL: string[] = ['/api/account-user/_exist', 
		'/api/account-organization-member/_exist',
		'/api/account-organization/_login',
		'/api/account-organization/_exist',
		'/api/industry/_find',
		'/api/country/_find',
		'/api/city/_find',
		'/api/account-member-role/_find',
		'/api/signup',
		'/api/login'];
		
export class Authentication {

	validate(req: express.Request, res: express.Response, next: Function) {
		
		if (NON_SECURED_URL.indexOf(req.originalUrl.split("?")[0]) > -1) {
			return next();
		}
		
		const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) 
			|| (req.headers && ((req.headers['x-access-token']) 
			|| (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]))) || '';
		
		if (ObjectUtil.isBlank(token)) { 
			sendError(res, new Error('Invalid Token'));
			return next();
		}

		try {
			const decoded = decode(token, process.env.CYMPLAR_SECRET);
			
			if (decoded.exp <= Date.now()) {
				sendError(res, new Error('Token expired'));
				return next();
			}

			req.body.tempCymplar = decoded;
			return next();
			
		} catch (err) {
			sendError(res, new Error('Invalid Token'));
			return next();
		}
	}
}

export const authentication = new Authentication();