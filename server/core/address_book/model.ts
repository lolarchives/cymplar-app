import {Schema, Document} from 'mongoose';
import * as database from '../database';

/* tslint:disable */
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */
 
const schemas = {
  contact: new Schema({
    name: { type: String, required: true },
    description: { type: String },
    position: { type: String },
    contactNumber: { type: String, required: true },
    altContactNumber: { type: String },
    email: { type: String, required: true },
    website: { type: String },
    group: { type: ObjectId, ref: 'group', required: true, index: true },
    status: { type: ObjectId, ref: 'contactStatus', required: true, index: true },
    createdAt: {type: Number},
    updatedAt: {type: Number}
  }),
  group: new Schema({
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

schemas.contact.index({ email: 1, group: 1 }, { unique: true });
schemas.group.index({ name: 1, owner: 1 }, { unique: true });

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

export const ContactModel = database.conn.model('contact', schemas.contact);
export const GroupModel = database.conn.model('group', schemas.group);

schemas.group.pre('remove', function(next: Function) {
  const obj: Document = this;
  ContactModel.find({ group: obj._id }).remove((err: any, removedObjs: any) => {
    if (err) {
      next(err);
    }
  });
  next();
});