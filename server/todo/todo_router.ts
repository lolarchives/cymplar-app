import * as express from 'express';

import {Todo} from '../../shared/dto';

const router = express.Router();

let counter = 0;
  
let todos: Todo[] = [
  { id: ++counter, title: 'Angular2 Router', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Angular2 Component', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Angular2 Core Directives', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Angular2 Custom Directives', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Angular2 Dependence Injection', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Angular2 Form', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Include Development environment', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Include Production environment', status: 'pending', createdAt: Date.now() },
  { id: ++counter, title: 'Unit tests', status: 'done', createdAt: Date.now()}
];

router.post('/', (req, res) => {
  const data: Todo = req.body;
  const todo = data;
  todo.id = ++counter;
  todo.status = 'pending';
  todo.createdAt = Date.now();  
  todos.push(todo);
  res.send({todo});
});

router.put('/:id', (req, res) => {
  const data: Todo = req.body;  
  data.id = parseInt(req.params.id);
  let todo: Todo;
  for (let i = 0, n = todos.length; i < n; i++) {
    if (todos[i].id === data.id) {
      todo = todos[i];
      break;
    }
  }
  for (const prop in data) {
    todo[prop] = data[prop];
  }  
  res.send({todo});
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const originalLength = todos.length;
  todos = todos.filter(it => it.id !== id);
  const affected = originalLength - todos.length;
  res.send({affected});
});

router.get('/_search', (req, res) => {  
  res.send({todos}); 
});

export = router;
