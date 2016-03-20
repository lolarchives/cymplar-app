import {LogItem, ModelOptions, AuthorizationResponse, LogItemType} from '../../client/core/dto';
import {LogItemModel, AddressBookContactModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {logItemTypeService} from '../log_item_type/log_item_type_service';
import {ObjectUtil} from '../../client/core/util';

export class LogItemService extends BaseService<LogItem> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: [
				{
					path: 'type'
				},
				{
					path: 'createdBy',
					select: 'member role',
					populate: [
						{
							path: 'member',
							select: 'user role -_id',
							model: 'accountOrganizationMember',
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
						},
						{
							path: 'role',
							model: 'salesLeadMemberRole'
						}
					]	
				}
			],
			copyAuthorizationData: ''
		};
		super(LogItemModel, defaultModelOptions);
	}
	
	createStatusChangeLog(data: LogItem, modelOptions: ModelOptions): Promise<LogItem> {
		return new Promise<LogItem>((resolve: Function, reject: Function) => {
			const typeModelOptions: ModelOptions = {
				authorization: modelOptions.authorization,
				requireAuthorization: false,
				copyAuthorizationData: ''
			};
			logItemTypeService.findOne({ code: 'STCH'}, typeModelOptions)
			.then((logItemType: LogItemType) => {
				data.type = logItemType;
				return this.createOne(data, modelOptions);
			})
			.then((logItem: LogItem) => {
				resolve(logItem);
			})
			.catch((err) => reject(err));
		});	
	}
	
	findLimited(data: LogItem, newOptions: ModelOptions = {}): Promise<LogItem[]> {
		return new Promise<LogItem[]>((resolve: Function, reject: Function) => {
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
	
	find(data: LogItem, newOptions: ModelOptions = {}): Promise<LogItem[]> {
		return new Promise<LogItem[]>((resolve: Function, reject: Function) => {
			this.findLimited(data, newOptions)
			.then((logItems: LogItem[]) => {
				if (logItems.length === 1) {
					if (ObjectUtil.isPresent(logItems[0].createdAt)) {
						newOptions.additionalData = {
							createdAt: { $lt: logItems[0].createdAt }	
						};
					}
					return this.findLimited({}, newOptions);
				}  
				resolve(logItems);		
					
			})
			.then((logItems: LogItem[]) => {
				resolve(logItems);			
			})
			.catch((err) => reject(err));
		});
	}
	
	protected isCreateAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		const authorizedRoles = ['OWNER', 'CONTRIBUTOR'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
	protected isUpdateAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		const authorizedRoles = ['OWNER', 'CONTRIBUTOR'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
	protected isRemoveAuthorized(modelOptions: ModelOptions): AuthorizationResponse {
		const authorizedRoles = ['OWNER', 'CONTRIBUTOR'];
		return this.authorizationEntity(modelOptions, authorizedRoles);
	}
	
	/* tslint:disable */ // In this switches the default is not needed
	protected addAuthorizationDataInCreate(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'lead':
				modelOptions.additionalData['lead'] = modelOptions.authorization.leadMember.lead;
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.leadMember._id;
				break;
		}
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'lead':
				modelOptions.additionalData['lead'] = modelOptions.authorization.leadMember.lead;
				break;
		}
	}
	/* tslint:enable */
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {
			
			if (!this.existsOrganizationMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse('Sales lead: Unauthorized organization member');
			}
			
			if (modelOptions.onlyValidateParentAuthorization) {
				return this.createAuthorizationResponse();
			}
			
			if (!this.existsLeadMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse('Sales lead: Unauthorized lead member');
			}
			
			if (roles.length > 0 && !this.isAuthorizedInLead(modelOptions.authorization, roles)) {
				return this.createAuthorizationResponse('Sales lead member: Unauthorized lead member role');
			}
		}

		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, 
		data?: LogItem): AuthorizationResponse {
		const isLogItemOwner =  modelOptions.authorization.leadMember._id.toString() === 
			ObjectUtil.getStringUnionProperty(data.createdBy).toString();
		if (isLogItemOwner) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document update');
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, 
		data?: LogItem): AuthorizationResponse {
			
		console.log(data);
		console.log( modelOptions.authorization.leadMember);
		const isLogItemOwner =  modelOptions.authorization.leadMember._id.toString() === 
			ObjectUtil.getStringUnionProperty(data.createdBy).toString();
		if (isLogItemOwner) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document remove');
	}
}

export const logItemService = new LogItemService();

