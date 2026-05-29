import { useState, useEffect } from 'react';
import type { Activity } from '../types';
import { storage } from '../utils/storage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Activity[]>([]);

  useEffect(() => {
    const saved = storage.loadTodos();
    setTodos(saved);
  }, []);

  const addTodo = (text: string, dueTime?: string) => {
    const newTodo: Activity = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      pomodoros: 0,
      createdAt: new Date().toISOString(),
      dueTime,
      duration: 25,
      timeSpent: 0,
    };
    setTodos((prev) => {
      const updated = [...prev, newTodo];
      storage.saveTodos(updated);
      return updated;
    });
  };

  const updateTodo = (id: string, newText: string, newDueTime?: string) => {
    setTodos((prev) => {
      const updated = prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText.trim(), dueTime: newDueTime } : todo
      );
      storage.saveTodos(updated);
      return updated;
    });
  };

  const toggleComplete = (id: string) => {
    setTodos((prev) => {
      const updated = prev.map((todo) => {
        if (todo.id !== id) return todo;
        const now = new Date().toISOString();
        const completed = !todo.completed;
        return {
          ...todo,
          completed,
          completedAt: completed ? now : undefined,
        };
      });
      storage.saveTodos(updated);
      return updated;
    });
  };

  const incrementPomodoro = (id: string) => {
    setTodos((prev) => {
      const updated = prev.map((todo) =>
        todo.id === id ? { ...todo, pomodoros: todo.pomodoros + 1 } : todo
      );
      storage.saveTodos(updated);
      return updated;
    });
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      storage.saveTodos(updated);
      return updated;
    });
  };

  return { todos, addTodo, updateTodo, toggleComplete, incrementPomodoro, deleteTodo };
};