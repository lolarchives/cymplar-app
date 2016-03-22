import {OrgChannel, ModelOptions, AuthorizationResponse} from '../../client/core/dto';
import {OrgChannelModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class OrgChannelService extends BaseService<OrgChannel> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: [
				{
					path: 'limitedMembers',
					select: 'user role -_id',
					populate: [ 
						{
							path: 'user',
							select: 'firstName lastName middleName -_id',
							model: 'accountUser'	
						}
					]	
				}
			],
			copyAuthorizationData: ''
		};
		super(OrgChannelModel, defaultModelOptions);
	}
	
	findLimited(data: OrgChannel, newOptions: ModelOptions = {}): Promise<OrgChannel[]> {
		return new Promise<OrgChannel[]>((resolve: Function, reject: Function) => {
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
	
	find(data: OrgChannel, newOptions: ModelOptions = {}): Promise<OrgChannel[]> {
		return new Promise<OrgChannel[]>((resolve: Function, reject: Function) => {
			this.findLimited(data, newOptions)
			.then((orgChannels: OrgChannel[]) => {
				if (orgChannels.length === 1) {
					if (ObjectUtil.isPresent(orgChannels[0].createdAt)) {
						newOptions.additionalData = {
							createdAt: { $lt: orgChannels[0].createdAt }	
						};
					}
					return this.findLimited({}, newOptions);
				}  
				resolve(orgChannels);		
					
			})
			.then((orgChannels: OrgChannel[]) => {
				resolve(orgChannels);			
			})
			.catch((err) => reject(err));
		});
	}
	
	loadJustAdded(data: OrgChannel, newOptions: ModelOptions = {}): Promise<OrgChannel[]> {
		return new Promise<OrgChannel[]>((resolve: Function, reject: Function) => {
		
			if (ObjectUtil.isBlank(data.findAdded)) {
				return reject('A list of recently added channels should be sent');	
			} 
			
			this.find({_id: { $in: data.findAdded } })
			.then((orgChannels: OrgChannel[]) => {
				resolve(orgChannels);			
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
				modelOptions.additionalData['organization'] = modelOptions.authorization.organizationMember.organization;
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.organizationMember._id;
				break;
		}
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'organization':
				modelOptions.additionalData['organization'] = 
					ObjectUtil.getStringUnionProperty(modelOptions.authorization.organizationMember.organization);
				modelOptions.additionalData['$or'] = [{ limitedMembers: { $size: 0 }}, 
					{ limitedMembers: modelOptions.authorization.organizationMember._id }];
				modelOptions.population = [
					{
						path: 'limitedMembers',
						select: 'user role -_id',
						match:  { _id: { $ne: modelOptions.authorization.organizationMember._id }},
						populate: [
							{
								path: 'user',
								select: 'firstName lastName middleName -_id',
								model: 'accountUser'
							}
						]
					}
				];
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

}

export const orgChannelService = new OrgChannelService();

