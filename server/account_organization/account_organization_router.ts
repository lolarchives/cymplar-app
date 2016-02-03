import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {accountOrganizationService} from './account_organization_service';
import {AccountOrganization, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountOrganizationService.createOneWithMember(req.body, modelOptions)
    .then((organization: AccountOrganization) => formatSend(res, organization), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: {_id: req.params.id}
  };
  accountOrganizationService.updateOne(req.body, modelOptions)
    .then((organization: AccountOrganization) => formatSend(res, organization), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountOrganizationService.removeOneById(req.params.id, modelOptions)
    .then((organization: AccountOrganization) => formatSend(res, organization), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountOrganizationService.findOrganizationsPerUser(req.query, modelOptions)
    .then((organizations: AccountOrganization[]) => formatSend(res, organizations), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    requireAuthorization: false
  };
  accountOrganizationService.exist(req.query, modelOptions)
    .then((exist: boolean) => formatSend(res, {exist: exist}), (err: any) => sendError(res, err));
});

router.get('/_login', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: false,
    projection: '_id',
    requireAuthorization: false
  };


  accountOrganizationService.findOne(req.query, modelOptions)
    .then((organization: AccountOrganization) => formatSend(res, organization), (err) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountOrganizationService.findOneById(req.params.id, modelOptions)
    .then((organization: AccountOrganization) => formatSend(res, organization), (err: any) => sendError(res, err));
});


export = router;