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
  TestComponentBuilder,
  describe,
  expect,
  injectAsync,
  it,
  beforeEachProviders
} from 'angular2/testing';
import * as Rx from '@reactivex/rxjs/dist/cjs/Rx';

import {TodoCmp} from './todo';
import {TodoService} from './todo_service';
import {Todo} from '../../../shared/dto';


class MockTodoService {
  
  private seq = 0;
  
  private todos: Todo[] = [
    { id: this.nextId(), title: 'Angular2 Router', status: 'done', createdAt: Date.now() },
    { id: this.nextId(), title: 'Angular2 Component', status: 'done', createdAt: Date.now() },
    { id: this.nextId(), title: 'Angular2 Core Directives', status: 'done', createdAt: Date.now() },
    { id: this.nextId(), title: 'Angular2 Custom Directives', status: 'done', createdAt: Date.now() },
    { id: this.nextId(), title: 'Angular2 Dependence Injection', status: 'done', createdAt: Date.now() },
    { id: this.nextId(), title: 'Angular2 Form', status: 'done', createdAt: Date.now() },
    { id: this.nextId(), title: 'Include Development environment', status: 'done', createdAt: Date.now() },
    { id: this.nextId(), title: 'Include Production environment', status: 'pending', createdAt: Date.now() },
    { id: this.nextId(), title: 'Unit tests', status: 'done', createdAt: Date.now() }
  ];

  createOne(data: Todo): Rx.Observable<Todo> {
    data.id = this.nextId();
    data.status = 'pending';
    data.createdAt = Date.now();
    this.todos.push(data);
    return Rx.Observable.from([data]);
  }

  updateOne(data: Todo): Rx.Observable<Todo> {
    return this.findOneById(data.id).map((todo: Todo) => {
      for (let prop in data) {
        todo[prop] = data[prop];
      }
      return todo;
    });
  }
  
  removeOneById(id: string): Rx.Observable<Todo> {
    return this.findOneById(id).do((todo: Todo) => {
      this.todos = this.todos.filter((it: Todo) => it.id !== todo.id);
    });
  }

  find(): Rx.Observable<Todo[]> {
    return Rx.Observable.from([this.todos]);
  }
  
  findOneById(id: string): Rx.Observable<Todo> {
    const todo = this.todos.find((it: Todo) => it.id === id);
		return Rx.Observable.from([todo]);
	}  
   
  private nextId() {
    return `${++this.seq}`;
  }
}


export function main() {
  describe('Todo component', () => {
    
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

    it('should work', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.overrideViewProviders(TodoCmp, [provide(TodoService, {useClass: MockTodoService})])
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

        const newTodo = { title: `Some new task #: ${originalLength + 1}` };

        todoInstance.saveOne(newTodo);

        fixture.detectChanges();
        
        expect(obtainTodosLenght()).toBe(originalLength + 1);
        
        const existingTodo = JSON.parse(JSON.stringify(todoInstance.todos[0]));
        existingTodo.title = `Changed title ${Date.now()}`;
        
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
}

