import {
  Injector,
  provide
} from 'angular2/angular2';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http,
  MockBackend,
  Response,
  ResponseOptions,
  RequestMethods
} from 'angular2/http';
import {
  it,
  inject,
  beforeEachProviders
} from 'angular2/testing';

import {TodoService} from './todo_service';
import {Todo} from '../core/dto';
import {todos} from './todo_mock';


export function main() {
  
  describe('todoService', () => {    
    
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
  
  
    
}
