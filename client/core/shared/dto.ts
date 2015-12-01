import {BaseDto} from '../../core/dto';


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

export interface ContactState extends BaseDto {

  code?: string;
  name?: string;

}