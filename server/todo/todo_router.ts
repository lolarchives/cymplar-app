import * as express from 'express';


import {todoService} from './todo_service';
import {Todo} from '../../client/components/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  todoService.createOne(req.body).then((todo: Todo) => res.send(todo));
});

router.put('/:id', (req, res) => {
  todoService.updateOne(req.body).then((todo: Todo) => res.send(todo));
});

router.delete('/:id', (req, res) => {
  todoService.removeOneById(req.params.id).then((todo: Todo) => res.send(todo));
});

router.get('/_find', (req, res) => {
  todoService.find().then((todos: Todo[]) => res.send(todos));
});

router.get('/:id', (req, res) => {
  todoService.findOneById(req.params.id).then((todo: Todo) => res.send(todo));
});


export = router;
