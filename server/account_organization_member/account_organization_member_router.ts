import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {accountOrganizationMemberService} from './account_organization_member_service';
import {AccountOrganizationMember, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'user',
    requireAuthorization: false
  };
  accountOrganizationMemberService.createOne(req.body, modelOptions)
    .then((member: AccountOrganizationMember) => formatSend(res, member), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  req.body._id = req.params.id;
  accountOrganizationMemberService.updateOne(req.body, modelOptions)
    .then((member: AccountOrganizationMember) => formatSend(res, member), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    population: 'role organization'
  };
  accountOrganizationMemberService.removeOneByIdWithValidation(req.params.id, modelOptions)
    .then((member: AccountOrganizationMember) => formatSend(res, member), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'user',
    onlyValidateParentAuthorization: true
  };
  accountOrganizationMemberService.find(req.query, modelOptions)
    .then((members: AccountOrganizationMember[]) => formatSend(res, members), (err: any) => sendError(res, err));
});

router.get('/_find_team', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'team'
  };
  accountOrganizationMemberService.find(req.query, modelOptions)
    .then((members: AccountOrganizationMember[]) => formatSend(res, members), (err: any) => sendError(res, err));
});

router.get('/_find_membership', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountOrganizationMemberService.returnCurrentOrganizationMember(modelOptions)
    .then((member: AccountOrganizationMember) => formatSend(res, member), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    requireAuthorization: false,
    copyAuthorizationData: ''
  };
  accountOrganizationMemberService.exist(req.query, modelOptions)
    .then((exist: boolean) => formatSend(res, {exist: exist}), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountOrganizationMemberService.findOneById(req.params.id, modelOptions)
    .then((member: AccountOrganizationMember) => formatSend(res, member), (err: any) => sendError(res, err));
});


export = router;

