import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {accountOrganizationService} from './account_organization_service';
import {AccountOrganization, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    onlyValidateParentAuthorization: true
  };
  accountOrganizationService.createOneWithMember(req.body, modelOptions)
    .then((organization: AccountOrganization) => formatSend(res, organization), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  req.body._id = req.params.id;
  accountOrganizationService.updateOne(req.body, modelOptions)
    .then((organization: AccountOrganization) => formatSend(res, organization), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountOrganizationService.removeOneByIdWithValidation(req.params.id, modelOptions)
    .then((organization: AccountOrganization) => formatSend(res, organization), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountOrganizationService.findOrganizationsPerUser(req.query, modelOptions)
    .then((organizations: AccountOrganization[]) => formatSend(res, organizations), (err: any) => sendError(res, err));
});

router.get('/_find_from_members', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountOrganizationService.findOrganizationsPerUserMember(req.query, modelOptions)
    .then((organizations: AccountOrganization[]) => formatSend(res, organizations), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    requireAuthorization: false,
    copyAuthorizationData: ''
  };
  accountOrganizationService.exist(req.query, modelOptions)
    .then((exist: boolean) => formatSend(res, {exist: exist}), (err: any) => sendError(res, err));
});

router.get('/_login', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: false,
    projection: '_id',
    requireAuthorization: false,
    copyAuthorizationData: ''
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