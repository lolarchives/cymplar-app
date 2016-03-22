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
    id: { type: Number, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    selected: { type: Boolean, default: false }
  }, { _id: false })
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
    contactNumber: { type: String },
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
  accountInvitation: new Schema({
    email: { type: String, required: true },
    code: { type: String, unique: true },
    role: { type: ObjectId, ref: 'accountMemberRole', required: true },
    organization: { type: ObjectId, ref: 'accountOrganization', required: true },
    createdBy: { type: ObjectId, ref: 'accountOrganizationMember', required: true },
    redeemedBy: { type: ObjectId, ref: 'accountUser'},
    createdAt: { type: Number },
    expiresAt: { type: Number },
    updatedAt: { type: Number }
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
    currentStatus: { type: Number, required: true, default: 1 },
    statusTemplateOrganization: { type: ObjectId, ref: 'accountOrganization' },
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
  }),
  logItemType: new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true }
  }), 
  logItem: new Schema({
    lead: { type: ObjectId, ref: 'salesLead', required: true },
    type: { type: ObjectId, ref: 'logItemType', required: true },
    content: { type: String, required: true },
    dateTime: { type: Number },
    location: { type: String },
    edited: { type: Boolean },
    createdBy: { type: ObjectId, ref: 'salesLeadOrganizationMember', required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  leadChatLog: new Schema({
    lead: { type: ObjectId, ref: 'salesLead', required: true },
    message: { type: String, required: true },
    edited: { type: Boolean },
    createdBy: { type: ObjectId, ref: 'salesLeadOrganizationMember', required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  }),
  orgChannel: new Schema({
    name: { type: String },
    organization: { type: ObjectId, ref: 'accountOrganization', required: true },
    limitedMembers: [{ type: ObjectId, ref: 'accountOrganizationMember'}] // if its empty or null, it's a general channel
  }),
  orgChatLog: new Schema({
    room: { type: ObjectId, ref: 'orgChannel', required: true },
    message: { type: String, required: true },
    edited: { type: Boolean },
    createdBy: { type: ObjectId, ref: 'accountOrganizationMember', required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  })
};


schemas.city.index({ code: 1, state: 1 }, { unique: true });
schemas.state.index({ code: 1, country: 1 }, { unique: true });
schemas.addressBookContact.index({ email: 1, group: 1 }, { unique: true });
schemas.addressBookGroup.index({ name: 1, createdBy: 1 }, { unique: true });
schemas.accountOrganizationMember.index({ organization: 1, user: 1 }, { unique: true });
schemas.accountInvitation.index({ email: 1, organization: 1 }, { unique: true });
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
    if (!obj.isNew) {
      obj['edited'] = true;
    }
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
export const AccountInvitationModel = db.model('accountInvitation', schemas.accountInvitation);
export const SalesLeadStatusModel = db.model('salesLeadStatus', schemas.salesLeadStatus);
export const SalesLeadModel = db.model('salesLead', schemas.salesLead);
export const SalesLeadContactModel = db.model('salesLeadContact', schemas.salesLeadContact);
export const SalesLeadOrganizationMemberModel = db.model('salesLeadOrganizationMember', schemas.salesLeadOrganizationMember);
export const SalesLeadMemberRoleModel = db.model('salesLeadMemberRole', schemas.salesLeadMemberRole);
export const LogItemTypeModel = db.model('logItemType', schemas.logItemType);
export const LogItemModel = db.model('logItem', schemas.logItem);
export const LeadStatusModel = db.model('leadStatus', subDocumentSchemas.leadStatus);
export const LeadChatLogModel = db.model('leadChatLog', schemas.leadChatLog);
export const OrgChatLogModel = db.model('orgChatLog', schemas.orgChatLog);
export const OrgChannelModel = db.model('orgChannel', schemas.orgChannel);


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
      });
    });	
  });
});

