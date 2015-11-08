import * as Rx from '@reactivex/rxjs/dist/cjs/Rx';


import {ObjectUtil} from '../core/object_util';
import {Todo} from '../core/dto';


export class TodoServiceMock {

  private static _seq = 0;

  private static _todos: Todo[] = [
    TodoServiceMock.buildTodo({ title: 'Angular2 Router' }),
    TodoServiceMock.buildTodo({ title: 'Angular2 Component' }),
    TodoServiceMock.buildTodo({ title: 'Angular2 Core Directives' }),
    TodoServiceMock.buildTodo({ title: 'Angular2 Custom Directives' }),
    TodoServiceMock.buildTodo({ title: 'Angular2 Dependence Injection' }),
    TodoServiceMock.buildTodo({ title: 'Angular2 Form' }),
    TodoServiceMock.buildTodo({ title: 'Include Development environment' }),
    TodoServiceMock.buildTodo({ title: 'Include Production environment', status: 'pending' }),
    TodoServiceMock.buildTodo({ title: 'Unit tests' })
  ];  

  static get todos() {
    return ObjectUtil.clone(TodoServiceMock._todos);
  }

  static buildTodo(data?: Todo, generateId = true): Todo {
    const todo: Todo = {};
    if (generateId) {
      todo.id = TodoServiceMock._nextId();
    }
    todo.status = 'done';
    todo.createdAt = Date.now();
    ObjectUtil.merge(todo, data);
    return todo;
  }   
  
  private static _nextId() {
    return `${++TodoServiceMock._seq}`;
  }

  createOne(data: Todo): Rx.Observable<Todo> {
    const todo = TodoServiceMock.buildTodo(data);
    TodoServiceMock._todos.push(todo);
    return Rx.Observable.from([todo]);
  }

  updateOne(data: Todo): Rx.Observable<Todo> {
    return this.findOneById(data.id).map((todo: Todo) => {
      ObjectUtil.merge(todo, data);
      return todo;
    });
  }

  removeOneById(id: string): Rx.Observable<Todo> {
    return this.findOneById(id).do((todo: Todo) => {
      TodoServiceMock._todos = TodoServiceMock._todos.filter((it: Todo) => it.id !== todo.id);
    });
  }

  find(): Rx.Observable<Todo[]> {
    return Rx.Observable.from([TodoServiceMock._todos]);
  }

  findOneById(id: string): Rx.Observable<Todo> {
    let todo: Todo;
    const n = TodoServiceMock._todos.length;
    for (let i = 0; i < n; i++) {
      const it = TodoServiceMock._todos[i];
      if (it.id === id) {
        todo = it;
        break;
      }
    }
    return Rx.Observable.from([todo]);
  }

}
