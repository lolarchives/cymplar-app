import * as mongoose from 'mongoose';

/* tslint:disable */
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
/* tslint:enable */

// TODO obtain this config according to the profile (prod, dev, etc.).
//const connUri = 'mongodb://admin:Leo2006!@ds049754.mongolab.com:49754/cymplar';
const connUri = 'mongodb://cymplarUser:cympl4r@ds037252.mongolab.com:37252/cymplar';

const db = mongoose.createConnection(connUri);
db.on('error', () => console.error('Error connecting to Database country:', connUri));
db.once('open', () => console.log('%s: Connected to MongoDb country on %s', new Date(), connUri));

const def_schema_opts = { timestamps: true };

const countrySchema = new Schema({

  code: { type: String, required: true, unique: true },
  name: { type: String, required: true }

}, def_schema_opts);


export const CountryModel = db.model('country', countrySchema);
