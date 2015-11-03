import {TodoService} from './todo_service';

export function main() {
  describe('Todo Service', () => {
    
    let todoService: TodoService;

    beforeEach(() => {
      todoService = new TodoService;
    });

    it('should return the list of todos', () => {
      const todos = todoService.search();
      expect(todos).toEqual(jasmine.any(Array));
    });
  });
}