schemas.addressBookContact.pre('remove', function(next: Function) {
  const obj: Document = this;
  SalesLeadContactModel.find({ contact: obj['_id']})
  .exec((err: Error, foundObjs: Document[]) => {
     if (err) {
        return next(err);
     } 	
     if (ObjectUtil.isPresent(foundObjs) && foundObjs.length > 0) {
       return next(new Error('This contact is related to a lead, it cannot be erased'));
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
        return next(err);
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
        return next(err);
    }
    DatabaseObjectUtil.removeArrayPromise(removedObjs)
    .then((results: Document[]) => {
      next();
    })
    .catch((err: Error) => {
      return next(err);
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

schemas.accountOrganization.pre('save', function (next: Function) {
  const obj = this;
  if (obj.isNew) {
      obj['projectDefaultStatuses'] = [];
      obj['projectDefaultStatuses'].push({ 'id': 0, 'label': 'Lost/Inactive', 'value': '0', 'selected': false}); 
      obj['projectDefaultStatuses'].push({ 'id': 1, 'label': 'Opportunity', 'value': '20', 'selected': true}); 
      obj['projectDefaultStatuses'].push({ 'id': 2, 'label': 'Cold', 'value': '40', 'selected': false}); 
      obj['projectDefaultStatuses'].push({ 'id': 3, 'label': 'Warm', 'value': '60', 'selected': false}); 
      obj['projectDefaultStatuses'].push({ 'id': 4, 'label': 'Hot', 'value': '80', 'selected': false});
      obj['projectDefaultStatuses'].push({ 'id': 5, 'label': 'Won', 'value': '100', 'selected': false});
  }
  next();  
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
  }
});

schemas.accountOrganization.pre('remove', function(next: Function) {
  const obj = this;
  AccountOrganizationMemberModel.find({ organization: obj['_id'] })
  .exec((err: Error, foundObjs: Document[]) => {
    if (err) {
      return next(err);
    }
    DatabaseObjectUtil.removeArrayPromise(foundObjs)
    .then((removedObj: Document[]) => {
      next();
    })
    .catch((err: any) => {
        next(err);
    });	
  }); 	
});

schemas.accountInvitation.pre('save', function(next: Function) {
  const obj = this;
  
  if (obj.isNew) {
    // Assign the default invitation code
    const NUMBER_REQUIRED_DIGITS = 5;
    const BASE = 36;
    const code = ('00000' + (Date.now() * Math.pow(BASE, NUMBER_REQUIRED_DIGITS) << 0).toString(BASE)).slice(-NUMBER_REQUIRED_DIGITS);
    obj['code'] = code;
    
    // Assign the expiration date
    const expirationDays = 3;
    const MILISECONDS_PER_DAY = 86400000;
    obj['expiresAt'] = Date.now() + (expirationDays * MILISECONDS_PER_DAY);
  }
  
  next(); 	
});


schemas.salesLeadContact.post('remove', function() {
  const obj: Document = this;
  if (ObjectUtil.isPresent(obj['contact']) && ObjectUtil.isPresent(obj['contact']['_id']) && ObjectUtil.isBlank(obj['contact']['group'])) { 
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
        });
      } 
    });  
  } 
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
        });
      } 
    });
  });
});


schemas.salesLead.pre('save', function(next: Function) {
  const obj: Document = this;
  if (obj.isNew && ObjectUtil.isBlank(obj['status'])) {    
    SalesLeadStatusModel.findOne({ code: 'OPP' })
    .lean().exec((err: any, found: Document) => {
      if (err) {
        next(err);
        return;
      }
      
      if (ObjectUtil.isBlank(found['_id'])) {
        next(new Error('A status should be specified for this lead'));
        return;
      }

      obj['status'] = found['_id'];
      next();
    }); 
  } else {
    next(); 
  }
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
    
  SalesLeadContactModel.find({lead: obj['_id']}).populate(contactPopulation)
  .exec((err: Error, foundObjs: Document[]) => {
    if (err) {
      return next(err);
    }
    DatabaseObjectUtil.removeArrayPromise(foundObjs)
    .then((removedObj: Document[]) => {
      SalesLeadOrganizationMemberModel.find({lead: obj['_id']})
      .remove((err: Error, foundObjs: Document[]) => {
        if (err) {
          return next(err);
        }
       next();
      });
    })
    .catch((err: any) => {
		  next(err);
		});	
  });
});
