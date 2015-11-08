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
import {TodoServiceMock} from './todo_service_mock';


export function main() {
  
  describe('TodoService', () => {    

    const someTodos: Todo[] = TodoServiceMock.todos;    
    const someTodo = someTodos[0];
    
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
      ensureCommunication(RequestMethods.Get, someTodos);
      todoService.find().subscribe((resp: Todo[]) => {
        expect(resp).toBe(someTodos);
        done();
      });               
    });  
      
    it('perform findOneById', (done: Function) => {     
      ensureCommunication(RequestMethods.Get, someTodo);
      todoService.findOneById(someTodo.id).subscribe((resp: Todo) => {
        expect(resp).toBe(someTodo);
        done();
      });  
    });
    
    it('perform createOne', (done: Function) => {     
      ensureCommunication(RequestMethods.Post, someTodo);
      todoService.createOne(someTodo).subscribe((resp: Todo) => {
        expect(resp).toBe(someTodo);
        done();
      }); 
    });
    
    it('perform updateOne', (done: Function) => {     
      ensureCommunication(RequestMethods.Put, someTodo);
      todoService.updateOne(someTodo).subscribe((resp: Todo) => {
        expect(resp).toBe(someTodo);
        done();
      });         
    });
    
    it('perform removeOneById', (done: Function) => {     
      ensureCommunication(RequestMethods.Delete, someTodo);
      todoService.removeOneById(someTodo.id).subscribe((resp: Todo) => {
        expect(resp).toBe(someTodo);
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
