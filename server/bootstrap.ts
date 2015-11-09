import * as connectLivereload from 'connect-livereload';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as openResource from 'open';
import * as serveStatic from 'serve-static';
import {resolve} from 'path';

import {APP_BASE, LIVE_RELOAD_PORT, PATH, PORT, ENV} from '../tools/config';
import * as contactRouter from './contact/contact_router';

const INDEX_DEST_PATH = resolve(PATH.cwd, PATH.dest[ENV].base, 'index.html');

const server = express();

server.use(
  APP_BASE,
  connectLivereload({ port: LIVE_RELOAD_PORT }),
  serveStatic(resolve(PATH.cwd, PATH.dest[ENV].base))
);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use('/api/contact', contactRouter);

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


