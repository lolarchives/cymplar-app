import {Injector, provide} from 'angular2/angular2';
import {it, inject, injectAsync} from 'angular2/testing';

import {
BaseRequestOptions,
ConnectionBackend,
Http,
MockBackend
} from 'angular2/http';

import {TodoService} from './todo_service';
import {Todo} from '../../../shared/dto';


export function main() {
  
  describe('Todo Service', () => {

    let injector: Injector;
    let backend: MockBackend;
    let connection: any;
    
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
      backend.connections.subscribe((c: any) => connection = c);      
      todoService = injector.get(TodoService);
    });   
    
    afterEach(() => backend.verifyNoPendingRequests());
    
    it('forgets to return a promise', injectAsync([], () => {      
      expect(todoService instanceof TodoService).toBe(true);
      const prom = todoService.search().subscribe((resp: any) => {
        console.log('todos', resp);
        return resp;
      });
      // .subscribe((res: any) => this.todos = res.todos);
      console.log('connection', connection, typeof connection);      
      return Promise.resolve(true);
    }));

    // it('todoService should be injectable', injectAsync(done: Function) => {         
    //   expect(todoService instanceof TodoService).toBe(true);
    // });
  
  });
    
}
