import * as connectLivereload from 'connect-livereload';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as openResource from 'open';
import * as serveStatic from 'serve-static';
import {resolve} from 'path';

import {APP_BASE, LIVE_RELOAD_PORT, PATH, PORT} from '../tools/config';

import * as countryRouter from './shared/country/router';
import * as stateRouter from './shared/state/router';
import * as cityRouter from './shared/city/router';
import * as industryRouter from './shared/industry/router';
import * as contactStateRouter from './shared/contactStatus/router';

import * as groupRouter from './address_book/group/router';
import * as contactRouter from './address_book/contact/router';
import * as addressBookRouter from './address_book/router';


const INDEX_DEST_PATH = resolve(PATH.cwd, PATH.dest.app.base, 'index.html');

const server = express();

server.use(
  APP_BASE,
  connectLivereload({ port: LIVE_RELOAD_PORT }),
  serveStatic(resolve(PATH.cwd, PATH.dest.app.base))
);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use('/api/country', countryRouter);
server.use('/api/state', stateRouter);
server.use('/api/city', cityRouter);
server.use('/api/industry', industryRouter);
server.use('/api/contactState', contactStateRouter);

server.use('/api/group', groupRouter);
server.use('/api/contact', contactRouter);
server.use('/api/address-book', addressBookRouter);

server.all(APP_BASE + '*', (req, res) =>
  res.sendFile(INDEX_DEST_PATH)
);

server.listen(PORT, () => {
  const url = 'http://localhost:' + PORT + APP_BASE;
  if (process.env.RESTART) {     
    console.log('Server restarted at: ', url);
  } else {
    openResource(url);
    console.log('Server started at: ', url);
  }
});


