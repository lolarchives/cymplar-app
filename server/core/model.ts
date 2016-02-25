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

const subDocumentSchemas = {
  leadStatus: new Schema({
    label: { type: String, required: true },
    value: { type: String, required: true }
  }, { _id : false })
};

const schemas = {
  user: new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    locale: { type: String },
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
  state: new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: ObjectId, ref: 'country', required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  city: new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    state: { type: ObjectId, ref: 'state', required: true },
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
    alternativeAddress: { type: String },
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
    suburb: { type: String },
    streetName: { type: String },
    industry: { type: ObjectId, ref: 'industry', required: true },
    website: { type: String },
    businessNumber: { type: String },
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
    locale: { type: String },
    picture: { type: String },
    alias: { type: String },
    birthday: { type: Date },
    timezone: { type: Number },
    gender: { type: String },
    verified: { type: Number },
    status: { type: Number, default: 1, required: true, index: true },
    lastLoginDate: { type: Date }
  }),
  accountOrganization: new Schema({
    name: { type: String, required: true, index: true },
    domain: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    city: { type: ObjectId, ref: 'city', index: true },
    postcode: { type: String },
    suburb: { type: String },
    streetName: { type: String },
    industry: { type: ObjectId, ref: 'industry' },
    businessNumber: { type: String },
    team: { type: Number },
    web: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    plus: { type: String },
    dribble: { type: String },
    pinterest: { type: String },
    createdBy: { type: ObjectId, ref: 'accountUser' },
    projectDefaultStatuses: [subDocumentSchemas.leadStatus]
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
    leadStatuses: [subDocumentSchemas.leadStatus],
    currentStatus: subDocumentSchemas.leadStatus,
    createdBy: { type: ObjectId, ref: 'accountUser' },
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
  salesLeadMemberRole: new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    grantCreate: { type: Boolean, required: true },
    grantDelete: { type: Boolean, required: true }, 
    grantUpdate: { type: Boolean, required: true },
    grantRead: { type: Boolean, required: true },
    grantInvitation: { type: Boolean, required: true }
  }),
  salesLeadOrganizationMember: new Schema({
    lead: { type: ObjectId, ref: 'salesLead', required: true },
    role: { type: ObjectId, ref: 'salesLeadMemberRole' },
    member: { type: ObjectId, ref: 'accountOrganizationMember', required: true },
    createdBy: { type: ObjectId, ref: 'accountOrganizationMember' },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  })
};


schemas.city.index({ code: 1, state: 1 }, { unique: true });
schemas.state.index({ code: 1, country: 1 }, { unique: true });
schemas.addressBookContact.index({ email: 1, group: 1 }, { unique: true });
schemas.addressBookGroup.index({ name: 1, createdBy: 1 }, { unique: true });
schemas.accountOrganizationMember.index({ organization: 1, user: 1 }, { unique: true });
schemas.accountMemberRole.index({ code: 1, name: 1 }, { unique: true });
schemas.salesLead.index({ name: 1, organization: 1 }, { unique: true });
schemas.salesLeadContact.index({ lead: 1, contact: 1 }, { unique: true });
schemas.salesLeadOrganizationMember.index({ member: 1, lead: 1 }, { unique: true });


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
export const StateModel = db.model('state', schemas.state);
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
export const SalesLeadOrganizationMemberModel = db.model('salesLeadOrganizationMember', schemas.salesLeadOrganizationMember);
export const SalesLeadMemberRoleModel = db.model('salesLeadMemberRole', schemas.salesLeadMemberRole);


schemas.addressBookGroup.post('remove', function() {
  const obj: Document = this;
  AddressBookContactModel.find({group: obj['_id'] }).distinct('_id')
  .exec((err: Error, foundContactsPerGroup: string[]) => {
    if (err) {
      return;
    } 
    SalesLeadContactModel.find({ contact: { $in: foundContactsPerGroup }}).distinct('contact')
    .exec((err: Error, foundObjs: string[]) => {
      if (err) {
        return;
      }
      
      AddressBookContactModel.remove({ group: obj['_id'], _id: { $nin: foundObjs }}, (err: any) => {
       if (err) {
          return;
        } 
       return;
      });
    });	
  });
});

schemas.addressBookContact.pre('remove', function(next: Function) {
  const obj: Document = this;
  SalesLeadContactModel.find({ contact: obj['_id']})
  .exec((err: Error, foundObjs: Document[]) => {
     if (err) {
        next(err);
        return;
     } 	
     if (ObjectUtil.isPresent(foundObjs) && foundObjs.length > 0) {
       next(new Error('This contact is related to a lead, it cannot be erased'));
       return;
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
        return;
      };
      
      obj['password'] = hash;
      next();
  });  
});
 
schemas.accountUser.pre('remove', function(next: Function) {
  const obj: Document = this;
  AccountOrganizationMemberModel.find({ user: obj['_id'] }).populate('role organization')
	.exec((err: Error, removedObjs: Document[]) => {
    if (err) {
        next(err);
        return;
    }
    DatabaseObjectUtil.removeArrayPromise(removedObjs)
    .then((results: Document[]) => {
      next();
    })
    .catch((err: Error) => {
      next(err);
      return;
    });
  });
});

