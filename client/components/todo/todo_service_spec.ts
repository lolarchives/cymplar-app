import {
  Injector,
  provide
} from 'angular2/angular2';
// import {PromiseWrapper} from 'angular2/src/core/facade/promise';
import {
  it,
  injectAsync
} from 'angular2/testing';
// import * as Rx from '@reactivex/rxjs';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http,
  MockBackend,
  Response,
  ResponseOptions  
} from 'angular2/http';

import {TodoService} from './todo_service';
import {Todo} from '../../../shared/dto';


export function main() {
  
  describe('TodoService', () => {

    let injector: Injector;
    let backend: MockBackend;
    let connection: any;
    
    let todoService: TodoService;
    
    let seq = 0;

    const someTodos: Todo[] = [
      { id: ++seq, title: 'Angular2 Router', status: 'done', createdAt: Date.now() },
      { id: ++seq, title: 'Angular2 Component', status: 'done', createdAt: Date.now() },
      { id: ++seq, title: 'Angular2 Core Directives', status: 'done', createdAt: Date.now() },
      { id: ++seq, title: 'Angular2 Custom Directives', status: 'done', createdAt: Date.now() },
      { id: ++seq, title: 'Angular2 Dependence Injection', status: 'done', createdAt: Date.now() },
      { id: ++seq, title: 'Angular2 Form', status: 'done', createdAt: Date.now() },
      { id: ++seq, title: 'Include Development environment', status: 'done', createdAt: Date.now() },
      { id: ++seq, title: 'Include Production environment', status: 'pending', createdAt: Date.now() },
      { id: ++seq, title: 'Unit tests', status: 'done', createdAt: Date.now() }
    ];
    
    const someTodo = someTodos[0];
    
    
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
      backend.connections.subscribe((conn: any) => connection = conn);       
    });   
    
    afterEach(() => backend.verifyNoPendingRequests());    
    
    it('be injectable', () => {         
      expect(todoService instanceof TodoService).toBe(true);
    });
    
    it('perform find', injectAsync([], () => {     
      return new Promise((resolve, reject) => {
        todoService.find().subscribe((resp: Todo[]) => {
          expect(resp).toBe(someTodos);
          resolve(resp);
        });
        connection.mockRespond(new Response(new ResponseOptions({body: someTodos})));                
      });      
    }));
      
    it('perform findOne', injectAsync([], () => {     
      return new Promise((resolve, reject) => {
        todoService.findOne(someTodo.id).subscribe((resp: Todo) => {
          expect(resp).toBe(someTodo);
          resolve(resp);
        });
        connection.mockRespond(new Response(new ResponseOptions({body: someTodo})));                
      });      
    }));
  
  });
    
}
