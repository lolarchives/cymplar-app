import * as connectLivereload from 'connect-livereload';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as tinylrFn from 'tiny-lr';
import * as openResource from 'open';
import * as serveStatic from 'serve-static';
import {resolve} from 'path';

import {APP_BASE, LIVE_RELOAD_PORT, PATH, PORT, ENV} from '../tools/config';
import * as todoRouter from './todo/todo_router';

const tinylr = tinylrFn();

const INDEX_DEST_PATH = resolve(PATH.cwd, PATH.dest[ENV].base, 'index.html');


export function serveSPA() {

  const server = express();
  tinylr.listen(LIVE_RELOAD_PORT);

  server.use(
    APP_BASE,
    connectLivereload({ port: LIVE_RELOAD_PORT }),
    serveStatic(resolve(PATH.cwd, PATH.dest[ENV].base))
  );
  
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));  
  
  server.use('/api/todo', todoRouter);

  server.all(APP_BASE + '*', (req, res) =>
    res.sendFile(INDEX_DEST_PATH)
  );

  server.listen(PORT, () =>
    openResource('http://localhost:' + PORT + APP_BASE)
  );
}

export function notifyLiveReload(changedFiles: string[]) {
  tinylr.changed({
    body: { files: changedFiles }
  });
}
