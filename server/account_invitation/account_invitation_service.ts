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
					subject : 'You have been invited to use Cymplar',
					html	: this.getHtmlText(accountInvitation),
					text    : `You have been invited to the organization, you can join the organization either
							   using the following link ${process.env.CYMPLAR_SERVER}/#/login?inv=${accountInvitation._id}
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
	
	private getHtmlText(data: AccountInvitation): string {
		
		const htmlString = `<!doctype html>
		<html>
		<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		</head>
		<body>
			<div style="font-family:Arial, Helvetica, sans-serif; background:#f1f1f1; line-height:1.6; padding:0 0 100px; font-size:14px;">
				<table style="max-width:600px; width:100%; text-align:center;" align="center">
					<tbody>
						<tr>
							<td style="padding:20px 30px;">
								<a href="">
									<img src="http://gdriv.es/cymweb/logo.png">
								</a>
							</td>
						</tr>
					</tbody>
				</table>
				
				<table style="max-width:600px; width:100%; background:#304c69 url(http://gdriv.es/cymweb/bg.png) no-repeat left bottom; 
				text-align:center; padding:80px 30px;" align="center">
					<tbody>
						<tr>
							<td style="color:#fff; font-size:30px; font-weight:600; line-height:1.2; padding:0 0 10px;">
								Hi
							</td>
						</tr>
						<tr>
							<td style="color:#fff; font-size:18px; padding:0 0 15px;">
								You have been invited to ${data.organization['name']}
							</td>
						</tr>
						<tr>
							<td style="padding:0;">
								<a href="${process.env.CYMPLAR_SERVER}/#/login?inv=${data._id}" style="color:#fff; 
								font-size:18px; text-decoration:none; color:#fff; font-weight:600; font-size:16px; 
								display: inline-block; border-radius:3px; line-height:1; padding:20px 40px; background:#5cb85c;">Join now</a>
							</td>
						</tr>
					</tbody>
				</table>
				
				<table style="max-width:600px; width:100%; background:#fff; padding:30px 30px 15px;" align="center">
					<tbody>
						<tr>
							<td style="color:#333; font-size:18px; font-weight:600; padding:0 0 15px;">
								Welcome to Cymplar
							</td>
						</tr>
						<tr>
							<td style="color:#333; padding-bottom:15px; ">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer libero tellus,
								 aliquet maximus nisi vel, vestibulum efficitur nibh. Aenean sit amet augue eu 
								 sapien auctor viverra convallis nec velit. Integer in ante lobortis, facilisis tortor sed, venenatis sapien.
							</td>
						</tr>
						<tr>
							<td style="padding:0 0 15px;">
								<hr style="border:none; height:1px; background:#ddd;">
							</td>
						</tr>
						<tr>
							<td style="color:#333; padding:0 0 15px;">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer libero tellus, aliquet maximus nisi vel. 
								Aenean sit amet augue eu sapien auctor viverra convallis nec velit. Integer in ante lobortis.
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</body>
		</html>`;
		
		return htmlString;
	}
}

export const accountInvitationService = new AccountInvitationService();

