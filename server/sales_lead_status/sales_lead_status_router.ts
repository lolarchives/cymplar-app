import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {salesLeadStatusService} from './sales_lead_status_service';
import {SalesLeadStatus, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  salesLeadStatusService.createOne(req.body)
    .then((member: SalesLeadStatus) => formatSend(res, member), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  salesLeadStatusService.updateOne(req.body)
    .then((member: SalesLeadStatus) => formatSend(res, member), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  salesLeadStatusService.removeOneById(req.params.id)
    .then((member: SalesLeadStatus) => formatSend(res, member), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true,
    requireAuthorization: false
  };
  salesLeadStatusService.find(req.query, modelOptions)
    .then((members: SalesLeadStatus[]) => formatSend(res, members), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  salesLeadStatusService.exist(req.query)
    .then((exist: boolean) => formatSend(res, {exist: exist}), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  salesLeadStatusService.findOneById(req.params.id)
    .then((member: SalesLeadStatus) => formatSend(res, member), (err: any) => sendError(res, err));
});


export = router;

