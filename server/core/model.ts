import {Schema, Document, createConnection} from 'mongoose';

/* tslint:disable */
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */

// TODO obtain this config according to the profile (prod, dev, etc.).
//const connUri = 'mongodb://admin:Leo2006!@ds049754.mongolab.com:49754/cymplar';
const connUri = 'mongodb://cymplarUser:cympl4r@ds037252.mongolab.com:37252/cymplar';

const db = createConnection(connUri);
db.on('error', () => console.error('Error connecting to Database:', connUri));
db.once('open', () => console.log('%s: Connected to MongoDb on %s', new Date(), connUri));


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
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  company: new Schema({
    universalName: { type: String, unique: true, sparse: false, required: true },
    name: { type: String, required: true, index: true },
    websiteUrl: { type: String, unique: true, required: true },
    logo: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: ObjectId, ref: 'user', required: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  contact: new Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    website: { type: String },
    industry: { type: ObjectId, ref: 'industry' },
    city: { type: ObjectId, ref: 'city' },
    // TODO createdBy must be required
    createdBy: { type: ObjectId, ref: 'user', required: false },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  country: new Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  city: new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: ObjectId, ref: 'country', required: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  industry: new Schema({
    code: { type: String, required: true, index: true, unique: true },
    description: { type: String, required: true, unique: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  addressBookContactStatus: new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
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
    status: { type: ObjectId, ref: 'addressBookContactStatus', required: true, index: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
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
    owner: { type: ObjectId, ref: 'user', required: true, index: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  })
};

schemas.city.index({ code: 1, state: 1 }, { unique: true });

schemas.addressBookContact.index({ email: 1, group: 1 }, { unique: true });
schemas.addressBookGroup.index({ name: 1, owner: 1 }, { unique: true });

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

schemas.addressBookGroup.pre('remove', function(next: Function) {
  const obj: Document = this;
  AddressBookContactModel.find({ group: obj._id }).remove((err: any, removedObjs: any) => {
    if (err) {
      next(err);
    }
  });
  next();
});

export const UserModel = db.model('user', schemas.user);
export const CompanyModel = db.model('company', schemas.company);
export const ContactModel = db.model('contact', schemas.contact);
export const CountryModel = db.model('country', schemas.country);
export const CityModel = db.model('city', schemas.city);
export const IndustryModel = db.model('industry', schemas.industry);
export const AddressBookContactStatusModel = db.model('addressBookContactStatus', schemas.addressBookContactStatus);
export const AddressBookContactModel = db.model('addressBookContact', schemas.addressBookContact);
export const AddressBookGroupModel = db.model('addressBookGroup', schemas.addressBookGroup);

