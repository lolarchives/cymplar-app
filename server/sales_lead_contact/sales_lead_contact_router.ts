import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {salesLeadContactService} from './sales_lead_contact_service';
import {SalesLeadContact, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  salesLeadContactService.createOne(req.body, modelOptions)
    .then((member: SalesLeadContact) => formatSend(res, member), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  req.body._id = req.params.id;
  salesLeadContactService.updateOne(req.body)
    .then((member: SalesLeadContact) => formatSend(res, member), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: {_id: req.params.id}
  };
  salesLeadContactService.removeOneById(req.params.id, modelOptions)
    .then((member: SalesLeadContact) => formatSend(res, member), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  salesLeadContactService.find(req.query, modelOptions)
    .then((members: SalesLeadContact[]) => formatSend(res, members), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  salesLeadContactService.exist(req.query, modelOptions)
    .then((exist: boolean) => formatSend(res, exist), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  salesLeadContactService.findOneById(req.params.id, modelOptions)
    .then((member: SalesLeadContact) => formatSend(res, member), (err: any) => sendError(res, err));
});


export = router;

