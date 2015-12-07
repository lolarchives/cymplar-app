import * as express from 'express';

import {sendError} from '../../core/web_util';
import {industryService} from './service';
import {Industry} from '../../../client/core/shared/dto';

const router = express.Router();

router.post('/', (req, res) => {
  industryService.createOne(req.body)
    .then((industry: Industry) => res.send(industry), (err) => sendError(res, err));
});

router.put('/', (req, res) => {
  industryService.updateOne(req.body)
    .then((industry: Industry) => res.send(industry), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  industryService.removeOneById(req.params.id)
    .then((industry: Industry) => res.send(industry), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  industryService.find()
    .then((industrys: Industry[]) => res.send(industrys), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  industryService.findOneById(req.params.id)
    .then((industry: Industry) => res.send(industry), (err: any) => sendError(res, err));
});


export = router;

