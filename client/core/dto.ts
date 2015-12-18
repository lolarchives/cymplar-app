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

export interface SignUpDetails extends BaseDto {
  organizationName: string;
  username: string;
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
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  plus?: string;
  dribble?: string;
  pinterest?: string;
}

export interface Notification {
  type: string;
  data?: any;
}

