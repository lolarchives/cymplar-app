import * as mongoose from 'mongoose';

/* tslint:disable */
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */

function buildSchemasDefinition(db: mongoose.Connection) {
  const schemasDef = {
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
      lastLoginDate: { type: Number },
      createdAt: { type: Number, default: Date.now, required: true },
      updatedAt: { type: Number },
      createdBy: { type: ObjectId, ref: 'user' }
    }),
    company: new Schema({
      universalName: { type: String, unique: true, required: true },
      name: { type: String, required: true, index: true },
      websiteUrl: { type: String, unique: true, required: true },
      logo: { type: String, required: true },
      industry: { type: String, required: true },
      description: { type: String, required: true },
      createdAt: { type: Number, default: Date.now, required: true },
      updatedAt: { type: Number },
      createdBy: { type: ObjectId, ref: 'user', required: true }
    }),
    category: new Schema({
      name: { type: String, index: true, required: true },
      description: { type: String, required: true },
      company: { type: ObjectId, ref: 'company', index: true, required: true },
      createdAt: { type: Number, 'default': Date.now, required: true },
      updatedAt: { type: Number },
      createdBy: { type: ObjectId, ref: 'user', required: true }        
    }),
    city: new Schema({
      name: { type: String, required: true, index: true },
      state: { type: ObjectId, ref: 'state', required: true },
      createdAt: { type: Number, default: Date.now, required: true },
      updatedAt: { type: Number }
    }),
    state: new Schema({
      name: { type: String, required: true, unique: true },
      country: { type: ObjectId, ref: 'country', required: true },
      createdAt: { type: Number, default: Date.now, required: true },
      updatedAt: { type: Number }
    }),
    country: new Schema({
      name: { type: String, required: true, unique: true },
      code: { type: String, required: true, unique: true },
      createdAt: { type: Number, default: Date.now, required: true },
      updatedAt: { type: Number }
    })
  };

  const model: any = {};
   
  for (let prop in schemasDef) {
    model[prop] = db.model(prop, schemasDef[prop]);
  }
  
  return model;
}


// TODO obtain this config according to the profile (prod, dev, etc.).
const connUri = 'mongodb://admin:Leo2006!@ds049754.mongolab.com:49754/cymplar';

const db = mongoose.createConnection(connUri);    
db.on('error', () => console.error('Error connecting to Database:', connUri));
db.once('open', () => console.log('%s: Connected to MongoDb on %s', new Date(), connUri));

export const model = buildSchemasDefinition(db);
