import {
provide,
Type
} from 'angular2/angular2';
import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it,
beforeEachProviders
} from 'angular2/testing';
import * as Rx from '@reactivex/rxjs/dist/cjs/Rx';

import {ObjectUtil} from '../core/util';
import {TodoCmp} from './todo';
import {TodoService} from './todo_service';
import {Todo} from '../core/dto';
import {todos, buildTodo} from './todo_mock';


export function main() {
  describe('Todo component', () => {

    it('should work', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.overrideViewProviders(TodoCmp, [provide(TodoService, { useClass: TodoServiceMock })])
        .createAsync(TodoCmp).then((fixture) => {

          fixture.detectChanges();

          const todoInstance: TodoCmp = fixture.debugElement.componentInstance;
          const compiled = fixture.debugElement.nativeElement;

          const itemsSelector = 'tbody tr';

          function obtainTodosLenght() {
            return compiled.querySelectorAll(itemsSelector).length;
          }

          const originalLength = obtainTodosLenght();

          expect(originalLength).toBe(todoInstance.todos.length);

          const newTodo = buildTodo({ title: `Some new task #: ${originalLength + 1}` }, false);
          todoInstance.saveOne(newTodo);

          fixture.detectChanges();

          expect(obtainTodosLenght()).toBe(originalLength + 1);

          const existingTodo = ObjectUtil.clone(todoInstance.todos[0]);
          existingTodo.title = `Changed title ${Date.now() }`;

          todoInstance.saveOne(existingTodo);

          fixture.detectChanges();

          expect(existingTodo).toEqual(todoInstance.todos.find((it: Todo) => it.id === existingTodo.id));

          expect(obtainTodosLenght()).toBe(originalLength + 1);

          const event = new Event('build');

          todoInstance.removeOne(event, existingTodo);

          fixture.detectChanges();

          expect(obtainTodosLenght()).toBe(originalLength);

          const removedTodo = todoInstance.todos.find((it: Todo) => it.id === existingTodo.id);

          expect(removedTodo).not.toBeDefined(removedTodo);
        });
    }));

  });


  class TodoServiceMock {

    createOne(data: Todo): Rx.Observable<Todo> {
      const todo = buildTodo(data);
      todos.push(todo);
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
        const index = this._findIndex(id);
        todos.splice(index, 1);
      });
    }

    find(): Rx.Observable<Todo[]> {
      return Rx.Observable.from([todos]);
    }

    findOneById(id: string): Rx.Observable<Todo> {
      const index = this._findIndex(id);
      const todo = todos[index];
      return Rx.Observable.from([todo]);
    }

    private _findIndex(id: string): number {
      let todo: Todo;
      const n = todos.length;
      for (let i = 0; i < n; i++) {
        const it = todos[i];
        if (it.id === id) {
          return i;
        }
      }
      return -1;
    }

  }

}

