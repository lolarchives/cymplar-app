import {Component, Validators, CORE_DIRECTIVES,
FORM_DIRECTIVES, ControlGroup, Control} from 'angular2/angular2';

import {TodoService} from './todo_service';
import {Todo} from '../../../shared/dto';
import {Autofocus} from '../../directives/Autofocus';
import {CustomOrderByPipe} from '../../pipes/CustomOrderByPipe';

@Component({
  selector: 'todo',
  templateUrl: './components/todo/todo.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, Autofocus],
  pipes: [CustomOrderByPipe],
  viewProviders: [TodoService]
})
export class TodoCmp {

  todoForm: ControlGroup;
  todos: Todo[];

  constructor(private todoService: TodoService) {

    this.todoForm = new ControlGroup({
      title: new Control('', Validators.required)
    });

    this.search();
  }

  createOne() {
    const todo: Todo = this.todoForm.value;
    this.todoService.createOne(todo).subscribe((res: any) => {
      (<Control>this.todoForm.controls['title']).updateValue('');
      this.search();
    });    
  }

  removeOne(todo: Todo) {
    this.todoService.removeOne(todo.id).subscribe(() => this.search());
  }

  search() {
    this.todoService.search()
      .subscribe((res: any) => this.todos = res.todos);
  }
}
