import {
  provide,
  Type
} from 'angular2/angular2';
import {
  TestComponentBuilder,
  describe,
  expect,
  injectAsync,
  it,
  beforeEachProviders
} from 'angular2/testing';
import * as Rx from '@reactivex/rxjs/dist/cjs/Rx';

import {ObjectUtil} from '../core/object_util';
import {TodoCmp} from './todo';
import {TodoService} from './todo_service';
import {Todo} from '../core/dto';
import {TodoServiceMock} from './todo_service_mock';


export function main() {
  describe('Todo component', () => {

    it('should work', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.overrideViewProviders(TodoCmp, [provide(TodoService, {useClass: TodoServiceMock})])
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

        const newTodo = TodoServiceMock.buildTodo({ title: `Some new task #: ${originalLength + 1}` }, false);
        todoInstance.saveOne(newTodo);

        fixture.detectChanges();
        
        expect(obtainTodosLenght()).toBe(originalLength + 1);
        
        const existingTodo = ObjectUtil.clone(todoInstance.todos[0]);
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

