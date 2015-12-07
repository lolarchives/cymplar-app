import {createConnection} from 'mongoose';

const connUri = 'mongodb://cymplarUser:cympl4r@ds037252.mongolab.com:37252/cymplar';

export const conn = createConnection(connUri);
conn.on('error', () => console.error('Error connecting to Database:', connUri));
conn.once('open', () => console.log('%s: Connected to Mongodb on %s', new Date(), connUri));