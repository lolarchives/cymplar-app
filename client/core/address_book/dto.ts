import {BaseDto} from '../../core/dto';


export interface Group extends BaseDto {

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

export interface Contact extends BaseDto {

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

