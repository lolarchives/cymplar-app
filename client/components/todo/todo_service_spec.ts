import {
    AsyncTestCompleter,
    TestComponentBuilder,
    beforeEach,
    ddescribe,
    describe,
    expect,
    iit,
    inject,
    it,
    xit
} from 'angular2/testing';

import {Injector, provide} from 'angular2/angular2';

import {
BaseRequestOptions,
ConnectionBackend,
Http,
MockBackend
} from 'angular2/http';

import {TodoService} from './todo_service';


export function main() {
  
  describe('Todo Service', () => {

    var injector: Injector;

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
      todoService = injector.get(TodoService);
    });   

    it('todoService should be injectable', () => {         
      expect(todoService instanceof TodoService).toBe(true);
    });
  
    // it('should get some data', inject([AsyncTestCompleter], (async: any) => {
    //   expect(todoService instanceof TodoService).toBe(true);
    //   async.done();
    // }));
    
  });
    
}
