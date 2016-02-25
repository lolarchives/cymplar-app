import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {accountUserService} from './account_user_service';
import {AccountUser, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)  
  };
  accountUserService.createOne(req.body, modelOptions)
    .then((user: AccountUser) => formatSend(res, user), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  req.body._id = req.params.id;
  accountUserService.updateOne(req.body, modelOptions)
    .then((user: AccountUser) => formatSend(res, user), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountUserService.removeOneById(req.params.id, modelOptions)
    .then((user: AccountUser) => formatSend(res, user), (err) => sendError(res, err));
});

router.get('/_find', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountUserService.find(req.query, modelOptions)
    .then((users: AccountUser[]) => formatSend(res, users), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    requireAuthorization: false,
    copyAuthorizationData: ''
  };
  accountUserService.exist(req.query, modelOptions)
    .then((exist: boolean) => formatSend(res, {exist: exist}), (err: any) => sendError(res, err));
});

router.get('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountUserService.findOneById(req.params.id, modelOptions)
    .then((user: AccountUser) => formatSend(res, user), (err: any) => sendError(res, err));
});


export = router;

