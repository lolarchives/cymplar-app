import {provide, Injector} from 'angular2/angular2';
import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
  ResponseOptions, RequestMethods
} from 'angular2/http';
import {TestComponentBuilder, describe, expect, inject, injectAsync, it,
  beforeEachProviders
} from 'angular2/testing';

import * as Rx from '@reactivex/rxjs/dist/cjs/Rx';

import {ObjectUtil} from '../core/util';
import {TodoCmp} from './todo';
import {TodoService} from './todo_service';
import {Todo} from '../core/dto';
import {todos, buildTodo} from './todo_mock';


export function main() {
  
  describe('TodoCmp', () => {

    it('crud should work', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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
  
  describe('TodoService', () => {    
    
    const todo = todos[0];
    
    let injector: Injector;
    let backend: MockBackend;    
    let todoService: TodoService;
    
    beforeEach(() => {
      injector = Injector.resolveAndCreate([
        BaseRequestOptions,
        MockBackend,
        provide(Http, {useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]}),
        provide(TodoService, {useFactory: (http: Http) => {
          return new TodoService(http);
        }, deps: [Http]})
      ]);
      backend = injector.get(MockBackend);           
      todoService = injector.get(TodoService);  
    });           
    
    afterEach(() => backend.verifyNoPendingRequests());        
    
    it('perform find', (done: Function) => {     
      ensureCommunication(RequestMethods.Get, todos);
      todoService.find().subscribe((resp: Todo[]) => {
        expect(resp).toBe(todos);
        done();
      });               
    });  
      
    it('perform findOneById', (done: Function) => {     
      ensureCommunication(RequestMethods.Get, todo);
      todoService.findOneById(todo.id).subscribe((resp: Todo) => {
        expect(resp).toBe(todo);
        done();
      });  
    });
    
    it('perform createOne', (done: Function) => {     
      ensureCommunication(RequestMethods.Post, todo);
      todoService.createOne(todo).subscribe((resp: Todo) => {
        expect(resp).toBe(todo);
        done();
      }); 
    });
    
    it('perform updateOne', (done: Function) => {     
      ensureCommunication(RequestMethods.Put, todo);
      todoService.updateOne(todo).subscribe((resp: Todo) => {
        expect(resp).toBe(todo);
        done();
      });         
    });
    
    it('perform removeOneById', (done: Function) => {     
      ensureCommunication(RequestMethods.Delete, todo);
      todoService.removeOneById(todo.id).subscribe((resp: Todo) => {
        expect(resp).toBe(todo);
        done();
      });               
    });
  
    function ensureCommunication (reqMethod: RequestMethods, expectedBody: string | Object) {
      backend.connections.subscribe((c: any) => {
        expect(c.request.method).toBe(reqMethod);
        c.mockRespond(new Response(new ResponseOptions({body: expectedBody})));
      });
    }
  
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

