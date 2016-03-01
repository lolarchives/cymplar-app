import {LogItem, ModelOptions, AuthorizationResponse, LogItemType} from '../../client/core/dto';
import {LogItemModel, AddressBookContactModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {logItemTypeService} from '../log_item_type/log_item_type_service';

export class LogItemService extends BaseService<LogItem> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: 'type',
			copyAuthorizationData: ''
		};
		super(LogItemModel, defaultModelOptions);
	}
	
	createStatusChangeLog(data:LogItem, modelOptions: ModelOptions): Promise<LogItem> {
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
		const isLogItemOwner =  modelOptions.authorization.leadMember._id.toString() === data.createdBy.toString();
		if (isLogItemOwner) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document update');
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, 
		data?: LogItem): AuthorizationResponse {
		const isLogItemOwner =  modelOptions.authorization.leadMember._id.toString() === data.createdBy.toString();
		if (isLogItemOwner) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document remove');
	}
}

export const logItemService = new LogItemService();

