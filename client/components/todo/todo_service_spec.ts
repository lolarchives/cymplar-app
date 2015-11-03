import {
AsyncTestCompleter,
afterEach,
beforeEach,
ddescribe,
describe,
expect,
iit,
inject,
it,
xit,
SpyObject
} from 'angular2/testing_internal';

import {Injector, provide} from 'angular2/core';
import {MockBackend, MockConnection} from 'angular2/src/http/backends/mock_backend';

import {
BaseRequestOptions,
ConnectionBackend,
Request,
RequestMethods,
RequestOptions,
Response,
ResponseOptions,
URLSearchParams,
JSONP_PROVIDERS,
HTTP_PROVIDERS,
XHRBackend,
JSONPBackend,
Http,
Jsonp
} from 'angular2/http';

import {TodoService} from './todo_service';

export function main() {
  
  describe('Todo Service', () => {

    var http: Http;
    var injector: Injector;
    var jsonpBackend: MockBackend;
    var xhrBackend: MockBackend;
    var jsonp: Jsonp;

    let todoService: TodoService;

    it('should return the list of todos', () => {
      inject([AsyncTestCompleter], (async: any) => {
              
          injector = Injector.resolveAndCreate([
            Http,
            provide(TodoService, {useFactory: (http: Http) => {
              return new TodoService(http);
            }, deps: [Http]})
          ]);
        
          todoService = injector.get(TodoService);
          
          expect(todoService instanceof TodoService).toBe(true);
          
          const todos = todoService.search();
          
          expect(todos).toEqual(jasmine.any(Promise));         
        
        });
        
      });
    });
}
