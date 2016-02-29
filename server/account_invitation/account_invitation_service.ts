import {AccountInvitation, ModelOptions} from '../../client/core/dto';
import {AccountInvitationModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {sendGridCymplarService} from '../sendgrid_cymplar/sendgrid_cymplar_service';
import {ObjectUtil} from '../../client/core/util';

export class AccountInvitationService extends BaseService<AccountInvitation> {

	constructor() {
		super(AccountInvitationModel, { copyAuthorizationData: 'organizationMember', population: 'organization createdBy' });
	}

	createOne(data: AccountInvitation, options: ModelOptions = {}): Promise<AccountInvitation> {

		return new Promise<AccountInvitation>((fulfill: Function, reject: Function) => {
			super.createOne(data, options)
			.then((accountInvitation: AccountInvitation) => {
				data._id = accountInvitation._id;
				const payload   = {
					to      : data.email,
					from    : process.env.CYMPLAR_SENDGRID_ORIGIN,
					subject : 'You have been invited to use cymplar',
					text    : `You have been invited to the organization, you can join the organization either
							   using the following link http://localhost:5555/api/login?inv=${accountInvitation._id}
							   or providing this code when requested after the login/signup ${accountInvitation.code}`
				};
				return sendGridCymplarService.sendEmail(payload);
			})
			.then((sentEmail: any) => {
				fulfill(sentEmail);
			})
			.catch((err) => {
				this.removeSkipingHooks(data); 
				reject(err);
			});
		});
	}
	
	/* tslint:disable */ // In this switches the default is not needed
	protected addAuthorizationDataInCreate(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'organizationMember':
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.organizationMember._id;
				modelOptions.additionalData['organization'] = 
					ObjectUtil.getStringUnionProperty(modelOptions.authorization.organizationMember.organization);
				break;
		}
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'organizationMember':
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.organizationMember._id;
				modelOptions.additionalData['organization'] = 
					ObjectUtil.getStringUnionProperty(modelOptions.authorization.organizationMember.organization);
				break;
		}
	}
	/* tslint:enable */
}

export const accountInvitationService = new AccountInvitationService();

