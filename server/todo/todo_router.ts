import * as express from 'express';


import {todoService} from './todo_service';
import {Todo} from '../../shared/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const data: Todo = req.body;
  todoService.create(data).then((todo: Todo) => res.send({ todo }));
});

router.put('/:id', (req, res) => {
  const data: Todo = req.body;
  data.id = parseInt(req.body.id);
  todoService.update(data).then((todo: Todo) => res.send({ todo }));
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todoService.delete(id).then((affected: number) => res.send({ affected }));
});

router.get('/_search', (req, res) => {
  todoService.search().then((todos: Todo[]) => res.send({ todos }));
});


export = router;
