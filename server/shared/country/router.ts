import * as express from 'express';

import {sendError} from '../../core/web_util';
import {countryService} from './service';
import {Country} from '../../../client/core/shared/dto';

const router = express.Router();

router.post('/', (req, res) => {
  countryService.createOne(req.body)
    .then((country: Country) => res.send(country), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  countryService.updateOne(req.body)
    .then((country: Country) => res.send(country), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  countryService.removeOneById(req.params.id)
    .then((country: Country) => res.send(country), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  countryService.find()
    .then((countrys: Country[]) => res.send(countrys), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  countryService.findOneById(req.params.id)
    .then((country: Country) => res.send(country), (err: any) => sendError(res, err));
});


export = router;

