import {
  Injector,
  provide
} from 'angular2/angular2';
import {
  it
} from 'angular2/testing';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http,
  MockBackend,
  Response,
  ResponseOptions,
  RequestMethods
} from 'angular2/http';

import {TodoService} from './todo_service';
import {Todo} from '../../../shared/dto';


export function main() {
  
  describe('TodoService', () => {    
    
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
