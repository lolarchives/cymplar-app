import {Todo} from '../../shared/dto';
// import * as model from '../persistence/model';

let seq = 0;

let todos: Todo[] = [
	{ id: ++seq, title: 'Angular2 Router', status: 'done', createdAt: Date.now() },
	{ id: ++seq, title: 'Angular2 Component', status: 'done', createdAt: Date.now() },
	{ id: ++seq, title: 'Angular2 Core Directives', status: 'done', createdAt: Date.now() },
	{ id: ++seq, title: 'Angular2 Custom Directives', status: 'done', createdAt: Date.now() },
	{ id: ++seq, title: 'Angular2 Dependence Injection', status: 'done', createdAt: Date.now() },
	{ id: ++seq, title: 'Angular2 Form', status: 'done', createdAt: Date.now() },
	{ id: ++seq, title: 'Include Development environment', status: 'done', createdAt: Date.now() },
	{ id: ++seq, title: 'Include Production environment', status: 'pending', createdAt: Date.now() },
	{ id: ++seq, title: 'Unit tests', status: 'done', createdAt: Date.now() }
];

// model['user'].find().then((resp: any) => {
// 	console.log('resp', resp);
// });


export class TodoService {

	create(data: Todo): Promise<Todo> {
		const todo = data;
		todo.id = ++seq;
		todo.status = 'pending';
		todo.createdAt = Date.now();
		todos.push(todo);
		return Promise.resolve(todo);
	}

	update(data: Todo): Promise<Todo> {
		let todo: Todo;
		for (let i = 0, n = todos.length; i < n; i++) {
			if (todos[i].id === data.id) {
				todo = todos[i];
				break;
			}
		}
		for (const prop in data) {
			todo[prop] = data[prop];
		}
		return Promise.resolve(todo);
	}

	delete(id: number): Promise<number> {
		const originalLength = todos.length;
		todos = todos.filter(it => it.id !== id);
		const affected = originalLength - todos.length;
		return Promise.resolve(affected);
	}

	find(): Promise<Todo[]> {
		return Promise.resolve(todos);
	}
	
	findOne(id: number): Promise<Todo> {
		let todo: Todo;
		for (let i = 0; i < todos.length; i++) {
			if (todos[i].id === id) {
				todo = todos[i];
			}
		}
		return Promise.resolve(todo);
	}

}


export const todoService = new TodoService();
