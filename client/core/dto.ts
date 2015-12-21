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

export interface City extends BaseDto {
  code?: string;
  name?: string;
  state?: any;
}

export interface Industry extends BaseDto {
  code?: string;
  description?: string;
}

export interface AddressBookContactStatus extends BaseDto {
  code?: string;
  name?: string;
}

export interface AddressBookGroup extends BaseDto {
  name?: string;
  description?: string;
  city?: any;
  postcode?: any;
  streetName?: string;
  industry?: any;
  website?: string;
  bussinessNumber?: string;
  owner?: any;
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
  group?: any;
  status?: any;
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
  bussinessNumber?: string;
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
  grandDelete?: boolean;
  grandUpdate?: boolean;
  grandCreate?: boolean;
  grandRead?: boolean;
}

export interface SignUp extends BaseDto {
  organizationMember?: AccountOrganizationMember;
  organization?: AccountOrganization;
  user?: AccountUser;
}

export interface LogIn extends BaseDto {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  token?: any;
  init?: any;
}


