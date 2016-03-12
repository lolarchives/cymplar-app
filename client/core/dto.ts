export const BACK_END_ROUTE = '/api';

export interface BaseDto {
  _id?: any;
  createdBy?: any;
  createdAt?: number;
  updatedAt?: number;
}

export interface Contact extends BaseDto {
  email?: string;
  name?: string;
  website?: string;
  industry?: any;
  city?: string | City;
}

export interface Notification {
  type: string;
  data?: any;
}

export interface Country extends BaseDto {
  code?: string;
  name?: string;
}

export interface State extends BaseDto {
  code?: string;
  name?: string;
  country?: string | Country;
}

export interface City extends BaseDto {
  code?: string;
  name?: string;
  state?: string | State;
}

export interface Industry extends BaseDto {
  code?: string;
  description?: string;
}

export interface AddressBookGroup extends BaseDto {
  name?: string;
  description?: string;
  city?: string | City;
  postcode?: string;
  suburb?: string;
  streetName?: string;
  industry?: string | Industry;
  website?: string;
  businessNumber?: string;
  contacts?: any;
}

export interface AddressBookContact extends BaseDto {
  name?: string;
  description?: string;
  position?: string;
  contactNumber?: string;
  altContactNumber?: string;
  email?: string;
  website?: string;
  alternativeAddress?: string;
  group?: string | AddressBookGroup;
}

export interface AccountUser extends BaseDto {
  username?: string;
  password?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  alias?: string;
  birthday?: Date;
}

export interface AccountOrganization extends BaseDto {
  name?: string;
  domain?: string;
  description?: string;
  city?: string | City;
  postcode?: number;
  suburb?: string;
  industry?: string | Industry;
  businessNumber?: string;
  team?: number;
  web?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  plus?: string;
  dribble?: string;
  pinterest?: string;
  members?: any;
  salesLeads?: any;
}

export interface SignUpDetails {
		organizationName: string;
		username: string;
    firstName: string;
    middleName: string;
    lastName: string;
		email: string;
		password: string;
		passwordConfirm: string;
		country: string;
		city: string;
		suburb?: string;
		postcode?: number;
		industryType: string;
		description: string;
		team?: number;
    web?: string;
		facebook?: string;
		linkedin?: string;
		twitter?: string;
		plus?: string;
		dribble?: string;
		pinterest?: string;
	}

export interface AccountOrganizationMember extends BaseDto {
  name?: string;
  email?: string;
  position?: string;
  contactNumber?: string;
  altContactNumber?: string;
  organization?: string | AccountOrganization;
  user?: string | AccountUser;
  role?: string | AccountMemberRole;
}

export interface AccountMemberRole extends BaseDto {
  code?: string;
  name?: string;
  description?: string;
  grantDelete?: boolean;
  grantUpdate?: boolean;
  grantCreate?: boolean;
  grantRead?: boolean;
  grantInvitation?: boolean;
}

export interface AccountInvitation extends BaseDto {
  email?: string;
  code?: string;
  organization?: string | AccountOrganization;
  role?: string | AccountMemberRole;
  redeemedBy?: string | AccountOrganizationMember;
  expiresAt?: number;
} 

export interface SignUp extends BaseDto {
  organizationMember?: AccountOrganizationMember;
  organization?: AccountOrganization;
  user?: AccountUser;
}

export interface LogIn extends BaseDto {
  username: string;
  password: string;
  organization: string;
}

export interface AuthenticationResponse {
  token?: any;
  init?: any;
}

export interface AuthorizationData {
  user?: AccountUser;
  organizationMember?: AccountOrganizationMember;
  leadMember?: SalesLeadOrganizationMember;
  invitation?: string | AccountInvitation;
}

export interface ModelOptions {
  additionalData?: any;
  complexSearch?: any;
  population?: any;
  projection?: any;
  regularExpresion?: boolean;
  distinct?: any;
  authorization?: AuthorizationData;
  requireAuthorization?: boolean;
  copyAuthorizationData?: string;
  onlyValidateParentAuthorization?: boolean;
  validatePostSearchAuthData?: boolean;
}

export interface AuthorizationResponse {
  isAuthorized: boolean;
  errorMessage?: string;
}

export interface SalesLead extends BaseDto {
  name?: string;
  status?: string | SalesLeadStatus;
  contract?: string;
  amount?: number;
  contacts?: any[];
  members?: any;
}

export interface SalesLeadStatus extends BaseDto {
  code?: string;
  name?: string;
}

export interface SalesLeadContact extends BaseDto {
  lead?: string | SalesLead;
  contact?: string | AddressBookContact;
}

export interface SalesLeadMemberRole extends BaseDto {
  code?: string;
  name?: string;
  description?: string;
  grantDelete?: boolean;
  grantUpdate?: boolean;
  grantCreate?: boolean;
  grantRead?: boolean;
  grantInvitation?: boolean;
}

export interface SalesLeadOrganizationMember extends BaseDto {
  lead?: string | SalesLead;
  member?: string | AccountOrganizationMember;
  role?: string | SalesLeadMemberRole;
}

export interface Dashboard extends BaseDto {
  organization?: any;
  addressBook?: any;
}

export interface LogItemType extends BaseDto {
  code?: string;
  name?: string;
}

export interface LogItem extends BaseDto {
  lead?: string | SalesLead;
  type?: string | LogItemType;
  content?: string;
  dateTime?: number;
  location?: string;
  edited?: boolean;
}

export interface SocketNotification extends BaseDto {
  from?: string | AccountUser;
  organization?: string | AccountOrganization;
  lead?: string | SalesLead;
  member?: string | AccountOrganizationMember;
  leadMember?: string | SalesLeadOrganizationMember;
  message?: string;
  parentsData?: any;
  data?: any;
}
