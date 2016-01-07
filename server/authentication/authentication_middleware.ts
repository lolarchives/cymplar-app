import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';
import {AccountOrganizationMember, SalesLeadOrganizationMember, ModelOptions} from '../../client/core/dto';
import {salesLeadOrganizationMemberService} from '../sales_lead_organization_member/sales_lead_organization_member_service';


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
			
			const orgMemberSearchParams = {
				user: decoded.sub
			};
			
			if (ObjectUtil.isPresent(idSessionParams.ido)) {
				orgMemberSearchParams['organization'] = idSessionParams.ido;
			}
				
			const orgMemberModelOptions: ModelOptions = {
				projection: 'user role organization',
				population: 'role',
				requireAuthorization: false
			}; 
						
			accountOrganizationMemberService.findOne(orgMemberSearchParams, orgMemberModelOptions)
			.then((organizationMember: AccountOrganizationMember) => {
			
				if (ObjectUtil.isBlank(idSessionParams.ido)) {
					delete organizationMember._id;
					delete organizationMember.organization;
					delete organizationMember.role;
				}
				
				if (ObjectUtil.isPresent(organizationMember)) {
					req.body.cymplarRole.organizationMember = organizationMember;	
				} 
				
				if (ObjectUtil.isPresent(idSessionParams.ido) && ObjectUtil.isPresent(idSessionParams.idl)) {
					
					const leadMemberModelOptions: ModelOptions = {
						projection: 'role leardOrganization',
						population: 'role leadOrganization',
						complexSearch: {
							'member': req.body.cymplarRole.organizationMember._id,
							'leadOrganization.organization': req.body.cymplarRole.organizationMember.organization,
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
			
				if (ObjectUtil.isPresent(leadMember) && ObjectUtil.isPresent(leadMember._id)) {
					req.body.cymplarRole.leadMember = leadMember;
				}
	
				return next();
			})
			.catch((err) => {
				return next(new Error("This user could not be found, therefore no authorization can be granted"));
			});
			
		} catch (err) {
			return next(new Error("Token could not be verified"));
		}
	}
}

export const authentication = new Authentication();