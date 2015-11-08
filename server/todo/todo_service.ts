import {Todo} from '../../shared/dto';
// import * as model from '../persistence/model';

// model['user'].find().then((resp: any) => {
// 	console.log('resp', resp);
// });


export class TodoService {
	
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

	createOne(data: Todo): Promise<Todo> {
		const todo = data;
		todo.id = this.nextId();
		todo.status = 'pending';
		todo.createdAt = Date.now();
		this.todos.push(todo);
		return Promise.resolve(todo);
	}

	updateOne(data: Todo): Promise<Todo> {
		return this.findOneById(data.id).then(todo => {
			for (const prop in data) {
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

  private nextId() {
    return `${++this.seq}`;
  }

}


export const todoService = new TodoService();
