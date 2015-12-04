import * as express from 'express';

import {sendError} from '../../core/web_util';
import {cityService} from './service';
import {City} from '../../../client/core/shared/dto';

const router = express.Router();

router.post('/', (req, res) => {
  cityService.createOne(req.body)
    .then((city: City) => res.send(city), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  cityService.updateOne(req.body)
    .then((city: City) => res.send(city), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  cityService.removeOneById(req.params.id)
    .then((city: City) => res.send(city), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  cityService.find()
    .then((citys: City[]) => res.send(citys), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  cityService.findOneById(req.params.id)
    .then((city: City) => res.send(city), (err: any) => sendError(res, err));
});


export = router;

