import * as mongoose from 'mongoose';

/* tslint:disable */
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */

// TODO obtain this config according to the profile (prod, dev, etc.).
//const connUri = 'mongodb://admin:Leo2006!@ds049754.mongolab.com:49754/cymplar';
const connUri = 'mongodb://cymplarUser:cympl4r@ds037252.mongolab.com:37252/cymplar';

const db = mongoose.createConnection(connUri);
db.on('error', () => console.error('Error connecting to Database group:', connUri));
db.once('open', () => console.log('%s: Connected to MongoDb group on %s', new Date(), connUri));

const def_schema_opts = { timestamps: true };

const groupSchema = new Schema({

  name: { type: String, required: true },
  description: { type: String },
  city: { type: ObjectId, ref: 'city', required: true },
  postcode: { type: String },
  streetName: { type: String },
  industry: { type: ObjectId, ref: 'industry', required: true },
  website: { type: String },
  bussinessNumber: { type: String },
  owner: { type: ObjectId, ref: 'user', required: true, index: true }

}, def_schema_opts);


export const GroupModel = db.model('group', groupSchema);


/**
 * Middleware
 */
groupSchema.pre('save', function(next: any) {
  const self = this;
  GroupModel.find({ name: self.name, 'owner': self.owner }, (err, results) => {
    if (err) {
          next(err);
    } else {
      if (!results.length) {
        next();
      } else {
        next(new Error('That group name are already in use for another group in this address-book!'));
      }
    }
  });
});

