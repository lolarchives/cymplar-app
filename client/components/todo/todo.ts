import {Component, Validators, CORE_DIRECTIVES, ViewEncapsulation,
FORM_DIRECTIVES, ControlGroup, Control} from 'angular2/angular2';
import * as Rx from '@reactivex/rxjs/dist/cjs/Rx';

import {TodoService} from './todo_service';
import {Todo} from '../core/dto';
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

  private form: ControlGroup;
  private todos: Todo[];

  constructor(private todoService: TodoService) {

    this.form = new ControlGroup({
      id: new Control(null),
      title: new Control(null, Validators.required)
    });

    this.find();
  }

  saveOne(data: Todo): Rx.Observable<Todo> {
    
    let obs: Rx.Observable<Todo>;
    
    if (data.id) {
      obs = this.todoService.updateOne(data);
    } else {
      obs = this.todoService.createOne(data);  
    }
    
    obs.subscribe((res: Todo) => {
      this.resetForm();
      this.find();
    });
    
    return obs;
  }

  removeOne(event: Event, data: Todo): Rx.Observable<Todo> {
    
    event.stopPropagation();
        
    const obs = this.todoService.removeOneById(data.id);
    
    obs.subscribe((res: Todo) => {
      this.resetForm();
      this.find();
    });
    
    return obs;    
  }

  selectOne(data: Todo): Rx.Observable<Todo> {
    const obs = this.todoService.findOneById(data.id);
    obs.subscribe((res: Todo) => {
      this.resetForm(res);
    });
    return obs;
  }

  find(): Rx.Observable<Todo[]> {
    const obs = this.todoService.find();
    obs.subscribe((res: Todo[]) => {
      this.todos = res;
    });
    return obs;
  }

  resetForm(data: Todo = {}): void {
    for (let prop in this.form.controls) {
      (<Control> this.form.controls[prop]).updateValue(data[prop]);
    }
  }
}
