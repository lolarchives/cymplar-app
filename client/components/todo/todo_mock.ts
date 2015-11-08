import {ObjectUtil} from '../core/util';
import {Todo} from '../core/dto';

let seq = 0;

export const todos: Todo[] = [
  buildTodo({ title: 'Angular2 Router' }),
  buildTodo({ title: 'Angular2 Component' }),
  buildTodo({ title: 'Angular2 Core Directives' }),
  buildTodo({ title: 'Angular2 Custom Directives' }),
  buildTodo({ title: 'Angular2 Dependence Injection' }),
  buildTodo({ title: 'Angular2 Form' }),
  buildTodo({ title: 'Include Development environment' }),
  buildTodo({ title: 'Include Production environment', status: 'pending' }),
  buildTodo({ title: 'Unit tests' })
]; 

function nextId() {
  return `${++seq}`;
}

export function buildTodo(data?: Todo, generateId = true): Todo {
  const todo: Todo = {};  
  todo.status = 'done';
  todo.createdAt = Date.now();
  ObjectUtil.merge(todo, data);
  if (generateId) {
    todo.id = nextId();
  }
  return todo;
} 
