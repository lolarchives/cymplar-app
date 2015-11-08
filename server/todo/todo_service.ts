import {Todo} from '../../client/components/core/dto';
import {TodoServiceMock} from '../../client/components/todo/todo_service_mock';

// import * as model from '../persistence/model';

// model['user'].find().then((resp: any) => {
// 	console.log('resp', resp);
// });


export class TodoService {

  private todos: Todo[] = TodoServiceMock.todos;

	createOne(data: Todo): Promise<Todo> {
		const todo = TodoServiceMock.buildTodo(data);
		this.todos.push(todo);
		return Promise.resolve(todo);
	}

	updateOne(data: Todo): Promise<Todo> {
		return this.findOneById(data.id).then(todo => {
			for (let prop in data) {
				todo[prop] = data[prop];
			}
			return todo;
		});
	}

	removeOneById(id: string): Promise<Todo> {
		return this.findOneById(id).then(todo => {
			this.todos = this.todos.filter(it => it.id !== todo.id);
			return todo;
		});
	}

	find(): Promise<Todo[]> {
		return Promise.resolve(this.todos);
	}

	findOneById(id: string): Promise<Todo> {
		let todo: Todo;
		for (let i = 0; i < this.todos.length; i++) {
			if (this.todos[i].id === id) {
				todo = this.todos[i];
				break;
			}
		}
		return Promise.resolve(todo);
	}

}


export const todoService = new TodoService();
