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
  user: {
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
    createdBy: { type: ObjectId, ref: 'user' }
  },
  company: {
    universalName: { type: String, unique: true, sparse: false, required: true },
    name: { type: String, required: true, index: true },
    websiteUrl: { type: String, unique: true, required: true },
    logo: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: ObjectId, ref: 'user', required: true }
  },
  contact: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    website: { type: String },
    industry: { type: ObjectId, ref: 'industry' },
    city: { type: ObjectId, ref: 'city' },
    // TODO createdBy must be required
    createdBy: { type: ObjectId, ref: 'user', required: false }
  },
  industry: {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    createdBy: { type: ObjectId, ref: 'user', required: true }
  },
  city: {
    name: { type: String, required: true, index: true },
    country: { type: ObjectId, ref: 'country', required: true }
  },
  country: {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true }
  }
};


const def_schema_opts = {timestamps: true};

export const UserModel = db.model('user', new Schema(schemas.user, def_schema_opts));
export const CompanyModel = db.model('company', new Schema(schemas.company, def_schema_opts));
export const IndustryModel = db.model('industry', new Schema(schemas.industry, def_schema_opts));
export const ContactModel = db.model('contact', new Schema(schemas.contact, def_schema_opts));
export const CityModel = db.model('city', new Schema(schemas.city, def_schema_opts));
export const CountryModel = db.model('country', new Schema(schemas.country, def_schema_opts));


