import * as mongoose from 'mongoose';

/* tslint:disable */
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */

// TODO obtain this config according to the profile (prod, dev, etc.).
const connUri = 'mongodb://admin:Leo2006!@ds049754.mongolab.com:49754/cymplar';

const db = mongoose.createConnection(connUri);
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
  industry: new Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    createdBy: { type: ObjectId, ref: 'user', required: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  city: new Schema({
    name: { type: String, required: true, index: true },
    country: { type: ObjectId, ref: 'country', required: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  country: new Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  })
};


for (let prop in schemas) {
  const schem: mongoose.Schema = schemas[prop];
  schem.pre('save', function(next: Function) {
    const obj: any = this;
    console.log('pre save', obj.isNew);
    const now = Date.now();
    if (obj.isNew) {
      obj.createdAt = now;
    }
    obj.updatedAt = now;
    next();
  });
}


export const UserModel = db.model('user', schemas.user);
export const CompanyModel = db.model('company', schemas.company);
export const IndustryModel = db.model('industry', schemas.industry);
export const ContactModel = db.model('contact', schemas.contact);
export const CityModel = db.model('city', schemas.city);
export const CountryModel = db.model('country', schemas.country);


