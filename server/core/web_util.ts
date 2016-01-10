import * as express from 'express';
import {BaseDto, AuthorizationData} from '../../client/core/dto';

export function sendError(res: express.Response, err: any) {
  const theError: Error = err;
  console.error('Something broke!', err);
  const sendFormat = {
    msg: theError.message,
    success: false
  };
  res.status(500).send(sendFormat);
}

export function formatSend(res: express.Response, result: any) {
  const sendFormat = {
    success: true,
    data: result
  };
  
  res.status(200).send(sendFormat);
}

export function getAuthorizationData(req: express.Request): AuthorizationData {
  const authorization: AuthorizationData = req.body.cymplarRole;
  delete req.body.cymplarRole;
  return authorization;
}

