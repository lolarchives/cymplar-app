import * as express from 'express';

export function sendError(res: express.Response, err: any) {
  console.error('Something broke!', err);
  res.status(500).send('Something broke!');
}
