import {OrgChatLog, ModelOptions, AuthorizationResponse} from '../../client/core/dto';
import {OrgChatLogModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class OrgChatLogService extends BaseService<OrgChatLog> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: [
				{
					path: 'type'
				},
				{
					path: 'member',
					select: 'user role -_id',
					populate: [ 
						{
							path: 'user',
							select: 'firstName lastName middleName -_id',
							model: 'accountUser'	
						},
						{
							path: 'role',
							model: 'accountMemberRole'
						}
					]	
				}
			],
			copyAuthorizationData: ''
		};
		super(OrgChatLogModel, defaultModelOptions);
	}
	
	findLimited(data: OrgChatLog, newOptions: ModelOptions = {}): Promise<OrgChatLog[]> {
		return new Promise<OrgChatLog[]>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);
			const authorizationResponse = this.isSearchAuthorized(txModelOptions);
			if (!authorizationResponse.isAuthorized) {
				return reject(new Error(authorizationResponse.errorMessage));
			}
			this.addAuthorizationDataPreSearch(txModelOptions);	
			this.transactionModelOptionsAddData(data, txModelOptions);	
			const search = this.obtainSearchExpression(data, txModelOptions);
			this.Model.find(search, txModelOptions.projection,
			{ sort: '-createdAt', limit: 20, lean: true }).populate(txModelOptions.population)
			.exec((err, foundObjs) => {
				if (err) {
					return reject(err);
				}
				resolve(foundObjs);
			});
		});
	}
	
	find(data: OrgChatLog, newOptions: ModelOptions = {}): Promise<OrgChatLog[]> {
		return new Promise<OrgChatLog[]>((resolve: Function, reject: Function) => {
			this.findLimited(data, newOptions)
			.then((orgChatLogs: OrgChatLog[]) => {
				if (orgChatLogs.length === 1) {
					if (ObjectUtil.isPresent(orgChatLogs[0].createdAt)) {
						newOptions.additionalData = {
							createdAt: { $lt: orgChatLogs[0].createdAt }	
						};
					}
					return this.findLimited({}, newOptions);
				}  
				resolve(orgChatLogs);		
					
			})
			.then((orgChatLogs: OrgChatLog[]) => {
				resolve(orgChatLogs);			
			})
			.catch((err) => reject(err));
		});
	}
	
	protected isCreateAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		const authorizedRoles = ['OWNER', 'DIRECTOR', 'MANAGER', 'CONSULTANT'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
	protected isUpdateAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		const authorizedRoles = ['OWNER', 'DIRECTOR', 'MANAGER', 'CONSULTANT'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
	protected isRemoveAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		const authorizedRoles = ['OWNER', 'DIRECTOR', 'MANAGER', 'CONSULTANT'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
	/* tslint:disable */ // In this switches the default is not needed
	protected addAuthorizationDataInCreate(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'organization':
				modelOptions.additionalData['organizaton'] = modelOptions.authorization.organizationMember.organization;
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.organizationMember._id;
				break;
		}
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'organization':
				modelOptions.additionalData['organizaton'] = modelOptions.authorization.organizationMember.organization;
				break;
		}
	}
	/* tslint:enable */
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {
			
			const authorizationResponse = super.authorizationEntity(modelOptions);
			
			if (modelOptions.onlyValidateParentAuthorization || !authorizationResponse.isAuthorized) {
				return authorizationResponse;
			}
			
			if (!this.existsOrganizationMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse('Organization: Unauthorized member');
			}
			
			if (roles.length > 0 && !this.isAuthorizedInOrg(modelOptions.authorization, roles)) {
				return this.createAuthorizationResponse('Organization: Unauthorized member role');
			}
			
		}

		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, 
		data?: OrgChatLog): AuthorizationResponse {
		const isOrgChatLogOwner =  modelOptions.authorization.organizationMember._id.toString() === 
			ObjectUtil.getStringUnionProperty(data.createdBy).toString();
		if (isOrgChatLogOwner) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document update');
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, 
		data?: OrgChatLog): AuthorizationResponse {
			
		console.log(data);
		console.log( modelOptions.authorization.leadMember);
		const isOrgChatLogOwner =  modelOptions.authorization.organizationMember._id.toString() === 
			ObjectUtil.getStringUnionProperty(data.createdBy).toString();
		if (isOrgChatLogOwner) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document remove');
	}
}

export const orgChatLogService = new OrgChatLogService();

