import * as mongoose from 'mongoose';

/* tslint:disable */
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */

// TODO obtain this config according to the profile (prod, dev, etc.).
//const connUri = 'mongodb://admin:Leo2006!@ds049754.mongolab.com:49754/cymplar';
const connUri = 'mongodb://cymplarUser:cympl4r@ds037252.mongolab.com:37252/cymplar';

const db = mongoose.createConnection(connUri);
db.on('error', () => console.error('Error connecting to Database industryType:', connUri));
db.once('open', () => console.log('%s: Connected to MongoDb industryType on %s', new Date(), connUri));

const def_schema_opts = { timestamps: true };

const industrySchema = new Schema({

  code: { type: String, required: true, index: true, unique: true },
  description: { type: String, required: true }

}, def_schema_opts);


export const IndustryModel = db.model('industry', industrySchema);


