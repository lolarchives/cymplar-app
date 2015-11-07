import * as express from 'express';


import {todoService} from './todo_service';
import {Todo} from '../../shared/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const data: Todo = req.body;
  todoService.createOne(data).then((todo: Todo) => res.send(todo));
});

router.put('/:id', (req, res) => {
  const data: Todo = req.body;
  data.id = parseInt(req.body.id);
  todoService.updateOne(data).then((todo: Todo) => res.send(todo));
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todoService.removeOneById(id).then((todo: Todo) => res.send(todo));
});

router.get('/_find', (req, res) => {
  todoService.find().then((todos: Todo[]) => res.send(todos));
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todoService.findOneById(id).then((todo: Todo) => res.send(todo));
});


export = router;
