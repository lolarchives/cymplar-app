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
  city?: any;
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
  country?: any;
}

export interface City extends BaseDto {
  code?: string;
  name?: string;
  state?: any;
}

export interface Industry extends BaseDto {
  code?: string;
  description?: string;
}

export interface AddressBookGroup extends BaseDto {
  name?: string;
  description?: string;
  city?: any;
  postcode?: any;
  suburb?: string;
  streetName?: string;
  industry?: any;
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
  group?: any;
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
  city?: any;
  postcode?: any;
  suburb?: string;
  industry?: any;
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
  organization?: any;
  user?: any;
  role?: any;
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
  status?: any;
  contract?: string;
  amount?: number;
  contact?: any;
  members?: any;
}

export interface SalesLeadStatus extends BaseDto {
  code?: string;
  name?: string;
}

export interface SalesLeadContact extends BaseDto {
  lead?: any;
  contact?: any;
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
  lead?: any;
  member?: any;
  role?: any;
}

export interface Dashboard extends BaseDto {
  organization?: any;
  addressBook?: any;
}
