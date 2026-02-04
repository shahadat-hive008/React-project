import { useEffect, useState } from "react";
import type { Todo } from "../typescript/interface";
import { loadTodos } from "../utils/loadTodos";

/**
 * useTodos hook, managing todos state and saving to local storage.
 * Returns an object containing todos state, setTodos, addTodo, setCompleteTodo, updateTodoText, deleteTodo, clearAll, clearCompleted, and toggleAll functions.
 * @param {string} storageKey - Key to use for saving todos to local storage.
 * @return {Object} - An object containing todos state, setTodos, addTodo, setCompleteTodo, updateTodoText, deleteTodo, clearAll, clearCompleted, and toggleAll functions.
 */
export function useTodos(storageKey: string) {
  //todos save state
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos(storageKey));
  //Save todos into local storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [todos]);

  //Add todo in statw
  const addTodo = (text: string, priority: Todo["priority"]) => {
    setTodos((prev) => [
      {
        id: Date.now(),
        text,
        completed: false,
        createdAt: Date.now(),
        priority,
      },
      ...prev,
    ]);
  };

  //Completed todo action
  const setCompleteTodo = (id: number) => {
    setTodos((prev) => {
      return prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
    });
  };

  //Edit todo text
  const updateTodoText = (id: number, text: string) => {
    setTodos((prev) => {
      return prev.map((todo) => (todo.id === id ? { ...todo, text } : todo));
    });
  };

  //Delete todo
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Clear all Todos
  const clearAll = () => {
    setTodos([]);
  };

  //Clear Completed todos
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  //Mark all complete or active todo
  const toggleAll = (completed: boolean) => {
    setTodos(prev => prev.map(t => ({ ...t, completed })));
  };

  return{
    todos,
    setTodos,
    addTodo,
    setCompleteTodo,
    updateTodoText,
    deleteTodo,
    clearAll,
    clearCompleted,
    toggleAll
  };
}
