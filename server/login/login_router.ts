import * as express from 'express';

import {sendError} from '../core/web_util';
import {loginService} from './login_service';
import {AuthenticationResponse} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  loginService.createOne(req.body)
    .then((authentication: AuthenticationResponse) => res.send(authentication), (err) => sendError(res, err));
});


export = router;

