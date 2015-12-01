import * as mongoose from 'mongoose';

/* tslint:disable */
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */

// TODO obtain this config according to the profile (prod, dev, etc.).
//const connUri = 'mongodb://admin:Leo2006!@ds049754.mongolab.com:49754/cymplar';
const connUri = 'mongodb://cymplarUser:cympl4r@ds037252.mongolab.com:37252/cymplar';

const db = mongoose.createConnection(connUri);
db.on('error', () => console.error('Error connecting to Database contact:', connUri));
db.once('open', () => console.log('%s: Connected to MongoDb contact on %s', new Date(), connUri));

const def_schema_opts = { timestamps: true };

const contactSchema = new Schema({

  name: { type: String, required: true },
  description: { type: String },
  position: { type: String },
  contactNumber: { type: String, required: true },
  altContactNumber: { type: String },
  email: { type: String, required: true },
  website: { type: String },
  group: { type: ObjectId, ref: 'group', required: true, index: true },
  state: { type: ObjectId, ref: 'contactState', required: true, index: true }

}, def_schema_opts);


export const ContactModel = db.model('contact', contactSchema);


/**
 * Middleware
 */
contactSchema.pre('save', function(next: Function) {
  const self = this;
  ContactModel.find({ email: self.email, 'group': self.group }, (err, results) => {
    if (err) {
          next(err);
    } else {
      if (!results.length) {
        next();
      } else {
        next(new Error('That contact group and email are already in use for another contact in this group!'));
      }
    }
  });
});