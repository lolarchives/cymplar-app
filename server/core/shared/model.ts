import {Schema, Document} from 'mongoose';
import * as database from '../database';

/* tslint:disable */
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */
 
const schemas = {
  country: new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  state: new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: ObjectId, ref: 'country', required: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  city: new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    state: { type: ObjectId, ref: 'state', required: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  industry: new Schema({
    code: { type: String, required: true, index: true, unique: true },
    description: { type: String, required: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
   contactStatus: new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  })
};

schemas.state.index({ code: 1, country: 1 }, { unique: true });
schemas.city.index({ code: 1, state: 1 }, { unique: true });

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

export const CountryModel = database.conn.model('country', schemas.country);
export const StateModel = database.conn.model('state', schemas.state);
export const CityModel = database.conn.model('city', schemas.city);
export const IndustryModel = database.conn.model('industry', schemas.industry);
export const ContactStatusModel = database.conn.model('contactStatus', schemas.contactStatus);