schemas.accountUser.post('remove', function() {
  const obj: Document = this;
  AddressBookGroupModel.find({ createdBy: obj['_id'] })
  .exec((err: Error, removedObjs: Document[]) => {
    if (err) {
        return;
    }
    DatabaseObjectUtil.removeArrayPromise(removedObjs)
    .then((results: Document[]) => {
      return;
    })
    .catch((err: Error) => {
      return;
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
        return;
      }
      
      if (ObjectUtil.isBlank(found['_id'])) {
        next('A role should be specified for this member ');
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
  const queryOwnership = {
    member: obj['_id'] 
  };
  SalesLeadOrganizationMemberModel.find(queryOwnership)
  .populate('role lead').exec((err: Error, foundObjs: Document[]) => {
    if (err) {
        next(err);
        return;
      }
    DatabaseObjectUtil.removeArrayPromise(foundObjs)
    .then((removedObj: Document[]) => {
      next();
    })
    .catch((err: any) => {
      next(err);
      return;
    }); 
  });
});

schemas.accountOrganizationMember.post('remove', function() {
  const obj: Document = this;
  const isUserTransaction = ObjectUtil.isPresent(obj['role']['code']);
  const isOwner = obj['role']['code'] === 'OWNER';
  if ( isUserTransaction && isOwner) {
    const orgQuery = {
      organization: obj['organization'],
      _id: { $ne: obj['_id'] } 
    };
    AccountOrganizationMemberModel.find(orgQuery) // check whether there are more owners or not
    .populate('role').exec((err: any, foundMembers: any) => {
      if (err) {
        return;
      }
      const membersOnCharge: string[] = [];
      for (let i = 0; i < foundMembers.length; i++ ) {
        if (foundMembers[i]['role']['code'] === 'OWNER') {
          membersOnCharge.push(foundMembers[i]['_id']);
        } 
      }
     if (membersOnCharge.length < 1) {
        obj['organization'].remove((err: Error) => {
          if (err) {
            return;
          }
        });
      } 
    }); 
  } else {
    return;
  } 
});

schemas.accountOrganization.pre('remove', function(next: Function) {
  const obj = this;
  AccountOrganizationMemberModel.find({ organization: obj['_id'] })
  .exec((err: Error, foundObjs: Document[]) => {
    if (err) {
      next(err);
      return;
    }
    DatabaseObjectUtil.removeArrayPromise(foundObjs)
    .then((removedObj: Document[]) => {
      next();
    })
    .catch((err: any) => {
        next(err);
        return;
    });	
  }); 	
});

schemas.salesLeadContact.post('remove', function() {
  const obj: Document = this;
  if (ObjectUtil.isPresent(obj['contact']['_id']) && ObjectUtil.isBlank(obj['contact']['group'])) { 
    const contactQuery = {
      contact: obj['contact'],
      _id: { $ne: obj['_id'] } 
    };
       
    SalesLeadContactModel.find(contactQuery) // check whether this contact belongs to more leads
    .exec((err: Error, foundObjs: Document[]) => {
      if (err) {
        return;
      }
      if (foundObjs.length < 1) {
        obj['contact'].remove((err: Error) => {
            if (err) {
              return;
            }
            return;
        });
      } 
      
      return;
    });  
  } 
  
  return;
});

schemas.salesLeadOrganizationMember.post('remove', function() {
  const obj: Document = this;
  SalesLeadMemberRoleModel.find({ code: 'OWNER' }).distinct('_id')
  .exec((err: Error, roles: string[]) => {
    if (err) {
      return;
    }
 
    const orgQuery = {
      lead: obj['lead'],
      _id: { $ne: obj['_id'] },
      role: { $in: roles}
    };
    
    SalesLeadOrganizationMemberModel.find(orgQuery) // check whether there are more members or not
    .exec((err: any, foundMembers: any) => {
      if (err) {
        return;
      }
      
      if (foundMembers.length < 1) {
        obj['lead'].remove((err: Error) => {
            if (err) {
              return;
            }
          return;
        });
      } 
    });
  });
});


schemas.salesLead.pre('remove', function(next: Function) {
  const obj: Document = this;
  const contactPopulation = {	 
      path: 'contact',
      populate: {
        path: 'group',
        model: 'addressBookGroup' 
      } 
    };
    
  SalesLeadContactModel.find({lead: obj['_id']}).populate(contactPopulation).populate('lead')
  .exec((err: Error, foundObjs: Document[]) => {
    if (err) {
      next(err);
      return;
    }
    DatabaseObjectUtil.removeArrayPromise(foundObjs)
    .then((removedObj: Document[]) => {
      SalesLeadOrganizationMemberModel.find({lead: obj['_id']})
      .remove((err: Error, foundObjs: Document[]) => {
        if (err) {
          next(err);
          return;
        }
       next();
      });
    })
    .catch((err: any) => {
		  next(err);
      return;
		});	
  });
});


