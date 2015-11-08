import {
  Injector,
  provide
} from 'angular2/angular2';
import {
  ConnectionBackend, 
  BaseRequestOptions,
  RequestOptions,
  MockBackend,
  Http
} from 'angular2/http';
import {
  TestComponentBuilder,
  describe,
  expect,
  injectAsync,
  it,
  beforeEachProviders
} from 'angular2/testing';

import {verifyNoBrowserErrors} from 'angular2/src/testing/e2e_util';

import {Component, View} from 'angular2/angular2';
import {TodoCmp} from './todo';
import {TodoService} from './todo_service';

export function main() {
  describe('Todo component', () => {
		
		const URL = 'todo';
    
    let injector: Injector;
    
    let todoService: TodoService;
    
    beforeEachProviders(() => [RequestOptions, ConnectionBackend, Http, TodoService]);
    
    // beforeEach(() => {
    //   injector = Injector.resolveAndCreate([
    //     BaseRequestOptions,
    //     MockBackend,
    //     provide(Http, {useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
    //       return new Http(backend, defaultOptions);
    //     }, deps: [MockBackend, BaseRequestOptions]}),
    //     provide(TodoService, {useFactory: (http: Http) => {
    //       return new TodoService(http);
    //     }, deps: [Http]})
    //   ]);
    // }); 
   
		
		// afterEach(verifyNoBrowserErrors);
		
		// it('should work', function() {
    // 	browser.get(URL);
    // 	expect(true).toBe(true);
		// 	verifyNoBrowserErrors();
  	// });
		
    // it('should work',
      // injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      //   return tcb.overrideTemplate(TestComponent, '<div><todo></todo></div>')
      //     .createAsync(TestComponent)
      //     .then((fixture) => {
						
						// fixture.detectChanges();

//             const todoInstance = rootTC.debugElement.componentViewChildren[0].componentInstance;
//             //const todoDomEl = rootTC.debugElement.componentViewChildren[0].nativeElement;

//             const todoListLength = () => {
//               return todoInstance.todoService.find().length;
//             };

//             //const itemsSelector = 'tbody tr';

//             expect(todoInstance.todoService).toEqual(jasmine.any(TodoService));

//             todoInstance.addOne({ title: 'Some new task' });
//             // rootTC.detectChanges();

//             expect(todoListLength()).toEqual(10);
//             // expect(DOM.querySelectorAll(todoDomEl, itemsSelector).length).toEqual(todoListLength());

//             // expect(DOM.querySelectorAll(todoDomEl, itemsSelector + ' td:first-child')[10].textContent).toEqual('Some new task');
      //     });
      // }));
  });
}

@Component({ selector: 'test-cmp', viewProviders: [TodoService] })
@View({ directives: [TodoCmp] })
class TestComponent { }
