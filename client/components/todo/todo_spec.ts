import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it
} from 'angular2/testing';
import {Component, View} from 'angular2/angular2';
import {TodoCmp} from './todo';
import {TodoService} from '../../services/todo_service';

export function main() {
  describe('Todo component', () => {
    it('should work',
      injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, '<div><todo></todo></div>')
          .createAsync(TestComponent)
          .then((rootTC) => {

            const todoInstance = rootTC.debugElement.componentViewChildren[0].componentInstance;
            //const todoDomEl = rootTC.debugElement.componentViewChildren[0].nativeElement;

            const todoListLength = () => {
              return todoInstance.todoService.find().length;
            };

            //const itemsSelector = 'tbody tr';

            expect(todoInstance.todoService).toEqual(jasmine.any(TodoService));

            todoInstance.addOne({ title: 'Some new task' });
            // rootTC.detectChanges();

            expect(todoListLength()).toEqual(10);
            // expect(DOM.querySelectorAll(todoDomEl, itemsSelector).length).toEqual(todoListLength());

            // expect(DOM.querySelectorAll(todoDomEl, itemsSelector + ' td:first-child')[10].textContent).toEqual('Some new task');
          });
      }));
  });
}

@Component({ selector: 'test-cmp', bindings: [TodoService] })
@View({ directives: [TodoCmp] })
class TestComponent { }
