import * as express from 'express'; 
import {decode, encode} from 'jwt-simple';
import * as bcrypt from 'bcrypt';

import {sendError} from '../core/web_util';
import {ObjectUtil} from '../../client/core/util';

import {loginService} from '../login/login_service';
import {accountUserService} from '../account_user/account_user_service';
import {accountOrganizationService} from '../account_organization/account_organization_service';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';
import {SignUp, AccountUser, AccountOrganization, AccountOrganizationMember} from '../../client/core/dto';


export class SignupService {

	createOne(data: SignUp = {}): Promise<string> {

		let creationHistory: any = {};

		return new Promise<string>((fulfill: Function, reject: Function) => {
	
		accountUserService.createOne(data.user)
		.then((accountUser: AccountUser) => {
								creationHistory.user = accountUser;
								data.organization.createdBy = creationHistory.user._id;
								return accountOrganizationService.createOne(data.organization); 
								})
		.then((accountOrganization: AccountOrganization) => { 
												creationHistory.organization = accountOrganization;
												return this.createOrganizationMember(accountOrganization, data.organizationMember, 
																			creationHistory.user); })
		.then((accountMember: AccountOrganizationMember) => { creationHistory.member = accountMember;
										const response = { 
											init: creationHistory.organization._id,
											token: loginService.getToken(creationHistory.user)
										};
										
										fulfill(response); 
									})
		.catch((err) => {
							if (creationHistory.member) {
							accountOrganizationMemberService.removeOneById(creationHistory.member._id);
							}
	
							if (creationHistory.organization) {
							accountOrganizationService.removeOneById(creationHistory.organization._id);
							} 
	
							if (creationHistory.user) {
							accountUserService.removeOneById(creationHistory.user._id);
							} 
						reject(err); 
						});
		});
	}
	
	private createOrganizationMember(organization: AccountOrganization, 
		member: AccountOrganizationMember, user: AccountUser): Promise<AccountOrganizationMember> {
		member.user = user._id;
		member.organization = organization._id;
		return accountOrganizationMemberService.createOne(member);
	}

}
 
export const signupService = new SignupService();