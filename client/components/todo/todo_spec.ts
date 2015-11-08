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
          expect(originalLength).toBe(todos.length);
          const newTodo = { title: `Some new task #: ${originalLength + 1}` };
          let createdTodo: Todo;
          todoInstance.saveOne(newTodo).subscribe((todo: Todo) => createdTodo = todo);

          fixture.detectChanges();

          expect(createdTodo.id).toBeGreaterThan(0);          
          expect(createdTodo.createdAt).toBeGreaterThan(0);          
          expect(createdTodo.title).toBe(newTodo.title);
          expect(obtainTodosLenght()).toBe(originalLength + 1);
          const existingTodo = ObjectUtil.clone(todos[0]);
          existingTodo.title = `Changed title ${Date.now() }`;
          todoInstance.saveOne(existingTodo);

          fixture.detectChanges();
          
          let selectedTodo: Todo;
          todoInstance.selectOne(existingTodo).subscribe((todo: Todo) => selectedTodo = todo);
          
          fixture.detectChanges();

          expect(selectedTodo).toEqual(existingTodo);
          expect(obtainTodosLenght()).toBe(originalLength + 1);
          todoInstance.removeOne(new Event('mock'), existingTodo);

          fixture.detectChanges();

          expect(obtainTodosLenght()).toBe(originalLength);
          
          let removedTodo: Todo;
          
          todoInstance.selectOne(existingTodo).subscribe((todo: Todo) => removedTodo = todo);
          
          fixture.detectChanges();
                    
          expect(removedTodo).not.toBeDefined();
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
      ensureCommunication(backend, RequestMethods.Get, todos);
      todoService.find().subscribe((resp: Todo[]) => {
        expect(resp).toBe(todos);
        done();
      });               
    });  
      
    it('perform findOneById', (done: Function) => {     
      ensureCommunication(backend, RequestMethods.Get, todo);
      todoService.findOneById(todo.id).subscribe((resp: Todo) => {
        expect(resp).toBe(todo);
        done();
      });  
    });
    
    it('perform createOne', (done: Function) => {     
      ensureCommunication(backend, RequestMethods.Post, todo);
      todoService.createOne(todo).subscribe((resp: Todo) => {
        expect(resp).toBe(todo);
        done();
      }); 
    });
    
    it('perform updateOne', (done: Function) => {     
      ensureCommunication(backend, RequestMethods.Put, todo);
      todoService.updateOne(todo).subscribe((resp: Todo) => {
        expect(resp).toBe(todo);
        done();
      });         
    });
    
    it('perform removeOneById', (done: Function) => {     
      ensureCommunication(backend, RequestMethods.Delete, todo);
      todoService.removeOneById(todo.id).subscribe((resp: Todo) => {
        expect(resp).toBe(todo);
        done();
      });               
    });    
  
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
  
  
  function ensureCommunication (backend: MockBackend, reqMethod: RequestMethods, expectedBody: string | Object) {
    backend.connections.subscribe((c: any) => {
      expect(c.request.method).toBe(reqMethod);
      c.mockRespond(new Response(new ResponseOptions({body: expectedBody})));
    });
  }

}

