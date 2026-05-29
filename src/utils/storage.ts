import type { Todo } from '../types';

const STORAGE_KEY = 'focusflow-todos';

export const storage = {
  loadTodos(): Todo[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load todos from storage:', error);
    }
    return [];
  },

  saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to storage:', error);
    }
  },
};