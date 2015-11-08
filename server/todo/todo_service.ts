import {Todo} from '../../client/components/core/dto';
import {ObjectUtil} from '../../client/components/core/util';
import {todos, buildTodo} from '../../client/components/todo/todo_mock';

// import * as model from '../persistence/model';

// model['user'].find().then((resp: any) => {
// 	console.log('resp', resp);
// });


export class TodoService {

	createOne(data: Todo): Promise<Todo> {
		const todo = buildTodo(data);
		todos.push(todo);
		return Promise.resolve(todo);
	}

	updateOne(data: Todo): Promise<Todo> {
		return this.findOneById(data.id).then(todo => {
			ObjectUtil.merge(todo, data);
			return todo;
		});
	}

	removeOneById(id: string): Promise<Todo> {
		return this.findOneById(id).then(todo => {
			const index = this._findIndex(id);
			todos.splice(index, 1);
			return todo;
		});
	}

	find(): Promise<Todo[]> {
		return Promise.resolve(todos);
	}

	findOneById(id: string): Promise<Todo> {
		const index = this._findIndex(id);
		const todo = todos[index];		
		return Promise.resolve(todo);
	}
	
	private _findIndex(id: string): number {
    let todo: Todo;
    const n = todos.length;
    for (let i = 0; i < n; i++) {
      const it = todos[i];
      if (it.id === id) {
        return i;
      }
    }
    return -1;
  }

}


export const todoService = new TodoService();
