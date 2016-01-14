import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';
import {AccountUser, AccountOrganizationMember, ModelOptions} from '../../client/core/dto';
import {accountUserService} from '../account_user/account_user_service';
import {AuthorizationData} from '../../client/core/dto';


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
		
		req.body.cymplarRole = {};
		
		if (NON_SECURED_URL.indexOf(req.originalUrl.split("?")[0]) > -1) {
			return next();
		}
		
		const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) 
			|| (req.headers && ((req.headers['x-access-token']) 
			|| (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]))) || '';
		
		if (ObjectUtil.isBlank(token)) { 
			return sendError(res, new Error('Token is required'), { token: false });
		}
		
		try {	
			const decoded = decode(token, process.env.CYMPLAR_SECRET);
		
			if (ObjectUtil.isBlank(decoded.sub)) {
				return sendError(res, new Error('Invalid Token'), { token: false });
			}
			
			if (decoded.exp <= Date.now()) {
				return sendError(res, new Error('Token expired'), { token: false });
			}
			
			//query id_organization (ido), id_lead (idl)
			const idSessionParams = {
				ido: (req.query.ido ? req.query.ido : req.body.ido)
			};
			
			const accountUserModelOptions: ModelOptions = {
				requireAuthorization: false,
				projection: '_id'
			}; 
					
			accountUserService.findOneById(decoded.sub, accountUserModelOptions)
			.then((user: AccountUser) => {
				if (user._id) {
					req.body.cymplarRole.user = user;	
				}
				
				if (ObjectUtil.isPresent(user._id) && ObjectUtil.isPresent(idSessionParams.ido)) {
					const orgMemberModelOptions: ModelOptions = {
						projection: 'user role organization',
						population: 'role',
						requireAuthorization: false
					}; 		
					
					return accountOrganizationMemberService.findOne({user: user._id, organization: idSessionParams.ido}, orgMemberModelOptions);
				} else { 
					return Promise.resolve({});
				};
			})
			.then((organizationMember: AccountOrganizationMember) => {
				if (ObjectUtil.isPresent(organizationMember._id)) {
					req.body.cymplarRole.organizationMember = organizationMember;	
				}
				return next();
			})
			.catch((err: Error) => {
				return sendError(res, err, { token: false });
			});
		} catch (err) {
			return sendError(res, err, { token: false });
		}
	}
}

export const authentication = new Authentication();