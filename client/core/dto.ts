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