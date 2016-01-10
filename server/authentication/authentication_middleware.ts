import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';
import {AccountUser, AccountOrganizationMember, SalesLeadOrganizationMember, ModelOptions} from '../../client/core/dto';
import {salesLeadOrganizationMemberService} from '../sales_lead_organization_member/sales_lead_organization_member_service';
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
			return next(new Error('Invalid Token'));
		}
		
		try {
			const decoded = decode(token, process.env.CYMPLAR_SECRET);
			
			if (decoded.exp <= Date.now()) {
				return next(new Error('Token expired'));
			}
			
			//query id_organization (ido), id_lead (idl)
			const idSessionParams = {
				ido: (req.query.ido ? req.query.ido : req.body.ido),
				idl: (req.query.idl ? req.query.idl : req.body.idl)
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
				
				if (ObjectUtil.isPresent(organizationMember._id) && ObjectUtil.isPresent(idSessionParams.idl)) {
					const leadMemberModelOptions: ModelOptions = {
						projection: 'role leardOrganization',
						population: 'role leadOrganization',
						complexSearch: {
							'member': organizationMember._id,
							'leadOrganization.organization': organizationMember.organization,
							'leadOrganization.lead': idSessionParams.idl
						},
						requireAuthorization: false
					};
					return salesLeadOrganizationMemberService.findOne({}, leadMemberModelOptions);
				} else {
					return Promise.resolve({});
				}
			})
			.then((leadMember: SalesLeadOrganizationMember) => {
				if (leadMember._id) {
					req.body.cymplarRole.leadMember = leadMember;	
				}
				return next();
			})
			.catch((err) => {
				return next(err);
			});
			
		} catch (err) {
			return next(new Error("Token could not be verified"));
		}
	}
}

export const authentication = new Authentication();