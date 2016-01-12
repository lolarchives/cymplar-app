import {Schema, Document, createConnection} from 'mongoose';
import * as bcrypt from 'bcrypt';

import {ObjectUtil} from '../../client/core/util';
import {DatabaseObjectUtil} from './db_util';

/* tslint:disable */
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */
const SALT = 10;

const db = createConnection(process.env.CYMPLAR_MONGO_URI);
db.on('error', () => console.error('Error connecting to Database:', process.env.CYMPLAR_MONGO_URI));
db.once('open', () => console.log('%s: Connected to MongoDb on %s', new Date(), process.env.CYMPLAR_MONGO_URI));


const schemas = {
  user: new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    locale: { type: String, required: true },
    picture: { type: String },
    countryCode: { type: String },
    timezone: { type: Number },
    gender: { type: String },
    verified: { type: Number },
    status: { type: Number, default: 1, required: true, index: true },
    lastLoginDate: { type: Date },
    createdBy: { type: ObjectId, ref: 'user' },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  company: new Schema({
    universalName: { type: String, unique: true, sparse: false, required: true },
    name: { type: String, required: true, index: true },
    websiteUrl: { type: String, unique: true, required: true },
    logo: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: ObjectId, ref: 'user', required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  contact: new Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    website: { type: String },
    industry: { type: ObjectId, ref: 'industry' },
    city: { type: ObjectId, ref: 'city' },
    // TODO createdBy must be required
    createdBy: { type: ObjectId, ref: 'user', required: false },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  country: new Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  city: new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: ObjectId, ref: 'country', required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  industry: new Schema({
    code: { type: String, required: true, index: true, unique: true },
    description: { type: String, required: true, unique: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  addressBookContact: new Schema({
    name: { type: String, required: true },
    description: { type: String },
    position: { type: String },
    contactNumber: { type: String, required: true },
    altContactNumber: { type: String },
    email: { type: String, required: true },
    website: { type: String },
    group: { type: ObjectId, ref: 'addressBookGroup', required: true, index: true },
    createdBy: { type: ObjectId, ref: 'accountUser' },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  addressBookGroup: new Schema({
    name: { type: String, required: true },
    description: { type: String },
    city: { type: ObjectId, ref: 'city', required: true },
    postcode: { type: String },
    streetName: { type: String },
    industry: { type: ObjectId, ref: 'industry', required: true },
    website: { type: String },
    bussinessNumber: { type: String },
    createdBy: { type: ObjectId, ref: 'accountUser', required: true, index: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  accountUser: new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, selectable: false },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    alias: { type: String },
    birthday: { type: Date }
  }),
  accountOrganization: new Schema({
    name: { type: String, required: true, index: true },
    domain: { type: String, required: true, unique: true },
    description: { type: String },
    city: { type: ObjectId, ref: 'city', index: true },
    postcode: { type: String },
    suburb: { type: String },
    industry: { type: ObjectId, ref: 'industry' },
    bussinessNumber: { type: String },
    team: { type: Number },
    web: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    plus: { type: String },
    dribble: { type: String },
    pinterest: { type: String },
    createdBy: { type: ObjectId, ref: 'accountUser' }
  }),
  accountOrganizationMember: new Schema({
    name: { type: String },
    email: { type: String, required: true },
    position: { type: String },
    contactNumber: { type: String, required: true },
    altContactNumber: { type: String },
    organization: { type: ObjectId, ref: 'accountOrganization', required: true },
    user: { type: ObjectId, ref: 'accountUser', required: true },
    role: { type: ObjectId, ref: 'accountMemberRole' },
    createdBy: { type: ObjectId, ref: 'accountUser' }
  }),
  accountMemberRole: new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    grantCreate: {type: Boolean, required: true },
    grantDelete: {type: Boolean, required: true }, 
    grantUpdate: {type: Boolean, required: true },
    grantRead: {type: Boolean, required: true },
    grantInvitation: {type: Boolean, required: true }
  }),
  salesLeadStatus: new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true }
  }), 
  salesLead: new Schema({
    name: { type: String, required: true, index: true, unique: true },
    status: { type: ObjectId, ref: 'salesLeadStatus' },
    contract: { type: String },
    amount: { type: Number },
    createdBy: { type: ObjectId, ref: 'accountOrganizationMember' },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  salesLeadContact: new Schema({
    lead : { type: ObjectId, ref: 'salesLead', required: true },
    contact: { type: ObjectId, ref: 'addressBookContact', required: true },
    createdBy: { type: ObjectId, ref: 'accountOrganizationMember' },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  salesLeadOrganization: new Schema({
    lead: { type: ObjectId, ref: 'salesLead', required: true },
    organization: { type: ObjectId, ref: 'accountOrganization', required: true },
    createdBy: { type: ObjectId, ref: 'accountOrganizationMember' },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  salesLeadMemberRole: new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    grantCreate: {type: Boolean, required: true },
    grantDelete: {type: Boolean, required: true }, 
    grantUpdate: {type: Boolean, required: true },
    grantRead: {type: Boolean, required: true },
    grantInvitation: {type: Boolean, required: true }
  }),
  salesLeadOrganizationMember: new Schema({
    role: { type: ObjectId, ref: 'salesLeadMemberRole' },
    member: { type: ObjectId, ref: 'accountOrganizationMember', required: true },
    leadOrganization: { type: ObjectId, ref: 'salesLeadOrganization', required: true },
    createdBy: { type: ObjectId, ref: 'accountOrganizationMember' },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  })
};


schemas.city.index({ code: 1, country: 1 }, { unique: true });
schemas.addressBookContact.index({ email: 1, group: 1 }, { unique: true });
schemas.addressBookGroup.index({ name: 1, createdBy: 1 }, { unique: true });
schemas.accountOrganizationMember.index({ email: 1, organization: 1 }, { unique: true });
schemas.accountMemberRole.index({ code: 1, name: 1 }, { unique: true });
schemas.salesLead.index({ name: 1, organization: 1 }, { unique: true });
schemas.salesLeadContact.index({ leadGroup: 1, contact: 1 }, { unique: true });
schemas.salesLeadOrganization.index({ organization: 1, lead: 1 }, { unique: true });
schemas.salesLeadOrganizationMember.index({ member: 1, leadOrganization: 1 }, { unique: true });


for (let prop in schemas) {
  const schem: Schema = schemas[prop];
  schem.pre('save', function(next: Function) {
    const obj: Document = this;
    const now = Date.now();
    if (obj.isNew) {
      obj['createdAt'] = now;
    }
    obj['updatedAt'] = now;
    next();
  });
}


export const UserModel = db.model('user', schemas.user);
export const CompanyModel = db.model('company', schemas.company);
export const ContactModel = db.model('contact', schemas.contact);
export const CountryModel = db.model('country', schemas.country);
export const CityModel = db.model('city', schemas.city);
export const IndustryModel = db.model('industry', schemas.industry);
export const AddressBookContactModel = db.model('addressBookContact', schemas.addressBookContact);
export const AddressBookGroupModel = db.model('addressBookGroup', schemas.addressBookGroup);
export const AccountUserModel = db.model('accountUser', schemas.accountUser);
export const AccountOrganizationModel = db.model('accountOrganization', schemas.accountOrganization);
export const AccountOrganizationMemberModel = db.model('accountOrganizationMember', schemas.accountOrganizationMember);
export const AccountMemberRoleModel = db.model('accountMemberRole', schemas.accountMemberRole);
export const SalesLeadStatusModel = db.model('salesLeadStatus', schemas.salesLeadStatus);
export const SalesLeadModel = db.model('salesLead', schemas.salesLead);
export const SalesLeadContactModel = db.model('salesLeadContact', schemas.salesLeadContact);
export const SalesLeadOrganizationModel = db.model('salesLeadOrganization', schemas.salesLeadOrganization);
export const SalesLeadOrganizationMemberModel = db.model('salesLeadOrganizationMember', schemas.salesLeadOrganizationMember);
export const SalesLeadMemberRoleModel = db.model('salesLeadMemberRole', schemas.salesLeadMemberRole);


schemas.addressBookGroup.pre('remove', function(next: Function) {
  const obj: Document = this;
    
  const queryAddressBook = {
    group: obj['_id'] 
  };
  
  AddressBookContactModel.find(queryAddressBook).remove((err: any, removedObjs: any) => {
    if (err) {
      next(err);
    }
    next();
  });
});

schemas.accountUser.pre('save', function (next: Function) {
  const obj = this;
  if (!obj.isModified('password')) {
    next();
  }
 
  bcrypt.hash(obj['password'], SALT, (err, hash) => {
      if (err) { 
        next(err);
      };
      
      obj['password'] = hash;
      next();
  });  
});
 
schemas.accountUser.pre('remove', function(next: Function) {
  const obj: Document = this;
  AccountOrganizationMemberModel.find({ user: obj['_id'] }).populate('role organization')
	.exec((err: any, removedObjs: any) => {
    if (err) {
        next(err);
    }
    DatabaseObjectUtil.removeArrayPromise(removedObjs)
    .then((results: Document[]) => {
      next();
    })
    .catch((err: Error) => {
      next(err);
    });
  });
});

schemas.accountUser.pre('remove', function(next: Function) {
  const obj: Document = this;
  AddressBookGroupModel.find({ createdBy: obj['_id'] })
	.exec((err: any, removedObjs: any) => {
    if (err) {
        next(err);
    }
    DatabaseObjectUtil.removeArrayPromise(removedObjs)
    .then((results: Document[]) => {
      next();
    })
    .catch((err: Error) => {
      next(err);
    });
  });
});

schemas.accountOrganizationMember.pre('save', function(next: Function) {
  const obj: Document = this;
  
  if (obj.isNew && ObjectUtil.isBlank(obj['createdBy'])) {    
    AccountMemberRoleModel.findOne({ code: 'OWNER' })
    .lean().exec((err: any, found: Document) => {
      if (err) {
        next(err);
      }
      
      if (ObjectUtil.isBlank(found['_id'])) {
        next("A role should be specified for this member ");
      }

      obj['role'] = found['_id'];
      next();
    }); 
  } else {
    next(); 
  }
});

schemas.accountOrganizationMember.pre('remove', function(next: Function) {
  const obj: Document = this;
  if (obj['role']['grantDelete'] && ObjectUtil.isPresent(obj['organization']['_id'])) {
  
  const query = {
      organization: obj['organization'], 
      'role.grantDelete': true,
      _id: { $ne: obj['_id'] } 
    };
    
    AccountOrganizationMemberModel.find(query).populate('role') // check whether there are more owners or not
    .exec((err: any, foundMembers: any) => {
      if (err) {
        next(err);
      }
      if (foundMembers.length < 1) {
        obj['organization'].remove((err: Error) => {
            if (err) {
              next(err);
            }
            next();
        });
      } else {
        next();  
      }
    });
  } else {
    next();
  } 
});

schemas.accountOrganization.pre('remove', function(next: Function) {
  const obj = this;
  AccountOrganizationMemberModel.find({ organization: obj._id })
  .remove((err: any, removedObjs: any) => {
    if (err) {
        next(err);
    }
    next();
  }); 
});

